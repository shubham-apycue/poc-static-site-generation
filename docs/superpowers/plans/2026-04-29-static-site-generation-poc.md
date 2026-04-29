# Static Site Generation POC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 15 SSG app in `poc-static-site-generation/` that generates 27 static HTML pages from `websiteconfig.json` + `hotelwebsitedata.json` and deploys to Vercel for Lighthouse performance measurement.

**Architecture:** Next.js 15 App Router with `output: 'export'`. All data read at build time from the two JSON files via `src/lib/data.ts`. 29 section components (React Server Components) rendered by a `SectionRenderer` mapper. One client component (`Faqs.tsx`) for accordion state.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, `next/font/google` (Work Sans + IBM Plex Sans), Vitest + React Testing Library

---

## File Map

```
src/
  app/
    layout.tsx                    # fonts, theme CSS vars, Header, Footer, root metadata
    page.tsx                      # /
    rooms/page.tsx                # /rooms
    rooms/[slug]/page.tsx         # /rooms/[slug] × 18 (generateStaticParams)
    facilities/page.tsx
    restaurants/page.tsx
    gallery/page.tsx
    contactus/page.tsx
    attractions/page.tsx
    experiences/page.tsx
    policies/page.tsx
  components/
    layout/Header.tsx
    layout/Footer.tsx
    sections/SectionRenderer.tsx
    sections/Hero.tsx
    sections/BannerHero.tsx
    sections/BannerWithCta.tsx
    sections/WhyBookDirectWithUs.tsx
    sections/AboutHotel.tsx
    sections/AboutThePlace.tsx
    sections/RoomTypeList.tsx
    sections/RoomList.tsx
    sections/RoomDetails.tsx
    sections/RulesAndPolicies.tsx
    sections/Amenities.tsx
    sections/FeaturedAmenities.tsx
    sections/RoomAmenities.tsx
    sections/HotelAmenities.tsx
    sections/Gallery.tsx
    sections/GalleryPage.tsx
    sections/Restaurant.tsx
    sections/RestaurantDescription.tsx
    sections/RestaurantTiming.tsx
    sections/Reviews.tsx
    sections/Faqs.tsx             # 'use client'
    sections/HowToReachUs.tsx
    sections/MapAndLocation.tsx
    sections/InstagramFeed.tsx
    sections/LocalAttraction.tsx
    sections/Experiences.tsx
    sections/FeaturedExperiences.tsx
    sections/ContactUs.tsx
    sections/TermsAndConditions.tsx
    ui/SectionWrapper.tsx
  lib/
    data.ts                       # types + getWebsiteConfig, getHotelData, getPage, getRoomBySlug, toSlug
    images.ts                     # cdnUrl()
    theme.ts                      # generateThemeCSS()
  __tests__/
    lib.test.ts
    SectionRenderer.test.tsx
next.config.ts
vercel.json
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`, `src/app/globals.css`

- [ ] **Step 1: Initialize Next.js in the existing directory**

Run from `/home/dell/poc-static-site-generation/`:
```bash
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```
Expected: Next.js project created. Existing `websiteconfig.json`, `hotelwebsitedata.json`, `README.md`, `docs/` are untouched.

- [ ] **Step 2: Install Vitest + React Testing Library**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Add vitest config to `package.json`**

Add to `package.json` scripts and vitest config:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "vitest": {
    "environment": "jsdom",
    "setupFiles": ["./src/__tests__/setup.ts"],
    "globals": true
  }
}
```

- [ ] **Step 4: Create test setup file**

Create `src/__tests__/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Configure `output: 'export'` in `next.config.ts`**

Replace the contents of `next.config.ts` with:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```
Expected: Server starts on http://localhost:3000, default Next.js page visible.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 SSG project"
```

---

## Task 2: Data layer — types, loaders, utilities

**Files:**
- Create: `src/lib/data.ts`, `src/lib/images.ts`, `src/lib/theme.ts`, `src/__tests__/lib.test.ts`

- [ ] **Step 1: Write failing tests for utilities**

Create `src/__tests__/lib.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { toSlug, getPage, getRoomBySlug } from '@/lib/data'
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```
Expected: All tests fail with "Cannot find module" or similar.

- [ ] **Step 3: Create `src/lib/images.ts`**

```typescript
const CDN_BASE = 'https://storage.googleapis.com/apycue-public-dev'

export function cdnUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${CDN_BASE}/${path}`
}
```

- [ ] **Step 4: Create `src/lib/theme.ts`**

```typescript
export interface ThemeInput {
  colors: Record<string, string>
  typography: { fontFamily: Record<string, unknown> }
}

export function generateThemeCSS(theme: ThemeInput): string {
  const lines: string[] = [':root {']
  for (const [key, value] of Object.entries(theme.colors)) {
    lines.push(`  --color-${key}: oklch(${value});`)
  }
  lines.push('}')
  return lines.join('\n')
}
```

- [ ] **Step 5: Create `src/lib/data.ts`**

```typescript
import websiteConfigRaw from '../../websiteconfig.json'
import hotelDataRaw from '../../hotelwebsitedata.json'

export interface CarouselImage { src: string; alt: string }
export interface TrustItem { icon: string; text: string }
export interface Feature { icon: string; title: string; description: string }
export interface HighlightStat { label: string; value: string }
export interface NavLink { label: string; href: string }
export interface RulesPoint { text: string; label: string; value: string }

export interface SectionContent extends Record<string, unknown> {}

export interface SectionConfig {
  id: string
  component: string
  variant: string
  content: SectionContent
  isVisible: boolean
  backGroundVariant: string
}

export interface PageMeta {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  robots?: string
  canonicalPath?: string
  ogTitle?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  ogDescription?: string
}

export interface Page {
  id: string
  name: string
  slug: string
  sections: SectionConfig[]
  meta: PageMeta
  isVisible: boolean
  isVisibleHeader: boolean
  isVisibleFooter: boolean
}

export interface HeaderConfig {
  content: { bookNowButtonText: string }
  variant: string
  component: string
  isVisible: boolean
}

export interface FooterConfig {
  content: {
    copyright: string
    emailLabel: string
    phoneLabel: string
    connectText: string
    addressLabel: string
    checkInLabel: string
    contactTitle: string
    inquiryTitle: string
    checkOutLabel: string
    submitButtonText: string
    roomsSectionTitle: string
    inquiryDescription: string
    inquiryPlaceholder: string
    discoverSectionTitle: string
  }
  variant: string
  component: string
  isVisible: boolean
}

export interface GlobalMeta {
  seo: {
    siteUrl: string
    defaultRobots: string
    twitterHandle: string
    defaultOgImage: string
    googleSiteVerification: string
  }
  siteName: string
  hotelInfo: {
    geo: { latitude: number; longitude: number }
    email: string
    address: { city: string; state: string; street: string; country: string; postalCode: string }
    telephone: string
    checkInTime: string
    checkOutTime: string
    starRating: number
  }
  faviconUrl?: string
  featuredImage?: string
}

export interface WebsiteConfig {
  pages: Page[]
  theme: {
    colors: Record<string, string>
    typography: Record<string, unknown>
    icons?: string
    radius?: Record<string, string>
  }
  header: HeaderConfig
  footer: FooterConfig
  globalMeta: GlobalMeta
  templateId: string
  lastUpdated: string
}

