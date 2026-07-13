import type { Metadata } from 'next'
import SiteChrome from '@/components/SiteChrome'
import { getSiteSettings } from '@/lib/sanity'
import { urlFor } from '@/lib/sanityImage'
import '@/styles/globals.scss'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.siteName || 'Falgoush'
  const iconUrl = settings?.logo
    ? urlFor(settings.logo).width(64).height(64).fit('crop').url()
    : undefined

  return {
    title: siteName,
    description:
      'An experimental publishing and curatorial project exploring Iranian narratives.',
    ...(iconUrl && {
      icons: {
        icon: iconUrl,
        shortcut: iconUrl,
        apple: settings?.logo
          ? urlFor(settings.logo).width(180).height(180).fit('crop').url()
          : iconUrl,
      },
    }),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="en">
      <body>
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  )
}
