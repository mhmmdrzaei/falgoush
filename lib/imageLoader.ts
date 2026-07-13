// Custom Next.js image loader that serves resized/optimized images straight
// from Sanity's CDN instead of Vercel's Image Optimization. This keeps image
// transforms off Vercel entirely (no CPU / no image quota usage) while still
// producing responsive srcsets.
interface LoaderArgs {
  src: string
  width: number
  quality?: number
}

export default function sanityImageLoader({ src, width, quality }: LoaderArgs): string {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 75))
  url.searchParams.set('auto', 'format')
  return url.toString()
}
