import type { AdminSession } from '@/lib/adminSession'

export type { AdminSession }

const STORAGE_KEY = 'admin_session'
const ACTIVE_KEY = 'admin_active'

/**
 * Logs in via the server API. The server sets an httpOnly signed cookie and
 * we mirror the session in localStorage so existing admin pages keep working.
 */
export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Invalid email or password')
  }

  setAdminSession(data.session)
  return data.session
}

/**
 * Verifies the session against the server (validates the signed httpOnly
 * cookie server-side). Falls back to false on any network error.
 */
export async function verifyAdminSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  // Fast local pre-check to avoid needless API calls when logged out
  if (!getAdminSession()) return false

  try {
    const res = await fetch('/api/admin/session', { cache: 'no-store' })
    const data = await res.json()
    if (!data.authenticated) {
      clearAdminSession()
    }
    return Boolean(data.authenticated)
  } catch {
    return false
  }
}

export async function logoutAdmin(): Promise<void> {
  clearAdminSession()
  try {
    await fetch('/api/admin/logout', { method: 'POST' })
  } catch {
    // Cookie clear is best-effort; local session is already cleared
  }
}

// --- Local mirror helpers (kept for backward compatibility with admin pages) ---

export function setAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  sessionStorage.setItem(ACTIVE_KEY, 'true')
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY)
    const isActive = sessionStorage.getItem(ACTIVE_KEY)

    if (!sessionData || !isActive) return null

    const session: AdminSession = JSON.parse(sessionData)

    if (new Date() > new Date(session.expiresAt)) {
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
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(ACTIVE_KEY)
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null
}

