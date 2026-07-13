'use client'

import { useState } from 'react'
import { useCart } from './CartProvider'
import { urlFor } from '@/lib/sanityImage'
import styles from './AddToCart.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddToCart({ item, soldOut }: { item: any; soldOut: boolean }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem({
      id: item._id,
      title: item.title,
      price: item.price,
      quantity: qty,
      stripePriceId: item.stripePriceId,
      productType: item.productType,
      shippingCost: item.shippingCost,
      image: item.images?.[0] ? urlFor(item.images[0]).width(200).height(200).url() : undefined,
    })
  }

  return (
    <div className={styles.wrap}>
      {!soldOut && (
        <div className={styles.qty}>
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase">+</button>
        </div>
      )}
      <button className={styles.btn} onClick={handleAdd} disabled={soldOut}>
        {soldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
    </div>
  )
}
