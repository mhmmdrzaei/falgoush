'use client'

import { useEffect } from 'react'

// Enables scroll-snapping on <html> while the home page is mounted, and
// cleans it up on navigation so other pages scroll normally.
export default function HomeScrollSnap() {
  useEffect(() => {
    document.documentElement.classList.add('snap')
    return () => document.documentElement.classList.remove('snap')
  }, [])

  return null
}
