'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityImage'
import styles from './ProjectsFeed.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectRow({ project }: { project: any }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={ref}
      className={`${styles.row} ${visible ? styles.visible : ''}`}
    >
      <Link href={`/projects/${project.slug?.current}`} className={styles.link}>
        {project.images?.[0] && (
          <div className={styles.imageWrap}>
            <Image
              className={styles.image}
              src={urlFor(project.images[0]).width(1600).url()}
              alt={project.title}
              width={1600}
              height={1000}
            />
          </div>
        )}
        <div className={styles.meta}>
          <h2 className={styles.title}>{project.title}</h2>
          {project.year && <span className={styles.year}>{project.year}</span>}
        </div>
      </Link>
    </article>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectsFeed({ projects }: { projects: any[] }) {
  if (!projects?.length) return null

  return (
    <section className={styles.feed}>
      {projects.map((project) => (
        <ProjectRow key={project._id} project={project} />
      ))}
    </section>
  )
}
