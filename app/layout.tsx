import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Harvest Grounds Coffee',
  description: 'Authentic coffee plantation and cafe landing page with live analytics and community reviews.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
