/**
 * The admin session lives in an httpOnly cookie that the browser attaches
 * automatically to same-origin requests, so no special headers are needed.
 * Kept for backward compatibility with existing admin pages.
 */
export function getAdminAuthHeaders(): HeadersInit {
  return {}
}

