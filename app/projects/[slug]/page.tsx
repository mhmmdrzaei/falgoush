import { getProject, getSlugs } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import ImageSlider from '@/components/ImageSlider'
import styles from '@/styles/project.module.scss'

export const revalidate = false // static; refreshed on-demand via /api/revalidate (Sanity webhook)

export async function generateStaticParams() {
  const slugs = await getSlugs('project')
  return slugs.map((slug) => ({ slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) return notFound()

  return (
    <article className={styles.projectPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.year && <p className={styles.year}>{project.year}</p>}
      </header>

      {project.images?.length > 0 && (
        <div className={styles.slider}>
          <ImageSlider images={project.images} alt={project.title} />
        </div>
      )}

      <div className={styles.content}>
        {project.body && (
          <div className={styles.body}>
            <PortableText value={project.body} />
          </div>
        )}

        {project.linkedShopItem?.slug && (
          <Link href={`/shop/${project.linkedShopItem.slug}`} className={styles.shopButton}>
            See project in shop
          </Link>
        )}
      </div>
    </article>
  )
}
