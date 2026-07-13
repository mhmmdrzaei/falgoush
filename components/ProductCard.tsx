import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityImage'
import styles from './ProductCard.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ item }: { item: any }) {
  const soldOut = typeof item.inventory === 'number' && item.inventory <= 0

  return (
    <Link href={`/shop/${item.slug?.current}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {item.images?.[0] && (
          <Image
            src={urlFor(item.images[0]).width(600).url()}
            alt={item.title}
            width={600}
            height={600}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        )}
        {soldOut && <span className={styles.soldOut}>Sold Out</span>}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.price}>${item.price?.toFixed(2)}</p>
      </div>
    </Link>
  )
}
