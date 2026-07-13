import Link from 'next/link'
import styles from '@/styles/shop.module.scss'

export default function SuccessPage() {
  return (
    <div className={styles.successPage}>
      <h1>Thank you for your order!</h1>
      <p>
        If you purchased a digital item, check your email for your download.
        Physical orders ship to US addresses only.
      </p>
      <Link href="/shop">Continue Shopping</Link>
    </div>
  )
}
