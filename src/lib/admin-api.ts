export function getAdminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {}

  const sessionData = localStorage.getItem('admin_session')
  if (!sessionData) return {}

  const encoded = btoa(sessionData)
  return { 'Authorization': `Bearer ${encoded}` }
}
