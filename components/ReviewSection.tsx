'use client'

import { FormEvent, useEffect, useState } from 'react'

type Review = {
  id: number
  name: string
  rating: number
  comment: string
  created_at: string
}

const initialFormState = {
  name: '',
  rating: '5',
  comment: '',
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [form, setForm] = useState(initialFormState)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch('/api/reviews')
        if (!response.ok) throw new Error('Unable to load reviews')
        const json = await response.json()
        setReviews(json)
      } catch (err) {
        setError((err as Error).message)
      }
    }

    loadReviews()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          rating: Number(form.rating),
          comment: form.comment,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to save review')
      }

      const newReview = await response.json()
      setReviews((current) => [newReview, ...current])
      setForm(initialFormState)
      setStatus('success')
    } catch (err) {
      setError((err as Error).message)
      setStatus('error')
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700">Community & Reviews</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl">Share your experience with our coffee family</h2>
          <p className="mt-3 mx-auto max-w-2xl text-base leading-7 text-amber-700/90">
            Leave a review and read what fellow guests say about our cafe and plantation visits.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-amber-100/80 bg-[#f9f2ea] p-10 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-amber-900">
                  Name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-3 w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 text-amber-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-semibold text-amber-900">
                  Rating
                </label>
                <select
                  id="rating"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="mt-3 w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 text-amber-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                >
                  {[5, 4, 3, 2, 1].map((score) => (
                    <option key={score} value={score}>
                      {score} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-amber-900">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={5}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  required
                  className="mt-3 w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 text-amber-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center rounded-full bg-amber-700 px-8 py-4 text-base font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
                </button>
                {status === 'success' && <p className="text-sm font-semibold text-emerald-700">Review added!</p>}
                {status === 'error' && <p className="text-sm font-semibold text-rose-600">{error}</p>}
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-soft">
                <p className="font-semibold">Unable to load reviews right now.</p>
                <p className="mt-2 text-sm">Try again later or refresh the page.</p>
              </div>
            )}

            {reviews.length === 0 && !error ? (
              <div className="rounded-3xl border border-amber-100/80 bg-white p-8 shadow-soft">
                <p className="text-lg font-semibold text-amber-950">No reviews yet</p>
                <p className="mt-3 text-amber-700/90">Be the first to share your coffee experience.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-[2rem] border border-amber-100/80 bg-white p-8 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-amber-950">{review.name}</p>
                      <p className="mt-1 text-sm text-amber-700/80">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                      {review.rating}★
                    </div>
                  </div>
                  <p className="mt-5 text-amber-700/90">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
