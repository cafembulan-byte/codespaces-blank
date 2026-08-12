const menuCategories = [
  {
    title: 'Espresso Based',
    hint: 'Perfect with your morning brew or after a plantation walk.',
    items: [
      { name: 'Single Origin Espresso', description: 'Bright citrus notes with chocolate undercurrents.', price: '$5.50', badge: 'Best seller' },
      { name: 'Cappuccino', description: 'Velvety steamed milk with rich crema.', price: '$6.00', badge: 'New' },
      { name: 'Flat White', description: 'Smooth and balanced with almond aroma.', price: '$6.25' },
    ],
  },
  {
    title: 'Manual Brew',
    hint: 'A slow sip experience designed for coffee lovers.',
    items: [
      { name: 'Pour Over', description: 'Light and floral, brewed to highlight terroir.', price: '$7.50', badge: 'Seasonal' },
      { name: 'French Press', description: 'Full-bodied with a gentle spice finish.', price: '$7.00' },
      { name: 'Cold Brew', description: 'Slow-steeped for a crisp, sweet cup.', price: '$6.95', badge: 'Best seller' },
    ],
  },
  {
    title: 'Non-Coffee',
    hint: 'Cozy, comforting alternatives for every guest.',
    items: [
      { name: 'Golden Chai Latte', description: 'Warm turmeric, cardamom, and creamy milk.', price: '$5.95', badge: 'Seasonal' },
      { name: 'Cacao Mocha', description: 'Dark chocolate and steamed milk with spice.', price: '$6.50' },
      { name: 'Herbal Infusion', description: 'Seasonal herbal blend served hot or iced.', price: '$5.25' },
    ],
  },
  {
    title: 'Pastries',
    hint: 'Fresh from the oven to pair beautifully with your coffee.',
    items: [
      { name: 'Almond Croissant', description: 'Flaky pastry filled with marzipan and almonds.', price: '$4.95', badge: 'Best seller' },
      { name: 'Banana Bread', description: 'Moist loaf with toasted walnuts and honey.', price: '$4.50' },
      { name: 'Matcha Biscotti', description: 'Crisp green tea cookie, perfect for dipping.', price: '$3.95', badge: 'New' },
    ],
  },
]

export default function MenuSection() {
  return (
    <section id="menu" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700">The Menu</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl">Seasonal craft coffee and warm bakery favorites</h2>
          <p className="mt-3 mx-auto max-w-2xl text-base leading-7 text-amber-700/90">
            Curated selections from our plantation and kitchen, designed to pair beautifully with every kind of morning.
          </p>
        </div>

        <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {menuCategories.map((category) => (
            <div key={category.title} className="rounded-[2rem] border border-amber-100/80 bg-[#fffdfb] p-8 shadow-[0_18px_45px_rgba(86,57,31,0.08)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-amber-950">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-amber-700/90">{category.hint}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  {category.items.length} items
                </span>
              </div>
              <div className="mt-6 grid gap-5">
                {category.items.map((item) => (
                  <div key={item.name} className="rounded-[1.75rem] border border-amber-100 bg-amber-50/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(91,58,31,0.08)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold text-amber-900">{item.name}</h4>
                          {item.badge ? (
                            <span className="rounded-full bg-amber-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-amber-700/90">Perfect with your morning brew</p>
                        <p className="mt-1 text-sm leading-6 text-amber-700/90">{item.description}</p>
                      </div>
                      <span className="mt-4 inline-flex whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm sm:mt-0">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
