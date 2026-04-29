import { describe, it, expect } from 'vitest'
import { toSlug, getPage, getRoomBySlug, buildPageMetadata, getWebsiteConfig } from '@/lib/data'
import { cdnUrl } from '@/lib/images'
import { generateThemeCSS } from '@/lib/theme'

describe('toSlug', () => {
  it('converts name to lowercase hyphenated slug', () => {
    expect(toSlug('Superior Twin Room')).toBe('superior-twin-room')
  })
  it('strips special characters', () => {
    expect(toSlug("King's Suite")).toBe('kings-suite')
  })
})

describe('cdnUrl', () => {
  it('prepends CDN base to relative path', () => {
    expect(cdnUrl('hotels/abc/image.webp')).toBe(
      'https://storage.googleapis.com/apycue-public-dev/hotels/abc/image.webp'
    )
  })
  it('returns absolute URLs unchanged', () => {
    expect(cdnUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg')
  })
  it('returns empty string for empty input', () => {
    expect(cdnUrl('')).toBe('')
  })
})

describe('generateThemeCSS', () => {
  it('outputs :root block with color variables', () => {
    const css = generateThemeCSS({
      colors: { primary: '62.15% 0.127 86.49', background: '100% 0 0' },
      typography: { fontFamily: {} },
    } as never)
    expect(css).toContain(':root {')
    expect(css).toContain('--color-primary: oklch(62.15% 0.127 86.49)')
    expect(css).toContain('--color-background: oklch(100% 0 0)')
  })
})

describe('getPage', () => {
  it('returns page for valid slug', () => {
    const page = getPage('/')
    expect(page).toBeDefined()
    expect(page?.slug).toBe('/')
  })
  it('returns undefined for unknown slug', () => {
    expect(getPage('/nonexistent')).toBeUndefined()
  })
})

describe('getRoomBySlug', () => {
  it('finds a room by its derived slug', () => {
    const room = getRoomBySlug('superior-twin-room')
    expect(room).toBeDefined()
    expect(room?.name).toBe('Superior Twin Room')
  })
})

describe('buildPageMetadata', () => {
  it('builds metadata with title and description from page meta', () => {
    const page = getPage('/')!
    const globalMeta = getWebsiteConfig().globalMeta
    const metadata = buildPageMetadata(page, globalMeta)
    expect(metadata.title).toBe(page.meta.title)
    expect(metadata.description).toBe(page.meta.description)
  })

  it('falls back to global og image when page has no ogImage', () => {
    const page = getPage('/policies')!
    const globalMeta = getWebsiteConfig().globalMeta
    const metadata = buildPageMetadata(page, globalMeta)
    expect((metadata.openGraph?.images as string[])?.[0]).toBe(globalMeta.seo.defaultOgImage)
  })
})
