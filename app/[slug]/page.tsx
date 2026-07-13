import { getPage } from '@/lib/sanity'
import { urlFor } from '@/lib/sanityImage'
import PageBlocks from '@/components/PageBlocks'

export const revalidate = 30
import { notFound } from 'next/navigation'
import styles from '@/styles/page.module.scss'

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
