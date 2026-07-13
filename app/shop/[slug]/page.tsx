import { getShopItem, getSlugs } from '@/lib/sanity'
import { urlFor } from '@/lib/sanityImage'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import AddToCart from '@/components/AddToCart'
import styles from '@/styles/product.module.scss'

export const revalidate = false // static; refreshed on-demand via /api/revalidate (Sanity webhook)

export async function generateStaticParams() {
  const slugs = await getSlugs('shopItem')
  return slugs.map((slug) => ({ slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const item = await getShopItem(slug)

  if (!item) return notFound()

  const soldOut = typeof item.inventory === 'number' && item.inventory <= 0

  return (
    <div className={styles.productPage}>
      <div className={styles.images}>
        {item.images?.map((img: unknown, i: number) => (
          <Image
            key={i}
            src={urlFor(img).width(900).url()}
            alt={item.title}
            width={900}
            height={900}
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.price}>${item.price?.toFixed(2)}</p>

        {item.description && (
          <div className={styles.description}>
            <PortableText value={item.description} />
          </div>
        )}

        {item.productType === 'physical' && (
          <p className={styles.shippingNote}>Ships to USA only.</p>
        )}
        {item.productType === 'digital' && (
          <p className={styles.shippingNote}>Digital delivery — worldwide.</p>
        )}

        <AddToCart item={item} soldOut={soldOut} />

        {item.linkedProject?.slug && (
          <Link href={`/projects/${item.linkedProject.slug}`} className={styles.linkButton}>
            See project details
          </Link>
        )}
      </div>
    </div>
  )
}
