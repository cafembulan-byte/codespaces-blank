'use client'

import { useEffect, useState } from 'react'

type MenuItem = {
  id: number
  category: string
  name: string
  description: string
  price: string
  badge: string
}

type ReviewItem = {
  id: number
  name: string
  rating: number
  comment: string
}

type GalleryItem = {
  id: number
  title: string
  caption: string
  image: string
  position: string
}

const emptyMenu = { category: 'Espresso Based', name: '', description: '', price: '', badge: '' }
const emptyReview = { name: '', rating: 5, comment: '' }
const emptyGallery = { title: '', caption: '', image: '', position: 'grid' }

export default function AdminDashboard({
  initialMenu,
  initialReviews,
  initialGallery,
}: {
  initialMenu: MenuItem[]
  initialReviews: ReviewItem[]
  initialGallery: GalleryItem[]
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu)
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(initialReviews)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGallery)

  const [menuForm, setMenuForm] = useState(emptyMenu)
  const [reviewForm, setReviewForm] = useState(emptyReview)
  const [galleryForm, setGalleryForm] = useState(emptyGallery)

  const [menuEditingId, setMenuEditingId] = useState<number | null>(null)
  const [reviewEditingId, setReviewEditingId] = useState<number | null>(null)
  const [galleryEditingId, setGalleryEditingId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [menuFilter, setMenuFilter] = useState('all')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [galleryFilter, setGalleryFilter] = useState('all')

  const menuCategories = Array.from(new Set(menuItems.map((item) => item.category)))
  const reviewStars = Array.from(new Set(reviewItems.map((item) => item.rating))).sort((a, b) => b - a)
  const galleryPositions = Array.from(new Set(galleryItems.map((item) => item.position)))

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = !search || [item.name, item.description, item.category, item.badge].some((value) => value.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = menuFilter === 'all' || item.category === menuFilter
    return matchesSearch && matchesFilter
  })

  const filteredReviewItems = reviewItems.filter((item) => {
    const matchesSearch = !search || [item.name, item.comment].some((value) => value.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = reviewFilter === 'all' || item.rating === Number(reviewFilter)
    return matchesSearch && matchesFilter
  })

  const filteredGalleryItems = galleryItems.filter((item) => {
    const matchesSearch = !search || [item.title, item.caption, item.position].some((value) => value.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = galleryFilter === 'all' || item.position === galleryFilter
    return matchesSearch && matchesFilter
  })

  async function refreshData() {
    try {
      const [menuRes, reviewRes, galleryRes] = await Promise.all([
        fetch('/api/admin/menu'),
        fetch('/api/admin/reviews'),
        fetch('/api/admin/gallery'),
      ])

      if (menuRes.ok) setMenuItems(await menuRes.json())
      if (reviewRes.ok) setReviewItems(await reviewRes.json())
      if (galleryRes.ok) setGalleryItems(await galleryRes.json())
    } catch (error) {
      console.error('Failed to refresh admin data', error)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  async function saveMenu() {
    if (!menuForm.name || !menuForm.description || !menuForm.category || !menuForm.price) return

    setLoading(true)
    const method = menuEditingId ? 'PUT' : 'POST'
    const body = { ...menuForm, id: menuEditingId }

    const response = await fetch('/api/admin/menu', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)
    if (response.ok) {
      setMenuForm(emptyMenu)
      setMenuEditingId(null)
      await refreshData()
    }
  }

  async function deleteMenu(id: number) {
    const response = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' })
    if (response.ok) await refreshData()
  }

  async function saveReview() {
    if (!reviewForm.name || !reviewForm.comment) return

    setLoading(true)
    const method = reviewEditingId ? 'PUT' : 'POST'
    const body = { ...reviewForm, id: reviewEditingId }

    const response = await fetch('/api/admin/reviews', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)
    if (response.ok) {
      setReviewForm(emptyReview)
      setReviewEditingId(null)
      await refreshData()
    }
  }

  async function deleteReview(id: number) {
    const response = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
    if (response.ok) await refreshData()
  }

  async function saveGallery() {
    if (!galleryForm.title || !galleryForm.caption || !galleryForm.image) return

    setLoading(true)
    const method = galleryEditingId ? 'PUT' : 'POST'
    const body = { ...galleryForm, id: galleryEditingId }

    const response = await fetch('/api/admin/gallery', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)
    if (response.ok) {
      setGalleryForm(emptyGallery)
      setGalleryEditingId(null)
      await refreshData()
    }
  }

  async function deleteGallery(id: number) {
    const response = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
    if (response.ok) await refreshData()
  }

  return (
    <main className="min-h-screen bg-[#f8f1ea] px-4 py-12 text-[#241711]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-amber-200 bg-white/80 p-6 shadow-[0_18px_45px_rgba(78,48,28,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">Admin Control</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Harvest Grounds Dashboard</h1>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3 text-sm font-bold text-amber-950 shadow-[0_12px_25px_rgba(245,158,11,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(245,158,11,0.35)]"
            >
              <span aria-hidden="true">⎋</span>
              Logout
            </button>
          </form>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-amber-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-md">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu, reviews, or gallery..."
              className="w-full rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-[#2d1e14] outline-none ring-0 placeholder:text-[#7a5d4d]"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-[#533e2d]">
            <span className="rounded-full bg-amber-100 px-3 py-1.5 font-semibold text-amber-900">{menuItems.length + reviewItems.length + galleryItems.length} total items</span>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-orange-100 p-6 shadow-sm ring-1 ring-amber-200">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700">Sales</p>
            <p className="mt-4 text-3xl font-black">Rp 154.2M</p>
          </div>
          <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-lime-100 p-6 shadow-sm ring-1 ring-emerald-200">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">Visitors</p>
            <p className="mt-4 text-3xl font-black">2,480</p>
          </div>
          <div className="rounded-[1.5rem] bg-gradient-to-br from-rose-50 to-pink-100 p-6 shadow-sm ring-1 ring-rose-200">
            <p className="text-xs uppercase tracking-[0.25em] text-rose-700">Best Seller</p>
            <p className="mt-4 text-3xl font-black">Cappuccino</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-amber-200 bg-[#fffdfb] p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Menu Editor</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{filteredMenuItems.length} items</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <select
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                className="w-full rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm outline-none"
              >
                <option value="all">All categories</option>
                {menuCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 rounded-[1.5rem] bg-amber-50 p-4">
              <input value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} placeholder="Category" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <input value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="Drink name" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Description" className="min-h-[90px] w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <div className="grid grid-cols-2 gap-3">
                <input value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} placeholder="Price" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
                <input value={menuForm.badge} onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })} placeholder="Badge" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              </div>
              <button onClick={saveMenu} disabled={loading} className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-3 text-sm font-bold text-amber-950 shadow-[0_10px_25px_rgba(245,158,11,0.25)] transition hover:-translate-y-0.5 disabled:opacity-70">
                {loading ? 'Saving...' : menuEditingId ? 'Update Menu Item' : 'Add Menu Item'}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-amber-100 bg-amber-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-amber-700">{item.category}</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-900">{item.badge || 'Popular'}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#5a3e2f]">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-900">{item.price}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setMenuForm(item); setMenuEditingId(item.id) }} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3b2417] shadow-sm">Edit</button>
                      <button onClick={() => deleteMenu(item.id)} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-amber-200 bg-[#fffdfb] p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{filteredReviewItems.length} reviews</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <select
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className="w-full rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm outline-none"
              >
                <option value="all">All ratings</option>
                {reviewStars.map((rating) => (
                  <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 rounded-[1.5rem] bg-amber-50 p-4">
              <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Customer name" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0">
                {[5,4,3,2,1].map((value) => (
                  <option key={value} value={value}>{value} star{value > 1 ? 's' : ''}</option>
                ))}
              </select>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Review comment" className="min-h-[90px] w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <button onClick={saveReview} disabled={loading} className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-3 text-sm font-bold text-amber-950 shadow-[0_10px_25px_rgba(245,158,11,0.25)] transition hover:-translate-y-0.5 disabled:opacity-70">
                {loading ? 'Saving...' : reviewEditingId ? 'Update Review' : 'Add Review'}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {filteredReviewItems.map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-amber-100 bg-amber-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{item.name}</p>
                    <span className="text-sm font-semibold text-amber-800">{item.rating}★</span>
                  </div>
                  <p className="mt-2 text-sm text-[#5a3e2f]">{item.comment}</p>
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => { setReviewForm(item); setReviewEditingId(item.id) }} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3b2417] shadow-sm">Edit</button>
                    <button onClick={() => deleteReview(item.id)} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-amber-200 bg-[#fffdfb] p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gallery</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{filteredGalleryItems.length} photos</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <select
                value={galleryFilter}
                onChange={(e) => setGalleryFilter(e.target.value)}
                className="w-full rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm outline-none"
              >
                <option value="all">All layouts</option>
                {galleryPositions.map((position) => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 rounded-[1.5rem] bg-amber-50 p-4">
              <input value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Title" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <input value={galleryForm.image} onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })} placeholder="Image URL" className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <select value={galleryForm.position} onChange={(e) => setGalleryForm({ ...galleryForm, position: e.target.value })} className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0">
                <option value="grid">Grid</option>
                <option value="featured">Featured</option>
                <option value="wide">Wide</option>
              </select>
              <textarea value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="Caption" className="min-h-[90px] w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none ring-0" />
              <button onClick={saveGallery} disabled={loading} className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-3 text-sm font-bold text-amber-950 shadow-[0_10px_25px_rgba(245,158,11,0.25)] transition hover:-translate-y-0.5 disabled:opacity-70">
                {loading ? 'Saving...' : galleryEditingId ? 'Update Gallery Item' : 'Add Gallery Item'}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {filteredGalleryItems.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[1.25rem] border border-amber-100 bg-amber-50/60">
                  <img src={item.image} alt={item.title} className="h-28 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold">{item.title}</p>
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-800">{item.position}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5a3e2f]">{item.caption}</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={() => { setGalleryForm(item); setGalleryEditingId(item.id) }} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3b2417] shadow-sm">Edit</button>
                      <button onClick={() => deleteGallery(item.id)} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
