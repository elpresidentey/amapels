export interface CustomerSession {
  email: string
  name: string
}

/** Fired on window after a customer successfully signs in. */
export const CUSTOMER_LOGIN_EVENT = 'amapels:customer-login'

let cachedSession: CustomerSession | null = null
let sessionPromise: Promise<CustomerSession | null> | null = null

async function fetchSession(): Promise<CustomerSession | null> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    if (data.authenticated && data.user) {
      return { email: data.user.email, name: data.user.name }
    }
    return null
  } catch {
    return null
  }
}

export async function getServerSession(): Promise<CustomerSession | null> {
  if (sessionPromise) return sessionPromise
  sessionPromise = fetchSession().then((s) => {
    cachedSession = s
    sessionPromise = null
    return s
  })
  return sessionPromise
}

export function getCachedSession(): CustomerSession | null {
  return cachedSession
}

export async function requestCustomerLoginCode(email: string, name?: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, name }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Could not send a verification code')
  }
}

export async function verifyCustomerLoginCode(email: string, code: string): Promise<CustomerSession> {
  const res = await fetch('/api/auth/verify-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, code }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'The verification code is invalid or expired')
  }

  const data = await res.json()
  const session: CustomerSession = { email: data.user.email, name: data.user.name }
  cachedSession = session

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CUSTOMER_LOGIN_EVENT, { detail: session }))
  }

  return session
}

export async function customerLogout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Ignore logout errors
  }
  cachedSession = null
}

export async function isCustomerAuthenticated(): Promise<boolean> {
  const session = await getServerSession()
  return session !== null
}
