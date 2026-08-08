import { getStripe } from '@/lib/stripe'
import { sanityClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

interface CartItem {
  id: string
  quantity: number
}

interface ShopDoc {
  _id: string
  title: string
  price: number
  productType: 'digital' | 'physical'
  shippingCost?: number
  inventory?: number
}

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json()

  if (!items?.length) {
    return NextResponse.json({ error: 'No items' }, { status: 400 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' },
      { status: 500 }
    )
  }

  // Look up the real price/shipping/stock from Sanity — never trust client prices
  const ids = items.map((i) => i.id)
  const docs: ShopDoc[] = await sanityClient.fetch(
    `*[_type == "shopItem" && _id in $ids]{
      _id, title, price, productType, shippingCost, inventory
    }`,
    { ids }
  )
  const docById = new Map(docs.map((d) => [d._id, d]))

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  let totalShippingCents = 0
  let hasPhysical = false

  for (const item of items) {
    const doc = docById.get(item.id)
    if (!doc) {
      return NextResponse.json({ error: 'An item is no longer available.' }, { status: 400 })
    }
    if (typeof doc.price !== 'number' || doc.price <= 0) {
      return NextResponse.json(
        { error: `No price set for "${doc.title}".` },
        { status: 400 }
      )
    }
    // Block checkout if the edition has sold out
    if (typeof doc.inventory === 'number' && doc.inventory <= 0) {
      return NextResponse.json(
        { error: `"${doc.title}" is sold out.` },
        { status: 400 }
      )
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: doc.title },
        unit_amount: Math.round(doc.price * 100),
      },
      quantity: item.quantity,
    })

    if (doc.productType === 'physical') {
      hasPhysical = true
      if (doc.shippingCost) {
        totalShippingCents += Math.round(doc.shippingCost * 100) * item.quantity
      }
    }
  }

  const stripe = getStripe()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      // Physical goods: US-only shipping, with the cumulated shipping fee shown as shipping
      ...(hasPhysical && {
        shipping_address_collection: { allowed_countries: ['US'] },
      }),
      ...(totalShippingCents > 0 && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: totalShippingCents, currency: 'usd' },
              display_name: 'Shipping',
            },
          },
        ],
      }),
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            id: i.id,
            type: docById.get(i.id)?.productType,
            qty: i.quantity,
          }))
        ),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