export interface HotelAddress {
  addressLine1: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: number
  longitude: number
}

export interface Hotel {
  name: string
  description: string
  shortDescription: string
  starRating: number
  logo: { light: string; dark: string }
  propertyType: string
  bookingEngineUrl: string
  totalRooms: number
  address: HotelAddress
  currency: { symbol: string; code: string }
}

export interface Room {
  id: string
  name: string
  description: string
  images: string[]
  amenities: string[]
  capacity: { adults: number; children: number }
  bestFor: string[]
  isBestSeller: boolean
  isNonSmoking: boolean
  price: number | null
  showPrice: boolean
}

export interface Amenity {
  id: string
  name: string
  icon: string
  description: string
  shortDescription: string
  images: string[]
  type: string
  category: string
  isFeatured: boolean
  masterAmenityCategoryKey: string
  masterAmenityCategoryName: string
}

export interface MealTiming {
  label: string
  startTime: string
  endTime: string
}

export interface DiningVenue {
  name: string
  description: string
  shortDescription: string
  images: string[]
  mealTimings: MealTiming[]
  category: string
  isFeatured: boolean
}

export interface Experience {
  name: string
  description: string
  shortDescription: string
  images: string[]
  icon: string
  category: string
  isFeatured: boolean
}

export interface NearbyPlace {
  name: string
  description: string
  shortDescription: string
  category: string
  distanceKm: number | null
  travelTimeMinutes: number | null
  imageUrl: string
  images: string[]
  rating: number | null
  isFeatured: boolean
  latitude: number | null
  longitude: number | null
}

export interface Faq {
  id: string
  question: string
  answer: string
  category: string
}

export interface PlatformRating {
  source: string
  rating: number
  ratingOutOf: number
  value: string
  label: string
}

export interface HotelImage {
  url: string
  title: string
  tags: string[]
  isFeatured: boolean
  category: string
}

export interface InstagramPost {
  imageUrl: string
  permalink?: string
  caption?: string
}

export interface Instagram {
  userName: string
  followersCount: number
  profileImage: string
  feed: InstagramPost[]
}

