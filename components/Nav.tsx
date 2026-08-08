'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
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

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
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

        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartIcon} aria-label="Cart" onClick={closeMenu}>
            <CartSvg />
            {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
          </Link>

          {/* Desktop links */}
          <ul className={styles.desktopLinks}>
            {settings.navLinks?.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <ul>
          {settings.navLinks?.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
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
