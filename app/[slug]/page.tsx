import { getPage, getSlugs } from '@/lib/sanity'
import { urlFor } from '@/lib/sanityImage'
import PageBlocks from '@/components/PageBlocks'
import { notFound } from 'next/navigation'
import styles from '@/styles/page.module.scss'

export const revalidate = false // static; refreshed on-demand via /api/revalidate (Sanity webhook)

export async function generateStaticParams() {
  const slugs = await getSlugs('page')
  // 'home' is served by the / route, so skip it here
  return slugs.filter((slug) => slug !== 'home').map((slug) => ({ slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) return notFound()

  return (
    <div
      className={styles.page}
      style={
        page.backgroundImage
          ? { backgroundImage: `url(${urlFor(page.backgroundImage).width(1920).url()})` }
          : undefined
      }
    >
      {page.backgroundImage && <div className={styles.overlay} />}
      <div className={styles.content}>
        <PageBlocks blocks={page.blocks} />
      </div>
    </div>
  )
}
