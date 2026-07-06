export interface CustomerSession {
  email: string
  name: string
  loginTime: string
  sessionId: string
  expiresAt: string
}

// Generate a unique session ID
export function generateSessionId(): string {
  return `customer_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Create a customer session (login)
export function createCustomerSession(email: string, name: string): CustomerSession {
  const sessionId = generateSessionId()
  const loginTime = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  
  const session: CustomerSession = {
    email,
    name,
    loginTime,
    sessionId,
    expiresAt
  }
  
  // Store in both localStorage (persistent) and sessionStorage (session-based)
  localStorage.setItem('customer_session', JSON.stringify(session))
  sessionStorage.setItem('customer_active', 'true')
  sessionStorage.setItem('cart_session_id', sessionId)
  
  return session
}

// Get current customer session
export function getCustomerSession(): CustomerSession | null {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem('customer_session')
    const isActive = sessionStorage.getItem('customer_active')
    
    if (!sessionData || !isActive) return null
    
    const session: CustomerSession = JSON.parse(sessionData)
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      clearCustomerSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error getting customer session:', error)
    clearCustomerSession()
    return null
  }
}

// Clear customer session (logout)
export function clearCustomerSession(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('customer_session')
  sessionStorage.removeItem('customer_active')
  sessionStorage.removeItem('cart_session_id')
}

// Check if customer is authenticated
export function isCustomerAuthenticated(): boolean {
  return getCustomerSession() !== null
}

// Login function (simple email-based for now)
export function customerLogin(email: string, name?: string): CustomerSession {
  const customerName = name || email.split('@')[0] // Use email prefix if no name provided
  return createCustomerSession(email, customerName)
}

// Logout function
export function customerLogout(): void {
  clearCustomerSession()
}

// Check if this is a new session (for cart clearing)
export function isNewSession(): boolean {
  if (typeof window === 'undefined') return false
  
  const currentSession = getCustomerSession()
  const cartSessionId = sessionStorage.getItem('cart_session_id')
  
  // If no current session but there's a cart session, it's a returning visitor
  if (!currentSession && cartSessionId) {
    return false
  }
  
  // If no cart session ID, it's definitely new
  if (!cartSessionId) {
    return true
  }
  
  // If session exists, compare session IDs
  if (currentSession) {
    return currentSession.sessionId !== cartSessionId
  }
  
  return false
}

// Initialize session tracking (call this on app start)
export function initializeSession(): void {
  if (typeof window === 'undefined') return
  
  const existingSession = getCustomerSession()
  if (!existingSession) {
    // Create anonymous session for cart tracking
    const sessionId = generateSessionId()
    sessionStorage.setItem('cart_session_id', sessionId)
  }
}