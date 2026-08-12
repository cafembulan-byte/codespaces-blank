'use client'

import { useMemo, useState } from 'react'

const galleryItems = [
  {
    id: 1,
    title: 'Cozy Café Interior',
    caption: 'Warm light, handcrafted brews, and slow mornings.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    className: 'lg:col-span-2 lg:row-span-2',
  },
  {
    id: 2,
    title: 'Outdoor Seating',
    caption: 'Open-air moments made for easy conversations.',
    image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80',
    className: 'lg:col-span-1',
  },
  {
    id: 3,
    title: 'Plantation View',
    caption: 'Fresh air, rich soil, and the rhythm of the farm.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    className: 'lg:col-span-1',
  },
  {
    id: 4,
    title: 'Latte Art',
    caption: 'Well-crafted pours, and a little moment of joy.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    className: 'lg:col-span-3',
  },
]

export default function GallerySection() {
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const active = useMemo(() => galleryItems.find((item) => item.image === activeImage), [activeImage])

  return (
    <section className="bg-[#f4ede5] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Facilities & Views</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl">A gallery of inviting coffee moments</h2>
          <p className="mt-3 mx-auto max-w-2xl text-base leading-7 text-amber-700/90">
            Explore the cafe interior, sunny outdoor seating, and lush plantation scenery in every frame.
          </p>
        </div>

        <div className="grid auto-rows-[180px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveImage(item.image)}
              className={`group relative overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-[0_18px_38px_rgba(65,38,21,0.08)] transition duration-300 hover:-translate-y-1 ${item.className}`}
            >
              <div
                className="absolute inset-0 scale-100 bg-cover bg-center transition duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d120d]/90 via-[#1d120d]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left opacity-100 transition duration-300">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">View</p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.title}</p>
                <p className="mt-2 max-w-xs text-sm text-amber-100/85">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10" role="dialog" aria-modal="true">
          <div className="relative max-w-5xl overflow-hidden rounded-3xl bg-[#21140f] shadow-soft">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close image preview"
            >
              ×
            </button>
            <img src={active.image} alt={active.title} className="h-[70vh] w-full object-cover sm:h-[80vh]" />
            <div className="bg-[#0e0704] px-6 py-5 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Preview</p>
              <p className="mt-2 text-xl font-semibold">{active.title}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
