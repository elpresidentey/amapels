import crypto from 'crypto'

export interface AdminSession {
  email: string
  name: string
  loginTime: string
  sessionId: string
  expiresAt: string
  signature: string
}

export function setAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_session', JSON.stringify(session))
  sessionStorage.setItem('admin_active', 'true')
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null

  try {
    const sessionData = localStorage.getItem('admin_session')
    const isActive = sessionStorage.getItem('admin_active')

    if (!sessionData || !isActive) return null

    const session: AdminSession = JSON.parse(sessionData)

    if (new Date() > new Date(session.expiresAt)) {
      clearAdminSession()
      return null
    }

    if (!session.signature) {
      clearAdminSession()
      return null
    }

    return session
  } catch {
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
