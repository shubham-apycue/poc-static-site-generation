/**
 * Images can be disabled in three ways:
 * - Build-time env: `NEXT_PUBLIC_DISABLE_IMAGES=1` (works for static export)
 * - Runtime query: `?noimg=1` (works without rebuild)
 * - Runtime localStorage: `noimg=1` (works without rebuild)
 */
export function imagesDisabled(): boolean {
  // Default to disabling images unless explicitly enabled.
  // This makes it easy to run performance checks without extra config.
  if (process.env.NEXT_PUBLIC_DISABLE_IMAGES !== '0') return true
  if (typeof window === 'undefined') return false

  try {
    const params = new URLSearchParams(window.location.search)
    const qp = params.get('noimg')
    if (qp === '1' || qp === 'true') return true
  } catch {
    // ignore
  }

  try {
    return window.localStorage.getItem('noimg') === '1'
  } catch {
    return false
  }
}

// Back-compat for older imports
export const DISABLE_IMAGES = imagesDisabled()
