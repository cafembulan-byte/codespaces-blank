import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin'
import { ensureDatabaseReady } from '@/lib/sqlite'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    await ensureDatabaseReady()
    
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: 'Email and password are required.' }, { status: 400 })
    }

    const valid = await verifyAdmin(email, password)

    if (!valid) {
      return NextResponse.json({ ok: false, message: 'Invalid email or password.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, message: 'Login successful.' })

    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return response
  } catch (error) {
    console.error('POST /api/admin/login error:', error)
    return NextResponse.json({ ok: false, message: 'Unable to process login.' }, { status: 500 })
  }
}
