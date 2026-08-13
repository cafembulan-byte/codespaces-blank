import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { all, run, ensureDatabaseReady } from '@/lib/sqlite'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function isAuthorized() {
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')?.value
  return isAdminAuthenticated(session)
}

export async function GET() {
  try {
    await ensureDatabaseReady()
    
    if (!isAuthorized()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const items = await all<any>('SELECT * FROM reviews ORDER BY created_at DESC')
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/reviews error:', error)
    return NextResponse.json({ message: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseReady()
    
    if (!isAuthorized()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, rating, comment } = body || {}

    if (!name || !comment || !rating) {
      return NextResponse.json({ message: 'Incomplete review data.' }, { status: 400 })
    }

    await run('INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)', [name, rating, comment])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/admin/reviews error:', error)
    return NextResponse.json({ message: 'Unable to save review' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDatabaseReady()
    
    if (!isAuthorized()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, rating, comment } = body || {}

    if (!id || !name || !comment || !rating) {
      return NextResponse.json({ message: 'Incomplete review update data.' }, { status: 400 })
    }

    await run('UPDATE reviews SET name = ?, rating = ?, comment = ? WHERE id = ?', [name, Number(rating), comment, Number(id)])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PUT /api/admin/reviews error:', error)
    return NextResponse.json({ message: 'Unable to update review' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureDatabaseReady()
    
    if (!isAuthorized()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'Missing review id.' }, { status: 400 })
    }

    await run('DELETE FROM reviews WHERE id = ?', [Number(id)])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/reviews error:', error)
    return NextResponse.json({ message: 'Unable to delete review' }, { status: 500 })
  }
}
