# Harvest Grounds Coffee Landing Page

A modern, responsive Next.js landing page for a coffee shop and plantation. Built with Tailwind CSS, dynamic analytics, and review storage integration.

## Project structure

- `app/`
  - `page.tsx` — main landing page layout
  - `layout.tsx` — root HTML layout and metadata
  - `globals.css` — Tailwind base styling and theme
  - `api/analytics/route.ts` — analytics API route
  - `api/reviews/route.ts` — reviews API route
- `components/`
  - `HeroSection.tsx`
  - `GallerySection.tsx`
  - `MenuSection.tsx`
  - `AnalyticsSection.tsx`
  - `ReviewSection.tsx`
- `lib/`
  - `db.ts` — MySQL connection utility

## Setup commands

```bash
cd /workspaces/codespaces-blank
npm install
npm run dev
```

## Database notes

The sample backend integration uses MySQL via `mysql2`.

Example schemas:

```sql
CREATE TABLE store_summary (
  id INT PRIMARY KEY AUTO_INCREMENT,
  total_sales DECIMAL(12,2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'IDR',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE hot_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_name VARCHAR(128) NOT NULL,
  sales INT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Set environment variables in `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=coffee_shop
```

## Notes

- The landing page uses warm earthy tones, soft shadows, and a clean layout.
- The gallery includes a click-to-preview modal.
- Analytics and reviews use dynamic fetch from API routes.
