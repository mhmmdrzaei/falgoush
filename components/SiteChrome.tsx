'use client'

import { usePathname } from 'next/navigation'
import { CartProvider } from './CartProvider'
import Nav from './Nav'
import Footer from './Footer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SiteChrome({ settings, children }: { settings: any; children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  // Studio renders standalone — no site nav/footer/cart chrome
  if (isStudio) return <>{children}</>

  return (
    <CartProvider>
      <Nav settings={settings || {}} />
      <main>{children}</main>
      <Footer settings={settings || {}} />
    </CartProvider>
  )
}
