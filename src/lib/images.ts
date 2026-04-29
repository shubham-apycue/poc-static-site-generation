const CDN_BASE = 'https://storage.googleapis.com/apycue-public-dev'

export function cdnUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${CDN_BASE}/${path}`
}
