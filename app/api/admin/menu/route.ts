import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { all, run } from '@/lib/sqlite'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function isAuthorized() {
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')?.value
  return isAdminAuthenticated(session)
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await all<any>('SELECT * FROM menu_items ORDER BY id DESC')
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load menu' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { category, name, description, price, badge } = body || {}

    if (!category || !name || !description || !price) {
      return NextResponse.json({ message: 'Incomplete menu data.' }, { status: 400 })
    }

    await run(
      'INSERT INTO menu_items (category, name, description, price, badge) VALUES (?, ?, ?, ?, ?)',
      [category, name, description, price, badge || '']
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ message: 'Unable to save menu item' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, category, name, description, price, badge } = body || {}

    if (!id || !category || !name || !description || !price) {
      return NextResponse.json({ message: 'Incomplete menu update data.' }, { status: 400 })
    }

    await run(
      'UPDATE menu_items SET category = ?, name = ?, description = ?, price = ?, badge = ? WHERE id = ?',
      [category, name, description, price, badge || '', Number(id)]
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ message: 'Unable to update menu item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'Missing menu id.' }, { status: 400 })
    }

    await run('DELETE FROM menu_items WHERE id = ?', [Number(id)])
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ message: 'Unable to delete menu item' }, { status: 500 })
  }
}
