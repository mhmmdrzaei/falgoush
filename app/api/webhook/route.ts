import { getStripe } from '@/lib/stripe'
import { Resend } from 'resend'
import { sanityWriteClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  const customerEmail = session.customer_details?.email
  const itemsMeta: { id: string; type: string; qty: number }[] = JSON.parse(
    session.metadata?.items || '[]'
  )

  for (const meta of itemsMeta) {
    const doc = await sanityWriteClient.fetch(
      `*[_type == "shopItem" && _id == $id][0]{
        inventory, downloadCode,
        "fileUrl": digitalFile.asset->url
      }`,
      { id: meta.id }
    )

    if (!doc) continue

    // Decrement inventory in Sanity. The live shop pages refresh on your next
    // publish (Sanity webhook → /api/revalidate) or git push (Vercel rebuild).
    if (typeof doc.inventory === 'number') {
      await sanityWriteClient
        .patch(meta.id)
        .set({ inventory: Math.max(0, doc.inventory - meta.qty) })
        .commit()
    }

    // Send digital delivery email
    if (meta.type === 'digital' && customerEmail) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      let deliveryHtml = '<p>Your download will be with you shortly.</p>'

      if (doc.downloadCode) {
        deliveryHtml = `<p>Your download code: <strong>${doc.downloadCode}</strong></p>`
      } else if (doc.fileUrl) {
        deliveryHtml = `<p><a href="${doc.fileUrl}">Click here to download your file</a></p>`
      }

      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@falgoush.com',
        to: customerEmail,
        subject: 'Your Falgoush Download',
        html: `<p>Thank you for your purchase!</p>${deliveryHtml}<p>— Falgoush</p>`,
      })
    }
  }

  return NextResponse.json({ received: true })
}
