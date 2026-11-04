import type { AdminSession } from '@/lib/adminSession'

export type { AdminSession }

const STORAGE_KEY = 'admin_session'

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
 *
 * The cookie is the only source of truth: it lasts 24h, so we must not let
 * browser storage decide whether the admin is signed in. Doing that used to
 * log the admin out whenever they opened the dashboard in a new tab
 * (sessionStorage is per-tab) even though the cookie was still valid.
 */
export async function verifyAdminSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const res = await fetch('/api/admin/session', { cache: 'no-store' })
    const data = await res.json()

    if (!data.authenticated) {
      clearAdminSession()
      return false
    }

    // Rebuild the local mirror when the cookie survived but storage did not
    // (new tab, cleared site data, private window reopened).
    if (!getAdminSession() && data.session) {
      setAdminSession(data.session)
    }

    return true
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
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null

  try {
    const sessionData = localStorage.getItem(STORAGE_KEY)
    if (!sessionData) return null

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
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null
}

