import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Called by a Sanity webhook whenever content is published/changed.
// Purges the whole site's static cache so the next visitor gets fresh content —
// no time-based ISR needed, so regeneration only happens when content changes.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // Revalidate every route that shares the root layout (the entire site).
  revalidatePath('/', 'layout')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
