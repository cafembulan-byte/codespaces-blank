import bcrypt from 'bcryptjs'
import { get } from './sqlite'

export async function verifyAdmin(email: string, password: string) {
  const user = await get<{ id: number; email: string; password_hash: string }>(
    'SELECT id, email, password_hash FROM admin_users WHERE email = ?',
    [email]
  )

  if (!user) return false

  return bcrypt.compare(password, user.password_hash)
}

export async function getAdminUserByEmail(email: string) {
  return get<{ id: number; email: string }>('SELECT id, email FROM admin_users WHERE email = ?', [email])
}
