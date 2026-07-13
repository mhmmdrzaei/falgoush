import { getShopItems } from '@/lib/sanity'
import ProductGrid from '@/components/ProductGrid'
import styles from '@/styles/shop.module.scss'

export const revalidate = 30

export default async function ShopPage() {
  const items = await getShopItems()

  return (
    <div className={styles.shopPage}>
      <h1 className={styles.heading}>Shop</h1>
      <ProductGrid items={items} />
    </div>
  )
}
