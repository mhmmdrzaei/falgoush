import { getPage, getProjects, getSiteSettings } from '@/lib/sanity'
import { urlFor } from '@/lib/sanityImage'
import Image from 'next/image'
import ProjectsFeed from '@/components/ProjectsFeed'
import HomeScrollSnap from '@/components/HomeScrollSnap'
import styles from '@/styles/home.module.scss'

export const revalidate = false // static; refreshed on-demand via /api/revalidate (Sanity webhook)

export default async function HomePage() {
  const [page, projects, settings] = await Promise.all([
    getPage('home'),
    getProjects(),
    getSiteSettings(),
  ])

  const heroImage = page?.backgroundImage
  const siteName = settings?.siteName || 'Falgoush'

  return (
    <>
      <HomeScrollSnap />
      <section className={styles.hero}>
        {heroImage && (
          <Image
            className={styles.heroImg}
            src={urlFor(heroImage).width(2400).url()}
            alt={siteName}
            width={2400}
            height={1600}
            priority
          />
        )}
        {/* <h1 className={styles.heroTitle}>{siteName}</h1> */}
      </section>

      <ProjectsFeed projects={projects || []} />
    </>
  )
}
