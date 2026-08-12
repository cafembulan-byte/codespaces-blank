'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const plantationUrl = 'https://www.google.com/maps/place/Your+Coffee+Plantation'
const shopUrl = 'https://www.google.com/maps/place/Your+Coffee+Shop'

export default function HeroSection() {
  const router = useRouter()
  const [openLogin, setOpenLogin] = useState(false)
  const [email, setEmail] = useState('admin@harvestgrounds.com')
  const [password, setPassword] = useState('coffee2026')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setOpenLogin(false)
      router.push('/admin')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-amber-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_25%),linear-gradient(135deg,rgba(24,12,7,0.88),rgba(45,19,10,0.86))]" />
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_35%_35%_at_20%_20%,rgba(255,220,170,0.2),transparent_18%),radial-gradient(circle_30%_30%_at_80%_15%,rgba(255,165,80,0.14),transparent_20%)] animate-slow-float" />

      <button
        type="button"
        aria-label="Admin login"
        onClick={() => setOpenLogin(true)}
        className="absolute right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-amber-50 shadow-soft backdrop-blur-md transition hover:bg-white/15"
      >
        🔐
      </button>

      <div className="relative container mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-amber-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-100 shadow-soft ring-1 ring-amber-200/20">
              Farm-to-cup coffee
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-[-0.04em] text-amber-50 sm:text-5xl lg:text-6xl">
              Coffee from our plantation, served with warmth.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-amber-100/90">
              Savor ethically grown beans, artisan brews, and panoramic plantation views in a coffee house designed for slow mornings and memorable stays.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={plantationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-base font-bold text-amber-950 shadow-[0_16px_35px_rgba(251,191,36,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-amber-300"
              >
                <span>📍</span>
                Visit Our Coffee Plantation
              </Link>
              <Link
                href={shopUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-amber-200/40 bg-white/10 px-8 py-4 text-base font-semibold text-amber-50 transition duration-200 hover:bg-white/15"
              >
                <span>🛍️</span>
                Visit Our Shop
              </Link>
              <a href="#menu" className="inline-flex items-center justify-center rounded-full border border-amber-200/40 bg-transparent px-8 py-4 text-base font-semibold text-amber-50 transition duration-200 hover:bg-white/10">
                Explore the Menu
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100 shadow-soft">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                Farm-grown since 1998
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100 shadow-soft">
                <span className="font-semibold text-amber-50">★ 4.9/5</span>
                Rated by visitors
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-amber-900/70 shadow-soft">
            <div className="aspect-[4/3] overflow-hidden">
              <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-gradient-to-t from-amber-950/90 to-transparent px-6 py-6">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-200">Harvest Grounds Cafe</p>
              <p className="text-xl font-semibold text-white">Warm atmosphere. Rich coffee. Plantation views.</p>
            </div>
          </div>
        </div>
      </div>

      {openLogin && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#231710] p-7 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Admin Access</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Login</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenLogin(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white hover:bg-white/15"
                aria-label="Close login"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm text-amber-100">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@harvestgrounds.com"
                  className="w-full rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3 text-white placeholder:text-amber-100/50 focus:border-amber-300 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm text-amber-100">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3 text-white placeholder:text-amber-100/50 focus:border-amber-300 focus:outline-none"
                />
              </div>

              {error && <p className="text-sm font-medium text-rose-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-base font-bold text-amber-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
