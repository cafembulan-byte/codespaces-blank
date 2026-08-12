import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

const fallbackReviews = [
  {
    id: 1,
    name: 'Nadia',
    rating: 5,
    comment: 'The coffee and plantation view felt so peaceful. The cappuccino was excellent and the staff were warm and welcoming.',
    created_at: '2026-08-12T08:30:00.000Z',
  },
  {
    id: 2,
    name: 'Raka',
    rating: 5,
    comment: 'Perfect place for a morning coffee. The pour-over was smooth and the outdoor seating is beautiful.',
    created_at: '2026-08-11T10:15:00.000Z',
  },
]

export async function GET() {
  try {
    const reviews = await query<{ id: number; name: string; rating: number; comment: string; created_at: string }[]>(
      'SELECT id, name, rating, comment, created_at FROM reviews ORDER BY created_at DESC LIMIT 10'
    )
    return NextResponse.json(reviews.length ? reviews : fallbackReviews)
  } catch (error) {
    return NextResponse.json(fallbackReviews)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, rating, comment } = body

    if (!name || typeof rating !== 'number' || !comment) {
      return NextResponse.json({ message: 'Invalid review payload' }, { status: 400 })
    }

    const result = await query<any>(
      'INSERT INTO reviews (name, rating, comment, created_at) VALUES (?, ?, ?, NOW())',
      [name, rating, comment]
    )

    const insertId = result?.insertId ?? null
    const savedReview = {
      id: insertId ?? Date.now(),
      name,
      rating,
      comment,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(savedReview)
  } catch (error) {
    const body = await request.clone().json().catch(() => null)
    const fallbackReview = {
      id: Date.now(),
      name: body?.name ?? 'Guest',
      rating: Number(body?.rating ?? 5),
      comment: body?.comment ?? 'Thanks for your support!',
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(fallbackReview)
  }
}
