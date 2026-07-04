export interface AdminSession {
  email: string
  name: string
  loginTime: string
  sessionId: string
  expiresAt: string
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem('admin_session')
    const isActive = sessionStorage.getItem('admin_active')
    
    if (!sessionData || !isActive) return null
    
    const session: AdminSession = JSON.parse(sessionData)
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      clearAdminSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error getting admin session:', error)
    clearAdminSession()
    return null
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('admin_session')
  sessionStorage.removeItem('admin_active')
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null
}

export function requireAdminAuth(): AdminSession {
  const session = getAdminSession()
  if (!session) {
    throw new Error('Admin authentication required')
  }
  return session
}