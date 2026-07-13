import { createClient } from '@sanity/client'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
}

// CDN caches responses (fast, but can be stale). Disable in dev so Studio
// edits show immediately; keep it on in production for speed.
export const sanityClient = createClient({
  ...config,
  useCdn: process.env.NODE_ENV === 'production',
})

// Server-only write client — only import in API routes
export const sanityWriteClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const safe = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  try { return await fn() } catch { return null }
}

export const getSiteSettings = () =>
  safe(() => sanityClient.fetch(`*[_type == "siteSettings"][0]`))

export const getPage = (slug: string) =>
  safe(() => sanityClient.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug }))

export const getShopItems = () =>
  safe(() => sanityClient.fetch(`*[_type == "shopItem"] | order(_createdAt desc)`))

export const getShopItem = (slug: string) =>
  safe(() =>
    sanityClient.fetch(
      `*[_type == "shopItem" && slug.current == $slug][0]{
        ...,
        "linkedProject": *[_type == "project" && references(^._id)][0]{
          title, "slug": slug.current
        }
      }`,
      { slug }
    )
  )

export const getProjects = () =>
  safe(() => sanityClient.fetch(`*[_type == "project"] | order(year desc, _createdAt desc)`))

export const getProject = (slug: string) =>
  safe(() =>
    sanityClient.fetch(
      `*[_type == "project" && slug.current == $slug][0]{
        ...,
        linkedShopItem->{ title, "slug": slug.current }
      }`,
      { slug }
    )
  )
