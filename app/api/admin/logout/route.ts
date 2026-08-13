import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  })

  return response
}
