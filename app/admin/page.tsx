import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import { isAdminAuthenticated } from '@/lib/auth'
import { all } from '@/lib/sqlite'

export default async function AdminPage() {
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')?.value

  if (!isAdminAuthenticated(session)) {
    redirect('/')
  }

  const [menuItems, reviewItems, galleryItems] = await Promise.all([
    all<any>('SELECT * FROM menu_items ORDER BY id DESC'),
    all<any>('SELECT * FROM reviews ORDER BY created_at DESC'),
    all<any>('SELECT * FROM gallery_items ORDER BY id DESC'),
  ])

  return (
    <AdminDashboard
      initialMenu={menuItems}
      initialReviews={reviewItems}
      initialGallery={galleryItems}
    />
  )
}