export interface ContactItem {
  value: string
  name: string
  purpose: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface Contact {
  phones: ContactItem[]
  emails: ContactItem[]
  website: string | null
  address: HotelAddress
  socialLinks: SocialLink[]
}

export interface Policies {
  checkInTime: string
  checkOutTime: string
  cancellationPolicy: string
  petsAllowed: boolean
  smokingAllowed: boolean
  parkingAvailable: boolean
}

export interface HotelData {
  hotel: Hotel
  rooms: Room[]
  amenities: Amenity[]
  dining: DiningVenue[]
  experiences: Experience[]
  nearbyPlaces: NearbyPlace[]
  faqs: Faq[]
  reviews: unknown[]
  platformRating: PlatformRating[]
  images: HotelImage[]
  contact: Contact
  instagram: Instagram
  policies: Policies
  media: unknown[]
}

export function getWebsiteConfig(): WebsiteConfig {
  return websiteConfigRaw as unknown as WebsiteConfig
}

export function getHotelData(): HotelData {
  return hotelDataRaw as unknown as HotelData
}

export function getPage(slug: string): Page | undefined {
  return getWebsiteConfig().pages.find((p) => p.slug === slug)
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function getRoomBySlug(slug: string): Room | undefined {
  return getHotelData().rooms.find((r) => toSlug(r.name) === slug)
}
```

- [ ] **Step 6: Run tests**

```bash
npm test
```
Expected: All 8 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/ src/__tests__/
git commit -m "feat: add data layer types, loaders, and utilities"
```

---

## Task 3: Root layout — fonts, theme, metadata

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Work_Sans, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { getWebsiteConfig, getHotelData } from '@/lib/data'
import { generateThemeCSS } from '@/lib/theme'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const config = getWebsiteConfig()
  const { globalMeta } = config
  return {
    title: {
      default: globalMeta.siteName,
      template: `%s | ${globalMeta.siteName}`,
    },
    description: globalMeta.seo.defaultRobots,
    metadataBase: new URL(globalMeta.seo.siteUrl),
    openGraph: {
      siteName: globalMeta.siteName,
      images: [globalMeta.seo.defaultOgImage],
    },
    robots: globalMeta.seo.defaultRobots,
    verification: globalMeta.seo.googleSiteVerification
      ? { google: globalMeta.seo.googleSiteVerification }
      : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = getWebsiteConfig()
  const hotelData = getHotelData()
  const themeCSS = generateThemeCSS({
    colors: config.theme.colors,
    typography: { fontFamily: (config.theme.typography as Record<string, unknown>) },
  })

  return (
    <html lang="en" className={`${workSans.variable} ${ibmPlexSans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="bg-white text-gray-900">
        <Header config={config.header} hotel={hotelData.hotel} pages={config.pages} />
        <main>{children}</main>
        <Footer config={config.footer} hotel={hotelData.hotel} contact={hotelData.contact} pages={config.pages} />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit (Header/Footer will be stubbed in next task)**

```bash
git add src/app/
git commit -m "feat: add root layout with fonts and theme injection"
```

---

## Task 4: Header and Footer

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: Create `src/components/layout/Header.tsx`**

```typescript
import Link from 'next/link'
import Image from 'next/image'
import type { HeaderConfig, Hotel, Page } from '@/lib/data'
import { cdnUrl } from '@/lib/images'

interface Props {
  config: HeaderConfig
  hotel: Hotel
  pages: Page[]
}

export default function Header({ config, hotel, pages }: Props) {
  const navPages = pages.filter((p) => p.isVisibleHeader && p.slug !== '/room-detail')
  const bookingUrl = hotel.bookingEngineUrl || '#'

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm"
      style={{ backgroundColor: 'oklch(var(--color-layoutHeaderBg, 100% 0 0))' }}
    >
      <Link href="/" className="flex items-center gap-3">
        {hotel.logo?.light ? (
          <Image
            src={cdnUrl(hotel.logo.light)}
            alt={hotel.name}
            width={140}
            height={40}
            style={{ height: 40, width: 'auto' }}
            priority
          />
        ) : (
          <span className="text-xl font-bold">{hotel.name}</span>
        )}
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        {navPages.map((p) => (
          <Link
            key={p.slug}
            href={p.slug}
            className="text-sm font-medium hover:opacity-70 transition-opacity capitalize"
          >
            {p.name}
          </Link>
        ))}
      </nav>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: 'oklch(var(--color-btnPrimary, 62.15% 0.127 86.49))',
          color: 'oklch(var(--color-btnPrimaryForeground, 100% 0 0))',
        }}
      >
        {config.content.bookNowButtonText}
      </a>
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/Footer.tsx`**

```typescript
import Link from 'next/link'
import type { FooterConfig, Hotel, Contact, Page } from '@/lib/data'

interface Props {
  config: FooterConfig
  hotel: Hotel
  contact: Contact
  pages: Page[]
}

export default function Footer({ config, hotel, contact, pages }: Props) {
  const { content } = config
  const discoverPages = pages.filter((p) => p.isVisibleFooter && p.slug !== '/room-detail')
  const phone = contact.phones?.[0]?.value
  const email = contact.emails?.[0]?.value
  const addr = contact.address

  return (
    <footer
      className="px-6 py-12"
      style={{
        backgroundColor: 'oklch(var(--color-layoutFooterBg, 20% 0 0))',
        color: 'oklch(var(--color-layoutFooterForeground, 100% 0 0))',
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-semibold mb-3">{content.contactTitle}</h3>
          {addr && (
            <p className="text-sm opacity-80 mb-2">
              {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
            </p>
          )}
          {phone && <p className="text-sm opacity-80">{content.phoneLabel}: {phone}</p>}
          {email && <p className="text-sm opacity-80">{content.emailLabel}: {email}</p>}
        </div>

        <div>
          <h3 className="font-semibold mb-3">{content.discoverSectionTitle}</h3>
          <ul className="space-y-1">
            {discoverPages.map((p) => (
              <li key={p.slug}>
                <Link href={p.slug} className="text-sm opacity-80 hover:opacity-100 capitalize">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{content.connectText}</h3>
          <div className="flex gap-3 flex-wrap">
            {contact.socialLinks?.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-80 hover:opacity-100 underline"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-xs opacity-60">
        &copy; {new Date().getFullYear()} {hotel.name}. {content.copyright}
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Header and Footer layout components"
```

---

## Task 5: SectionWrapper + SectionRenderer

**Files:**
- Create: `src/components/ui/SectionWrapper.tsx`, `src/components/sections/SectionRenderer.tsx`
- Create: `src/__tests__/SectionRenderer.test.tsx`

- [ ] **Step 1: Create `src/components/ui/SectionWrapper.tsx`**

```typescript
interface Props {
  children: React.ReactNode
  backGroundVariant?: string
  className?: string
}

const bgMap: Record<string, string> = {
  default: 'bg-white',
  muted: 'bg-gray-50',
  dark: 'bg-gray-900 text-white',
  accent: 'bg-yellow-50',
  primary: 'bg-purple-900 text-white',
}

export default function SectionWrapper({ children, backGroundVariant = 'default', className = '' }: Props) {
  const bg = bgMap[backGroundVariant] ?? bgMap.default
  return (
    <section className={`py-12 px-6 ${bg} ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  )
}
```

- [ ] **Step 2: Write failing test for SectionRenderer**

Create `src/__tests__/SectionRenderer.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SectionRenderer from '@/components/sections/SectionRenderer'
import type { SectionConfig, HotelData } from '@/lib/data'

vi.mock('@/components/sections/Hero', () => ({
  default: () => <div data-testid="hero-section">Hero</div>,
}))
vi.mock('@/components/sections/BannerHero', () => ({
  default: () => <div data-testid="banner-hero-section">BannerHero</div>,
}))

const mockHotelData = {
  hotel: { name: 'Test Hotel', bookingEngineUrl: '#', logo: { light: '', dark: '' } },
  rooms: [], amenities: [], dining: [], experiences: [],
  nearbyPlaces: [], faqs: [], reviews: [], platformRating: [],
  images: [], contact: { phones: [], emails: [], socialLinks: [], address: {} as never, website: null },
  instagram: { userName: '', followersCount: 0, profileImage: '', feed: [] },
  policies: {} as never, media: [],
} as unknown as HotelData

describe('SectionRenderer', () => {
  it('renders Hero for component="Hero"', () => {
    const section: SectionConfig = {
      id: 's1', component: 'Hero', variant: 'hero-03',
      content: {}, isVisible: true, backGroundVariant: 'default',
    }
    render(<SectionRenderer section={section} hotelData={mockHotelData} />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })

  it('renders BannerHero for component="BannerHero"', () => {
    const section: SectionConfig = {
      id: 's2', component: 'BannerHero', variant: 'banner-03',
      content: { heading: 'Test', pageName: 'Test' }, isVisible: true, backGroundVariant: 'default',
    }
    render(<SectionRenderer section={section} hotelData={mockHotelData} />)
    expect(screen.getByTestId('banner-hero-section')).toBeInTheDocument()
  })

  it('renders nothing for unknown component', () => {
    const section: SectionConfig = {
      id: 's3', component: 'Unknown', variant: '',
      content: {}, isVisible: true, backGroundVariant: 'default',
    }
    const { container } = render(<SectionRenderer section={section} hotelData={mockHotelData} />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test
```
Expected: SectionRenderer tests fail — module not found.

- [ ] **Step 4: Create `src/components/sections/SectionRenderer.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import Hero from './Hero'
import BannerHero from './BannerHero'
import BannerWithCta from './BannerWithCta'
import WhyBookDirectWithUs from './WhyBookDirectWithUs'
import AboutHotel from './AboutHotel'
import AboutThePlace from './AboutThePlace'
import RoomTypeList from './RoomTypeList'
import RoomList from './RoomList'
import RoomDetails from './RoomDetails'
import RulesAndPolicies from './RulesAndPolicies'
import Amenities from './Amenities'
import FeaturedAmenities from './FeaturedAmenities'
import RoomAmenities from './RoomAmenities'
import HotelAmenities from './HotelAmenities'
import Gallery from './Gallery'
import GalleryPage from './GalleryPage'
import Restaurant from './Restaurant'
import RestaurantDescription from './RestaurantDescription'
import RestaurantTiming from './RestaurantTiming'
import Reviews from './Reviews'
import Faqs from './Faqs'
import HowToReachUs from './HowToReachUs'
import MapAndLocation from './MapAndLocation'
import InstagramFeed from './InstagramFeed'
import LocalAttraction from './LocalAttraction'
import Experiences from './Experiences'
import FeaturedExperiences from './FeaturedExperiences'
import ContactUs from './ContactUs'
import TermsAndConditions from './TermsAndConditions'

const COMPONENTS: Record<string, React.ComponentType<{ section: SectionConfig; hotelData: HotelData }>> = {
  Hero,
  BannerHero,
  BannerWithCta,
  WhyBookDirectWithUs,
  AboutHotel,
  AboutThePlace,
  RoomTypeList,
  RoomList,
  RoomDetails,
  RulesAndPolicies,
  Amenities,
  FeaturedAmenities,
  RoomAmenities,
  HotelAmenities,
  Gallery,
  GalleryPage,
  Restaurant,
  RestaurantDescription,
  RestaurantTiming,
  Reviews,
  Faqs,
  HowToReachUs,
  MapAndLocation,
  InstagramFeed,
  LocalAttraction,
  Experiences,
  FeaturedExperiences,
  ContactUs,
  TermsAndConditions,
}

interface Props {
  section: SectionConfig
  hotelData: HotelData
}

export default function SectionRenderer({ section, hotelData }: Props) {
  if (!section.isVisible) return null
  const Component = COMPONENTS[section.component]
  if (!Component) return null
  return <Component section={section} hotelData={hotelData} />
}
```

All 29 section components will be stub files until implemented in Tasks 6–13. Create all stubs now:

- [ ] **Step 5: Create stub components for all 29 sections**

For each file listed below, create it with this stub pattern. Replace `ComponentName` with the actual name:

```typescript
// src/components/sections/Hero.tsx  (repeat for all 29)
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function Hero({ section, hotelData }: Props) {
  return (
    <SectionWrapper backGroundVariant={section.backGroundVariant}>
      <div />
    </SectionWrapper>
  )
}
```

Create stubs for: `Hero`, `BannerHero`, `BannerWithCta`, `WhyBookDirectWithUs`, `AboutHotel`, `AboutThePlace`, `RoomTypeList`, `RoomList`, `RoomDetails`, `RulesAndPolicies`, `Amenities`, `FeaturedAmenities`, `RoomAmenities`, `HotelAmenities`, `Gallery`, `GalleryPage`, `Restaurant`, `RestaurantDescription`, `RestaurantTiming`, `Reviews`, `Faqs`, `HowToReachUs`, `MapAndLocation`, `InstagramFeed`, `LocalAttraction`, `Experiences`, `FeaturedExperiences`, `ContactUs`, `TermsAndConditions`

- [ ] **Step 6: Run tests**

```bash
npm test
```
Expected: All tests pass (SectionRenderer maps Hero and BannerHero correctly).

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add SectionRenderer, SectionWrapper, and section stubs"
```

---

## Task 6: Hero, BannerHero, BannerWithCta, WhyBookDirectWithUs, AboutHotel, AboutThePlace

**Files:** Replace stubs in `src/components/sections/`

- [ ] **Step 1: Implement `Hero.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData, CarouselImage, TrustItem } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface HeroContent {
  title: string
  description: string
  carouselImages: CarouselImage[]
  trustUspItems: TrustItem[]
}

interface Props { section: SectionConfig; hotelData: HotelData }

export default function Hero({ section, hotelData }: Props) {
  const content = section.content as unknown as HeroContent
  const firstImage = content.carouselImages?.[0]
  const bookingUrl = hotelData.hotel.bookingEngineUrl || '#'

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden bg-gray-900">
      {firstImage && (
        <Image
          src={cdnUrl(firstImage.src)}
          alt={firstImage.alt}
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
      )}
      <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-16 pt-32 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{content.title}</h1>
        <p className="text-base md:text-lg opacity-90 mb-8 max-w-xl">{content.description}</p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded px-6 py-3 font-semibold text-sm"
          style={{
            backgroundColor: 'oklch(var(--color-btnPrimary, 80% 0.15 85))',
            color: 'oklch(var(--color-btnPrimaryForeground, 20% 0 0))',
          }}
        >
          Book Now
        </a>
      </div>
      {content.trustUspItems?.length > 0 && (
        <div
          className="relative z-10 w-full overflow-x-auto"
          style={{ backgroundColor: 'oklch(var(--color-primary, 26.5% 0.081 305.68))' }}
        >
          <div className="flex gap-6 px-6 py-3 min-w-max mx-auto">
            {content.trustUspItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white text-sm whitespace-nowrap">
                <span className="material-symbols-outlined text-base" aria-hidden="true">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Implement `BannerHero.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface BannerHeroContent { heading: string; pageName: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function BannerHero({ section }: Props) {
  const content = section.content as unknown as BannerHeroContent
  return (
    <SectionWrapper backGroundVariant="primary" className="py-16">
      <div className="text-center text-white">
        <p className="text-sm uppercase tracking-widest opacity-70 mb-2">{content.pageName}</p>
        <h1 className="text-3xl md:text-5xl font-bold">{content.heading}</h1>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Implement `BannerWithCta.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface BannerCtaContent { title: string; description: string; bookNowButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function BannerWithCta({ section, hotelData }: Props) {
  const content = section.content as unknown as BannerCtaContent
  const bookingUrl = hotelData.hotel.bookingEngineUrl || '#'
  return (
    <SectionWrapper backGroundVariant="accent">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{content.title}</h2>
        <p className="text-gray-600 mb-6">{content.description}</p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded px-6 py-3 font-semibold text-sm"
          style={{
            backgroundColor: 'oklch(var(--color-btnPrimary, 80% 0.15 85))',
            color: 'oklch(var(--color-btnPrimaryForeground, 20% 0 0))',
          }}
        >
          {content.bookNowButtonText}
        </a>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Implement `WhyBookDirectWithUs.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData, Feature } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface WBDContent { badge: string; image: string; features: Feature[] }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function WhyBookDirectWithUs({ section, hotelData }: Props) {
  const content = section.content as unknown as WBDContent
  const bookingUrl = hotelData.hotel.bookingEngineUrl || '#'
  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {content.image && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src={cdnUrl(content.image)} alt="Book direct" fill className="object-cover" sizes="(max-width:768px) 100vw,50vw" />
          </div>
        )}
        <div>
          {content.badge && (
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
              style={{ backgroundColor: 'oklch(var(--color-badgeBg,96% 0.047 92.6))', color: 'oklch(var(--color-badgeForeground,30% 0 0))' }}>
              {content.badge}
            </span>
          )}
          <ul className="space-y-4 mt-4">
            {content.features?.map((f, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'oklch(var(--color-primary,26.5% 0.081 305.68))', color: 'white' }}>
                  <span className="material-symbols-outlined text-sm">{f.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-block rounded px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            Book Now
          </a>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Implement `AboutHotel.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface AboutContent {
  image: string; imageAlt: string; description: string
  mainHeading?: string; sectionLabel?: string
  happyCustomerCount?: string; happyCustomerLabel?: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function AboutHotel({ section, hotelData }: Props) {
  const content = section.content as unknown as AboutContent
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
          <h2 className="text-3xl font-bold mb-4">{content.mainHeading ?? hotelData.hotel.name}</h2>
          <p className="text-gray-600 leading-relaxed">{content.description ?? hotelData.hotel.description}</p>
          {content.happyCustomerCount && (
            <p className="mt-4 text-sm font-semibold">
              {content.happyCustomerCount} {content.happyCustomerLabel}
            </p>
          )}
        </div>
        {content.image && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src={cdnUrl(content.image)} alt={content.imageAlt || 'Hotel'} fill className="object-cover"
              sizes="(max-width:768px) 100vw,50vw" />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 6: Implement `AboutThePlace.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface AboutPlaceContent {
  images: string[]; imageAlt: string; paragraphs: string[]
  mainHeading: string; sectionLabel: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function AboutThePlace({ section }: Props) {
  const content = section.content as unknown as AboutPlaceContent
  const img = content.images?.[0]
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
          <h2 className="text-3xl font-bold mb-4">{content.mainHeading}</h2>
          {content.paragraphs?.map((p, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-3">{p}</p>
          ))}
        </div>
        {img && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src={cdnUrl(img)} alt={content.imageAlt || 'Place'} fill className="object-cover"
              sizes="(max-width:768px) 100vw,50vw" />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/
git commit -m "feat: implement hero and about section components"
```

---

## Task 7: Room sections — RoomTypeList, RoomList, RoomDetails, RulesAndPolicies

- [ ] **Step 1: Implement `RoomTypeList.tsx`**

```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { toSlug } from '@/lib/data'

interface RoomTypeListContent {
  mainHeading: string; sectionTitle: string
  viewAllRoomsHref: string; viewAllRoomsText: string
  bookNowButtonText: string; viewDetailsButtonText: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomTypeList({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomTypeListContent
  const rooms = hotelData.rooms.slice(0, 6)
  return (
    <SectionWrapper>
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionTitle}</p>
        <h2 className="text-3xl font-bold">{content.mainHeading}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="relative h-52">
              {room.images[0] ? (
                <Image src={cdnUrl(room.images[0])} alt={room.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              {room.isBestSeller && (
                <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
                  Best Seller
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-1">
                Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
              </p>
              <div className="flex gap-2 mt-3">
                <Link href={`/rooms/${toSlug(room.name)}`}
                  className="flex-1 text-center text-sm py-2 rounded border border-gray-300 hover:bg-gray-50">
                  {content.viewDetailsButtonText}
                </Link>
                <a href={hotelData.hotel.bookingEngineUrl || '#'} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-sm py-2 rounded font-semibold"
                  style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
                  {content.bookNowButtonText}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {content.viewAllRoomsHref && (
        <div className="text-center mt-8">
          <Link href={content.viewAllRoomsHref}
            className="inline-block px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50">
            {content.viewAllRoomsText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Implement `RoomList.tsx`**

```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { toSlug } from '@/lib/data'

interface RoomListContent { bookNowButtonText: string; viewMoreButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomList({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomListContent
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelData.rooms.map((room) => (
          <article key={room.id} className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="relative h-52">
              {room.images[0] ? (
                <Image src={cdnUrl(room.images[0])} alt={room.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-base mb-2">{room.name}</h2>
              <p className="text-sm text-gray-500 mb-3">
                Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
              </p>
              <div className="flex gap-2">
                <Link href={`/rooms/${toSlug(room.name)}`}
                  className="flex-1 text-center text-sm py-2 rounded border border-gray-300 hover:bg-gray-50">
                  {content.viewMoreButtonText}
                </Link>
                <a href={hotelData.hotel.bookingEngineUrl || '#'} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-sm py-2 rounded font-semibold"
                  style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
                  {content.bookNowButtonText}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Implement `RoomDetails.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData, Room } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface RoomDetailsContent {
  bookNowButtonText: string
  roomAmenitiesTitle: string
  bathroomAmenitiesTitle: string
  room?: Room
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomDetails({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomDetailsContent
  const room = content.room
  if (!room) return null
  const mainImage = room.images[0]

  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {mainImage && (
            <div className="relative h-80 rounded-lg overflow-hidden mb-4">
              <Image src={cdnUrl(mainImage)} alt={room.name} fill className="object-cover" sizes="(max-width:768px) 100vw,50vw" priority />
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {room.images.slice(1, 4).map((img, i) => (
              <div key={i} className="relative h-24 rounded overflow-hidden">
                <Image src={cdnUrl(img)} alt={`${room.name} ${i + 2}`} fill className="object-cover"
                  sizes="(max-width:768px) 33vw,16vw" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-3">{room.name}</h1>
          <p className="text-gray-600 mb-4">
            Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
          </p>
          {room.description && <p className="text-gray-600 mb-6 leading-relaxed">{room.description}</p>}
          <a href={hotelData.hotel.bookingEngineUrl || '#'} target="_blank" rel="noopener noreferrer"
            className="inline-block rounded px-6 py-3 font-semibold text-sm"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            {content.bookNowButtonText}
          </a>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Implement `RulesAndPolicies.tsx`**

```typescript
import type { SectionConfig, HotelData, RulesPoint } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface RulesCard { title: string; points: RulesPoint[] }
interface RulesContent { badge: string; rulesCard: RulesCard }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RulesAndPolicies({ section, hotelData }: Props) {
  const content = section.content as unknown as RulesContent
  const { policies } = hotelData
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && (
        <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block"
          style={{ backgroundColor: 'oklch(var(--color-badgeBg,96% 0.047 92.6))' }}>
          {content.badge}
        </span>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {content.rulesCard && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">{content.rulesCard.title}</h3>
            <ul className="space-y-3">
              {content.rulesCard.points?.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="font-medium w-28 shrink-0 text-gray-500">{p.label}:</span>
                  <span className={p.value.toLowerCase().includes('not') || p.value.toLowerCase().includes('no') ? 'text-red-600' : 'text-green-700'}>
                    {p.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Check-in / Check-out</h3>
          <p className="text-sm text-gray-600 mb-1">Check-in: {policies?.checkInTime}</p>
          <p className="text-sm text-gray-600">Check-out: {policies?.checkOutTime}</p>
          {policies?.cancellationPolicy && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{policies.cancellationPolicy}</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/
git commit -m "feat: implement room section components"
```

---

## Task 8: Amenity sections

- [ ] **Step 1: Implement `Amenities.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Link from 'next/link'

interface AmenitiesContent { badge: string; mainHeading: string; viewAllButtonHref: string; viewAllButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Amenities({ section, hotelData }: Props) {
  const content = section.content as unknown as AmenitiesContent
  const featured = hotelData.amenities.filter((a) => a.isFeatured).slice(0, 8)
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="text-center mb-8">
        {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
        <h2 className="text-3xl font-bold">{content.mainHeading}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map((a) => (
          <div key={a.id} className="bg-white rounded-lg p-4 text-center shadow-sm">
            <span className="material-symbols-outlined text-3xl mb-2 block" aria-hidden="true"
              style={{ color: 'oklch(var(--color-primary,26.5% 0.081 305.68))' }}>
              {a.icon || 'check_circle'}
            </span>
            <p className="text-sm font-medium">{a.name}</p>
          </div>
        ))}
      </div>
      {content.viewAllButtonHref && (
        <div className="text-center mt-8">
          <Link href={content.viewAllButtonHref}
            className="inline-block px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50">
            {content.viewAllButtonText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Implement `FeaturedAmenities.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface FAContent { badge: string; mainHeading: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function FeaturedAmenities({ section, hotelData }: Props) {
  const content = section.content as unknown as FAContent
  const featured = hotelData.amenities.filter((a) => a.isFeatured).slice(0, 6)
  return (
    <SectionWrapper>
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((a) => (
          <div key={a.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
            <span className="material-symbols-outlined text-2xl shrink-0 mt-1"
              style={{ color: 'oklch(var(--color-primary,26.5% 0.081 305.68))' }}>
              {a.icon || 'check_circle'}
            </span>
            <div>
              <p className="font-semibold text-sm mb-1">{a.name}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{a.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Implement `RoomAmenities.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface RAContent { badge: string; title: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomAmenities({ section, hotelData }: Props) {
  const content = section.content as unknown as RAContent
  const roomAmenities = hotelData.amenities
    .filter((a) => a.masterAmenityCategoryKey?.toLowerCase().includes('room') || a.category?.toLowerCase().includes('room'))
    .slice(0, 12)
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-2xl font-bold mb-6">{content.title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {roomAmenities.map((a) => (
          <div key={a.id} className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-base"
              style={{ color: 'oklch(var(--color-primary,26.5% 0.081 305.68))' }}>
              {a.icon || 'check'}
            </span>
            <span>{a.name}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Implement `HotelAmenities.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface HAContent { badge: string; title: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function HotelAmenities({ section, hotelData }: Props) {
  const content = section.content as unknown as HAContent
  const categories = Array.from(new Set(hotelData.amenities.map((a) => a.masterAmenityCategoryName).filter(Boolean)))
  return (
    <SectionWrapper>
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-2xl font-bold mb-8">{content.title}</h2>
      <div className="space-y-8">
        {categories.slice(0, 6).map((cat) => {
          const items = hotelData.amenities.filter((a) => a.masterAmenityCategoryName === cat).slice(0, 6)
          return (
            <div key={cat}>
              <h3 className="font-semibold text-base mb-3 text-gray-700">{cat}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {items.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-sm"
                      style={{ color: 'oklch(var(--color-primary,26.5% 0.081 305.68))' }}>
                      {a.icon || 'check'}
                    </span>
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/
git commit -m "feat: implement amenity section components"
```

---

## Task 9: Gallery, Restaurant, Reviews, Faqs, HowToReachUs, MapAndLocation, InstagramFeed

- [ ] **Step 1: Implement `Gallery.tsx`**

```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface GalleryContent { badge?: string; mainHeading?: string; viewAllHref?: string; viewAllText?: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Gallery({ section, hotelData }: Props) {
  const content = section.content as unknown as GalleryContent
  const images = hotelData.images.slice(0, 6)
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.mainHeading && <h2 className="text-3xl font-bold text-center mb-8">{content.mainHeading}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative h-48 rounded overflow-hidden">
            <Image src={cdnUrl(img.url)} alt={img.title || `Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width:768px) 50vw,33vw" />
          </div>
        ))}
      </div>
      {content.viewAllHref && (
        <div className="text-center mt-6">
          <Link href={content.viewAllHref} className="text-sm underline hover:opacity-70">{content.viewAllText}</Link>
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Implement `GalleryPage.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function GalleryPage({ hotelData }: Props) {
  const categories = Array.from(new Set(hotelData.images.map((i) => i.category).filter(Boolean)))
  return (
    <SectionWrapper>
      {categories.map((cat) => {
        const imgs = hotelData.images.filter((i) => i.category === cat)
        return (
          <div key={cat} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{cat}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {imgs.map((img, i) => (
                <div key={i} className="relative h-48 rounded overflow-hidden">
                  <Image src={cdnUrl(img.url)} alt={img.title || cat} fill className="object-cover"
                    sizes="(max-width:768px) 50vw,(max-width:1024px) 33vw,25vw" />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Implement `Restaurant.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface RestaurantContent { mainHeading: string; sectionLabel: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Restaurant({ section, hotelData }: Props) {
  const content = section.content as unknown as RestaurantContent
  return (
    <SectionWrapper>
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelData.dining.map((d, i) => (
          <article key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            {d.images[0] && (
              <div className="relative h-52">
                <Image src={cdnUrl(d.images[0])} alt={d.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,50vw" />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{d.category}</span>
              <h3 className="font-semibold text-lg mt-1 mb-2">{d.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{d.shortDescription}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Implement `RestaurantDescription.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface RDContent { images: string[]; paragraphs: string[]; mainHeading: string; sectionLabel: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RestaurantDescription({ section }: Props) {
  const content = section.content as unknown as RDContent
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
          <h2 className="text-3xl font-bold mb-4">{content.mainHeading}</h2>
          {content.paragraphs?.map((p, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-3">{p}</p>
          ))}
        </div>
        {content.images?.[0] && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src={cdnUrl(content.images[0])} alt={content.mainHeading} fill className="object-cover"
              sizes="(max-width:768px) 100vw,50vw" />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Implement `RestaurantTiming.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface RTContent {
  title: string; sectionLabel: string; breakfastLabel: string
  lunchLabel: string; highTeaLabel: string; dinnerLabel: string; additionalNote: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RestaurantTiming({ section, hotelData }: Props) {
  const content = section.content as unknown as RTContent
  const timingLabels: Record<string, string> = {
    Breakfast: content.breakfastLabel,
    Lunch: content.lunchLabel,
    'High Tea': content.highTeaLabel,
    Dinner: content.dinnerLabel,
  }
  return (
    <SectionWrapper>
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-2xl font-bold mb-6">{content.title}</h2>
      <div className="space-y-6">
        {hotelData.dining.map((d, i) => (
          d.mealTimings?.length > 0 && (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">{d.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {d.mealTimings.map((t, j) => (
                  <div key={j} className="text-sm">
                    <p className="font-medium text-gray-500">{timingLabels[t.label] ?? t.label}</p>
                    <p>{t.startTime} – {t.endTime}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      {content.additionalNote && <p className="text-sm text-gray-500 mt-4 italic">{content.additionalNote}</p>}
    </SectionWrapper>
  )
}
```

- [ ] **Step 6: Implement `Reviews.tsx`**

```typescript
import type { SectionConfig, HotelData, HighlightStat } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface ReviewsContent { mainHeading: string; sectionLabel: string; highlightStats: HighlightStat[] }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Reviews({ section, hotelData }: Props) {
  const content = section.content as unknown as ReviewsContent
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {content.highlightStats?.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl font-bold" style={{ color: 'oklch(var(--color-primary,26.5% 0.081 305.68))' }}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {hotelData.platformRating.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {hotelData.platformRating.map((r, i) => (
            <div key={i} className="bg-white rounded-lg px-4 py-3 shadow-sm text-center min-w-[100px]">
              <p className="font-bold text-lg">{r.rating}/{r.ratingOutOf}</p>
              <p className="text-xs text-gray-500">{r.source}</p>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 7: Implement `Faqs.tsx` (client component)**

```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface FaqsContent { badgeText: string; mainHeading: string; ctaTitle: string; ctaSubtitle: string; ctaButtonHref: string; ctaButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Faqs({ section, hotelData }: Props) {
  const content = section.content as unknown as FaqsContent
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <SectionWrapper>
      {content.badgeText && (
        <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
          style={{ backgroundColor: 'oklch(var(--color-badgeBg,96% 0.047 92.6))' }}>
          {content.badgeText}
        </span>
      )}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="max-w-2xl space-y-3">
        {hotelData.faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center px-4 py-4 text-left text-sm font-medium hover:bg-gray-50"
            >
              <span>{faq.question}</span>
              <span className="ml-2 shrink-0">{openId === faq.id ? '−' : '+'}</span>
            </button>
            {openId === faq.id && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      {content.ctaButtonHref && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-1">{content.ctaTitle}</h3>
          <p className="text-sm text-gray-500 mb-4">{content.ctaSubtitle}</p>
          <Link href={content.ctaButtonHref}
            className="inline-block px-5 py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            {content.ctaButtonText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 8: Implement `HowToReachUs.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface HowContent { badge: string; title: string; getDirectionsButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function HowToReachUs({ section, hotelData }: Props) {
  const content = section.content as unknown as HowContent
  const { address, geo } = hotelData.hotel
  const mapsUrl = `https://www.google.com/maps?q=${geo?.latitude ?? address?.latitude},${geo?.longitude ?? address?.longitude}`
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div>
            <p className="font-medium text-sm mb-1">Address</p>
            <p className="text-gray-600 text-sm">
              {address.addressLine1}, {address.city}, {address.state} {address.postalCode}, {address.country}
            </p>
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            {content.getDirectionsButtonText}
          </a>
        </div>
        <div className="rounded-lg overflow-hidden h-52 bg-gray-200">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${address.city},${address.state}`}
            width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Hotel location"
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 9: Implement `MapAndLocation.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function MapAndLocation({ hotelData }: Props) {
  const { address } = hotelData.hotel
  return (
    <SectionWrapper>
      <div className="rounded-lg overflow-hidden h-64 bg-gray-200">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent(`${address.addressLine1} ${address.city} ${address.state}`)}`}
          width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Map"
        />
      </div>
    </SectionWrapper>
  )
}
```

> **Note:** The Google Maps Embed API key used above is a public demo key with limited usage. For a real deployment, replace it with a project-specific key. If the embed fails, the gray placeholder is still rendered.

- [ ] **Step 10: Implement `InstagramFeed.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface InstaContent { sectionTitle: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function InstagramFeed({ section, hotelData }: Props) {
  const content = section.content as unknown as InstaContent
  const { instagram } = hotelData
  const posts = instagram.feed?.slice(0, 6) ?? []
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{content.sectionTitle}</h2>
        {instagram.userName && (
          <a href={`https://instagram.com/${instagram.userName}`} target="_blank" rel="noopener noreferrer"
            className="text-sm underline opacity-70 hover:opacity-100">
            @{instagram.userName}
          </a>
        )}
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {posts.map((post, i) => (
            <div key={i} className="relative aspect-square rounded overflow-hidden">
              <Image src={cdnUrl(post.imageUrl)} alt={`Instagram post ${i + 1}`} fill className="object-cover"
                sizes="(max-width:768px) 33vw,16vw" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No posts to display.</p>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 11: Commit**

```bash
git add src/components/sections/
git commit -m "feat: implement gallery, dining, reviews, faqs, reach, and instagram sections"
```

---

## Task 10: LocalAttraction, Experiences, FeaturedExperiences, ContactUs, TermsAndConditions

- [ ] **Step 1: Implement `LocalAttraction.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface LAContent { mainHeading: string; sectionLabel: string; getDirectionButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function LocalAttraction({ section, hotelData }: Props) {
  const content = section.content as unknown as LAContent
  const places = hotelData.nearbyPlaces.slice(0, 6)
  return (
    <SectionWrapper>
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, i) => (
          <article key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            {place.imageUrl && (
              <div className="relative h-44">
                <Image src={cdnUrl(place.imageUrl)} alt={place.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{place.category}</span>
              <h3 className="font-semibold mt-1 mb-1">{place.name}</h3>
              {place.distanceKm != null && (
                <p className="text-sm text-gray-500">{place.distanceKm} km away</p>
              )}
              {place.shortDescription && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{place.shortDescription}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Implement `FeaturedExperiences.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface FEContent { badge: string; title: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function FeaturedExperiences({ section, hotelData }: Props) {
  const content = section.content as unknown as FEContent
  const featured = hotelData.experiences.filter((e) => e.isFeatured)
  return (
    <SectionWrapper>
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-8">{content.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((exp, i) => (
          <article key={i} className="rounded-lg overflow-hidden border border-gray-200">
            {exp.images[0] && (
              <div className="relative h-48">
                <Image src={cdnUrl(exp.images[0])} alt={exp.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{exp.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{exp.shortDescription}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Implement `Experiences.tsx`**

```typescript
import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface ExpContent { badge: string; mainHeading: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Experiences({ section, hotelData }: Props) {
  const content = section.content as unknown as ExpContent
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelData.experiences.map((exp, i) => (
          <article key={i} className="flex gap-4">
            {exp.images[0] && (
              <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0">
                <Image src={cdnUrl(exp.images[0])} alt={exp.name} fill className="object-cover"
                  sizes="112px" />
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-1">{exp.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{exp.description}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Implement `ContactUs.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface ContactUsContent { formTitle: string; sectionBadge: string; sectionTitle: string; formDescription: string; submitButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function ContactUs({ section, hotelData }: Props) {
  const content = section.content as unknown as ContactUsContent
  const { contact } = hotelData
  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {content.sectionBadge && (
            <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.sectionBadge}</span>
          )}
          <h2 className="text-3xl font-bold mb-4">{content.sectionTitle}</h2>
          <p className="text-gray-600 mb-6">{content.formDescription}</p>
          <div className="space-y-2">
            {contact.phones?.[0] && <p className="text-sm"><span className="font-medium">Phone: </span>{contact.phones[0].value}</p>}
            {contact.emails?.[0] && <p className="text-sm"><span className="font-medium">Email: </span>{contact.emails[0].value}</p>}
          </div>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <h3 className="font-semibold text-lg">{content.formTitle}</h3>
          <input type="text" placeholder="Your Name" required
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ '--tw-ring-color': 'oklch(var(--color-ring,62.15% 0.127 86.49))' } as React.CSSProperties} />
          <input type="email" placeholder="Your Email" required
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2" />
          <textarea placeholder="Your Message" rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2" />
          <button type="submit"
            className="w-full py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            {content.submitButtonText}
          </button>
        </form>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Implement `TermsAndConditions.tsx`**

```typescript
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface Category { title: string; items: string[] }
interface TACContent { categories: Category[] }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function TermsAndConditions({ section, hotelData }: Props) {
  const content = section.content as unknown as TACContent
  const { policies } = hotelData
  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto space-y-8">
        {content.categories?.map((cat, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold mb-3">{cat.title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {cat.items?.map((item, j) => (
                <li key={j} className="text-gray-600 text-sm leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="text-xl font-semibold mb-3">Hotel Policies</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Check-in: {policies.checkInTime} | Check-out: {policies.checkOutTime}</li>
            <li>Pets: {policies.petsAllowed ? 'Allowed' : 'Not allowed'}</li>
            <li>Smoking: {policies.smokingAllowed ? 'Permitted' : 'Not permitted'}</li>
            <li>Parking: {policies.parkingAvailable ? 'Available' : 'Not available'}</li>
            {policies.cancellationPolicy && <li>{policies.cancellationPolicy}</li>}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/
git commit -m "feat: implement attraction, experience, contact, and policy section components"
```

---

## Task 11: All static page routes

**Files:** `src/app/page.tsx` and all `src/app/*/page.tsx`

- [ ] **Step 1: Create page helper function**

Add to `src/lib/data.ts` (append to end of file):
```typescript
export function buildPageMetadata(page: Page, globalMeta: GlobalMeta): import('next').Metadata {
  const { meta } = page
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle ?? meta.title,
      description: meta.ogDescription ?? meta.description,
      images: meta.ogImage ? [meta.ogImage] : [globalMeta.seo.defaultOgImage],
      type: 'website',
    },
    twitter: {
      card: (meta.twitterCard as 'summary_large_image') ?? 'summary_large_image',
      title: meta.twitterTitle ?? meta.title,
      description: meta.twitterDescription ?? meta.description,
      images: meta.twitterImage ? [meta.twitterImage as string] : undefined,
    },
    robots: meta.robots ?? globalMeta.seo.defaultRobots,
    alternates: { canonical: meta.canonicalPath },
  }
}
```

- [ ] **Step 2: Create `src/app/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { getPage, getHotelData, getWebsiteConfig, buildPageMetadata } from '@/lib/data'
import SectionRenderer from '@/components/sections/SectionRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage('/')!
  return buildPageMetadata(page, getWebsiteConfig().globalMeta)
}

export default function HomePage() {
  const page = getPage('/')!
  const hotelData = getHotelData()
  return page.sections.map((section) => (
    <SectionRenderer key={section.id} section={section} hotelData={hotelData} />
  ))
}
```

- [ ] **Step 3: Create all other static pages**

Create `src/app/rooms/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { getPage, getHotelData, getWebsiteConfig, buildPageMetadata } from '@/lib/data'
import SectionRenderer from '@/components/sections/SectionRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage('/rooms')!
  return buildPageMetadata(page, getWebsiteConfig().globalMeta)
}

export default function RoomsPage() {
  const page = getPage('/rooms')!
  const hotelData = getHotelData()
  return page.sections.map((section) => (
    <SectionRenderer key={section.id} section={section} hotelData={hotelData} />
  ))
}
```

Repeat this same pattern for:
- `src/app/facilities/page.tsx` — `getPage('/facilities')`
- `src/app/restaurants/page.tsx` — `getPage('/restaurants')`
- `src/app/gallery/page.tsx` — `getPage('/gallery')`
- `src/app/contactus/page.tsx` — `getPage('/contactus')`
- `src/app/attractions/page.tsx` — `getPage('/attractions')`
- `src/app/experiences/page.tsx` — `getPage('/experiences')`
- `src/app/policies/page.tsx` — `getPage('/policies')`

Each file is identical except the `getPage` slug argument and function name.

- [ ] **Step 4: Commit**

```bash
git add src/app/
git commit -m "feat: add all static page routes"
```

---

## Task 12: Dynamic room detail route

**Files:**
- Create: `src/app/rooms/[slug]/page.tsx`

- [ ] **Step 1: Create `src/app/rooms/[slug]/page.tsx`**

```typescript
import type { Metadata } from 'next'
import { getPage, getHotelData, getWebsiteConfig, getRoomBySlug, buildPageMetadata, toSlug } from '@/lib/data'
import SectionRenderer from '@/components/sections/SectionRenderer'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const hotelData = getHotelData()
  return hotelData.rooms.map((room) => ({ slug: toSlug(room.name) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const room = getRoomBySlug(slug)
  if (!room) return {}
  const config = getWebsiteConfig()
  const templatePage = getPage('/room-detail')!
  const base = buildPageMetadata(templatePage, config.globalMeta)
  return {
    ...base,
    title: `${room.name} | ${config.globalMeta.siteName}`,
    description: room.description || templatePage.meta.description,
  }
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = getRoomBySlug(slug)
  if (!room) notFound()

  const page = getPage('/room-detail')!
  const hotelData = getHotelData()

  const sectionsWithRoom = page.sections.map((section) => {
    if (section.component === 'RoomDetails') {
      return { ...section, content: { ...section.content, room } }
    }
    return section
  })

  return sectionsWithRoom.map((section) => (
    <SectionRenderer key={section.id} section={section} hotelData={hotelData} />
  ))
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/rooms/
git commit -m "feat: add dynamic room detail route with generateStaticParams"
```

---

## Task 13: Vercel config and build verification

**Files:**
- Create: `vercel.json`
- Verify: `next build` succeeds and `out/` contains expected HTML files

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "framework": "nextjs"
}
```

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected output includes:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    ...
├ ○ /rooms                               ...
├ ● /rooms/[slug]                        ...
│   ├ /rooms/superior-twin-room
│   ├ /rooms/family-room
│   └ ... (18 total)
├ ○ /facilities                          ...
...
```
All routes show `○` (static) or `●` (prerendered).

- [ ] **Step 3: Verify output directory**

```bash
ls out/
ls out/rooms/
```

Expected: `index.html`, `rooms/`, `facilities/`, `restaurants/`, `gallery/`, `contactus/`, `attractions/`, `experiences/`, `policies/` directories all present. `out/rooms/` contains 18+ subdirectories (one per room slug).

- [ ] **Step 4: Fix any TypeScript or build errors**

Run:
```bash
npm run build 2>&1
```

Common fixes:
- Missing `export default` in a section component → add it
- Type mismatch in a content cast → add `as unknown as X` cast
- `notFound()` import missing → add `import { notFound } from 'next/navigation'`

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "feat: add vercel.json and verify build produces 27+ static HTML files"
```

---

## Task 14: Deploy to Vercel and measure performance

- [ ] **Step 1: Push to GitHub (if not already)**

```bash
git remote -v  # confirm remote exists
git push origin main
```

If no remote: create a new GitHub repo named `poc-static-site-generation`, then:
```bash
git remote add origin https://github.com/<your-username>/poc-static-site-generation.git
git push -u origin main
```

- [ ] **Step 2: Import project in Vercel**

1. Go to https://vercel.com/new
2. Import the `poc-static-site-generation` repo
3. Framework: **Next.js** (auto-detected)
4. Build command: `next build` (default)
5. Output directory: `out` (Vercel auto-detects from `output: 'export'`)
6. Click **Deploy**

Expected: Build completes, Vercel provides a `.vercel.app` URL.

- [ ] **Step 3: Run PageSpeed Insights on three pages**

Open https://pagespeed.web.dev/ and test:

| Page | URL |
|------|-----|
| Home | `https://<your-vercel-url>.vercel.app/` |
| Rooms | `https://<your-vercel-url>.vercel.app/rooms/` |
| Gallery | `https://<your-vercel-url>.vercel.app/gallery/` |

For each page, record:
- Performance score (0–100)
- LCP (target: < 2.5s)
- CLS (target: < 0.1)
- TTFB (target: < 800ms)
- TBT (target: < 200ms)

- [ ] **Step 4: Document scores**

Create `docs/performance-results.md` with the table:

```markdown
# SSG Performance Results

Tested on: YYYY-MM-DD
Deployment: https://<url>.vercel.app

| Page     | Score | LCP   | CLS  | TTFB  | TBT   |
|----------|-------|-------|------|-------|-------|
| Home     |       |       |      |       |       |
| Rooms    |       |       |      |       |       |
| Gallery  |       |       |      |       |       |
```

- [ ] **Step 5: Final commit**

```bash
git add docs/performance-results.md
git commit -m "docs: add performance results from Vercel SSG deployment"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Next.js 15 App Router + `output: 'export'` — Task 1
- ✅ `websiteconfig.json` + `hotelwebsitedata.json` read at build time — Task 2
- ✅ Work Sans + IBM Plex Sans via `next/font` — Task 3
- ✅ CSS variables from theme colors — Tasks 3 + 2 (`generateThemeCSS`)
- ✅ Header + Footer from config — Task 4
- ✅ All 29 section components — Tasks 6–10
- ✅ SectionRenderer mapper — Task 5
- ✅ All 10 page types → 27 HTML files — Tasks 11–12
- ✅ `generateStaticParams` for 18 room pages — Task 12
- ✅ `images: { unoptimized: true }` — Task 1
- ✅ `priority` on hero images — Task 6 Hero.tsx
- ✅ `vercel.json` — Task 13
- ✅ Performance measurement plan — Task 14

**Placeholder scan:** No TBDs. All component code is complete.

**Type consistency:** `SectionConfig`, `HotelData`, `Room`, `Faq`, `PlatformRating` defined once in `data.ts` and used consistently. `buildPageMetadata` added to `data.ts` in Task 11 after types are established in Task 2.
