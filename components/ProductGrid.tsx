import ProductCard from './ProductCard'
import styles from './ProductGrid.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductGrid({ items }: { items: any[] }) {
  if (!items?.length) {
    return <p className={styles.empty}>No products available.</p>
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <ProductCard key={item._id} item={item} />
      ))}
    </div>
  )
}
