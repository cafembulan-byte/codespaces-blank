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

    const items = await all<any>('SELECT * FROM gallery_items ORDER BY id DESC')
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/admin/gallery error:', error)
    return NextResponse.json({ message: 'Failed to load gallery' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseReady()
    
    if (!isAuthorized()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, caption, image, position } = body || {}

    if (!title || !caption || !image) {
      return NextResponse.json({ message: 'Incomplete gallery item data.' }, { status: 400 })
    }

    await run('INSERT INTO gallery_items (title, caption, image, position) VALUES (?, ?, ?, ?)', [title, caption, image, position || 'grid'])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/admin/gallery error:', error)
    return NextResponse.json({ message: 'Unable to save gallery item' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDatabaseReady()
    
    if (!isAuthorized()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, caption, image, position } = body || {}

    if (!id || !title || !caption || !image) {
      return NextResponse.json({ message: 'Incomplete gallery update data.' }, { status: 400 })
    }

    await run('UPDATE gallery_items SET title = ?, caption = ?, image = ?, position = ? WHERE id = ?', [title, caption, image, position || 'grid', Number(id)])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PUT /api/admin/gallery error:', error)
    return NextResponse.json({ message: 'Unable to update gallery item' }, { status: 500 })
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
      return NextResponse.json({ message: 'Missing gallery id.' }, { status: 400 })
    }

    await run('DELETE FROM gallery_items WHERE id = ?', [Number(id)])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/gallery error:', error)
    return NextResponse.json({ message: 'Unable to delete gallery item' }, { status: 500 })
  }
}
