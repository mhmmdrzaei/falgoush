'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityImage'
import styles from './ImageSlider.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImageSlider({ images, alt }: { images: any[]; alt?: string }) {
  const [index, setIndex] = useState(0)

  if (!images?.length) return null

  const count = images.length
  const go = (next: number) => setIndex((next + count) % count)

  return (
    <div className={styles.slider}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div className={styles.slide} key={i}>
              <Image
                className={styles.slideImg}
                src={urlFor(img).width(1600).url()}
                alt={alt || ''}
                width={1600}
                height={1066}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              className={`${styles.arrow} ${styles.prev}`}
              onClick={() => go(index - 1)}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className={`${styles.arrow} ${styles.next}`}
              onClick={() => go(index + 1)}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className={styles.controls}>
          <button
            className={styles.navBtn}
            onClick={() => go(index - 1)}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === index ? styles.active : ''}`}
                onClick={() => go(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.navBtn}
            onClick={() => go(index + 1)}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
