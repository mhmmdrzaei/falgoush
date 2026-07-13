'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { urlFor } from '@/lib/sanityImage'
import { useCart } from './CartProvider'
import styles from './Nav.module.scss'

interface NavLink { label: string; href: string }
interface SiteSettings {
  siteName?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo?: any
  navLinks?: NavLink[]
}

export default function Nav({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          {settings.logo ? (
            <Image
              className={styles.logoImg}
              src={urlFor(settings.logo).width(200).url()}
              alt={settings.siteName || 'Logo'}
              width={100}
              height={100}
              priority
            />
          ) : (
            <span>{settings.siteName || 'Falgoush'}</span>
          )}
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {settings.navLinks?.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartIcon} aria-label="Cart">
            <CartSvg />
            {totalItems > 0 && (
              <span className={styles.cartCount}>{totalItems}</span>
            )}
          </Link>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  )
}

function CartSvg() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}
