export function isAdminAuthenticated(cookieValue?: string): boolean {
  return cookieValue === 'authenticated'
}
