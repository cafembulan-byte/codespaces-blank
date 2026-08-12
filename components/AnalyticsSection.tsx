'use client'

import { useEffect, useState } from 'react'

type SalesData = {
  totalSales: number
  currency: string
  hotItems: Array<{ name: string; sales: number }>
}

const placeholder: SalesData = {
  totalSales: 0,
  currency: 'IDR',
  hotItems: [],
}

export default function AnalyticsSection() {
  const [data, setData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Unable to load analytics data')
        }
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <section className="bg-[#f1eadf] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700">Live Store Analytics</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl">Real-time sales and top trending items</h2>
          <p className="mt-3 mx-auto max-w-2xl text-base leading-7 text-amber-700/90">
            See current store performance and what customers are loving right now.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-amber-100/80 bg-white p-10 shadow-soft">
            <h3 className="text-xl font-semibold text-amber-950">Total Sales</h3>
            <div className="mt-8 rounded-[2rem] bg-amber-50 p-8">
              {loading ? (
                <p className="text-lg font-semibold text-amber-900">Loading total sales...</p>
              ) : error ? (
                <p className="text-lg font-semibold text-rose-600">{error}</p>
              ) : (
                <p className="text-5xl font-bold tracking-tight text-amber-900">{data?.currency} {data?.totalSales.toLocaleString('id-ID')}</p>
              )}
              <p className="mt-3 text-sm text-amber-700/80">Updated from the live store dashboard.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-amber-100/80 bg-amber-100/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Daily average</p>
                <p className="mt-4 text-3xl font-semibold text-amber-950">$1,250</p>
              </div>
              <div className="rounded-3xl border border-amber-100/80 bg-amber-100/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Returning guests</p>
                <p className="mt-4 text-3xl font-semibold text-amber-950">72%</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-100/80 bg-white p-10 shadow-soft">
            <h3 className="text-xl font-semibold text-amber-950">Hot Items</h3>
            <p className="mt-3 text-sm text-amber-700/80">Trending drinks and favorites from our menu.</p>
            <div className="mt-8 space-y-4">
              {loading ? (
                <p className="text-amber-900">Loading top items...</p>
              ) : error ? (
                <p className="text-rose-600">Unable to display top items.</p>
              ) : (
                (data?.hotItems ?? placeholder.hotItems).map((item) => (
                  <div key={item.name} className="rounded-3xl border border-amber-100/80 bg-amber-50/80 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-amber-950">{item.name}</p>
                        <p className="text-sm text-amber-700/80">Sales: {item.sales}</p>
                      </div>
                      <span className="rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-amber-900">Hot</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
