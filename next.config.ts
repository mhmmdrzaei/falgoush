import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
  },
  images: {
    // Offload all image resizing/optimization to Sanity's CDN (free) instead
    // of Vercel's Image Optimization, to stay well within the Hobby plan.
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
