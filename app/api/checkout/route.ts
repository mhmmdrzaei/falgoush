import { getStripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  stripePriceId: string
  productType: 'digital' | 'physical'
  shippingCost?: number
}

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json()

  if (!items?.length) {
    return NextResponse.json({ error: 'No items' }, { status: 400 })
  }

  const stripe = getStripe()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const hasPhysical = items.some((i) => i.productType === 'physical')

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price: item.stripePriceId,
    quantity: item.quantity,
  }))

  // Cumulate per-item shipping as a single line item
  const totalShippingCents = items
    .filter((i) => i.productType === 'physical' && i.shippingCost)
    .reduce((sum, i) => sum + Math.round((i.shippingCost || 0) * 100) * i.quantity, 0)

  if (totalShippingCents > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping' },
        unit_amount: totalShippingCents,
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    ...(hasPhysical && {
      shipping_address_collection: { allowed_countries: ['US'] },
    }),
    success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      items: JSON.stringify(
        items.map((i) => ({ id: i.id, type: i.productType, qty: i.quantity }))
      ),
    },
  })

  return NextResponse.json({ url: session.url })
}
