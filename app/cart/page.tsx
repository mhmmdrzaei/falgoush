'use client'

import { useCart } from '@/components/CartProvider'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/cart.module.scss'

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems } = useCart()

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = items
    .filter((i) => i.productType === 'physical' && i.shippingCost)
    .reduce((sum, i) => sum + (i.shippingCost || 0) * i.quantity, 0)
  const total = subtotal + shipping

  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  if (!totalItems) {
    return (
      <div className={styles.cartPage}>
        <p className={styles.empty}>
          Your cart is empty. <Link href="/shop">Browse the shop</Link>.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.cartPage}>
      <h1>Cart</h1>
      <ul className={styles.itemList}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.image && (
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                style={{ objectFit: 'cover' }}
              />
            )}
            <div className={styles.itemInfo}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
            </div>
            <div className={styles.qtyControls}>
              <button type="button" onClick={() => updateQty(item.id, item.quantity - 1)} aria-label="Decrease">−</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Increase">+</button>
            </div>
            <button type="button" className={styles.remove} onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        {shipping > 0 && <p>Shipping: ${shipping.toFixed(2)}</p>}
        <p className={styles.total}>Total: ${total.toFixed(2)}</p>
        <button type="button" className={styles.checkoutBtn} onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  )
}
