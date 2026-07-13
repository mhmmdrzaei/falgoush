import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityImage'
import ContactForm from './ContactForm'
import styles from './PageBlocks.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PageBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null

  return (
    <div className={styles.blocks}>
      {blocks.map((block) => {
        switch (block._type) {
          case 'textBlock':
            return (
              <div
                key={block._key}
                className={styles.textBlock}
                style={{ textAlign: block.align || 'left' }}
              >
                <PortableText value={block.content} />
              </div>
            )

          case 'imageBlock':
            return (
              <figure
                key={block._key}
                className={`${styles.imageBlock} ${block.fullWidth ? styles.fullWidth : ''}`}
              >
                {block.image && (
                  <Image
                    src={urlFor(block.image).width(1200).url()}
                    alt={block.alt || ''}
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            )

          case 'textImageBlock': {
            const imgLeft = block.imagePosition === 'left'
            return (
              <div
                key={block._key}
                className={`${styles.textImageBlock} ${imgLeft ? styles.imgLeft : styles.imgRight}`}
              >
                <div className={styles.textSide}>
                  <PortableText value={block.content} />
                </div>
                {block.image && (
                  <div className={styles.imageSide}>
                    <Image
                      src={urlFor(block.image).width(800).url()}
                      alt={block.imageAlt || ''}
                      width={800}
                      height={600}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )}
              </div>
            )
          }

          case 'contactFormBlock':
            return <ContactForm key={block._key} introText={block.introText} />

          default:
            return null
        }
      })}
    </div>
  )
}
