# Static Site Generation POC — Design Spec

**Date:** 2026-04-29  
**Goal:** Build a Next.js SSG POC for Park Regis Goa using `websiteconfig.json` + `hotelwebsitedata.json`, deploy to Vercel, and measure Lighthouse/PageSpeed performance scores to understand the impact of SSG on performance compared to the current SSR `site-renderer` in `apycue-repo`.

---

## 1. Architecture

### Framework & Build Strategy

- **Next.js 15** with **App Router**
- `output: 'export'` in `next.config.ts` — every page is pre-built to static HTML at `next build`
- No server required at runtime; Vercel serves all files from CDN edge
- **Tailwind CSS v4** (matches `apycue-repo`)
- **TypeScript**

### Data Sources (build time only)

| File | Purpose |
|------|---------|
| `websiteconfig.json` | Page definitions, section configs, theme, header, footer, SEO metadata |
| `hotelwebsitedata.json` | Hotel content — rooms, amenities, images, dining, experiences, nearby places, FAQs |

Both files are read once in `src/lib/data.ts` at build time. No API calls, no runtime fetching.

### Image Handling

- All hotel images are relative paths (e.g. `hotels/d1bca22a-.../gallery/original/xyz.webp`)
- CDN base: `https://storage.googleapis.com/apycue-public-dev/`
- `src/lib/images.ts` exports `cdnUrl(path)` to construct full URLs
- `images: { unoptimized: true }` in `next.config.ts` (required for `output: 'export'`; images are already `.webp` on GCS so no quality loss)
- Hero/above-fold images use `priority` prop on `next/image` to preload for LCP

### Fonts

- `next/font/google` for **Work Sans** (headings) and **IBM Plex Sans** (body)
- Fonts injected as CSS variables in `layout.tsx`: `--font-heading`, `--font-body`
- Zero external font requests → eliminates CLS from font swap

### Theming

- `src/lib/theme.ts` reads `websiteconfig.json`'s `theme.colors` + `theme.typography` and generates a CSS custom properties string
- Injected via `<style>` tag inside `layout.tsx` `<head>` — same pattern as `apycue-repo`'s `generateThemeCSS()`
- No JS needed for theming at runtime

---

## 2. Page & Route Structure

**Total output: 27 pre-built HTML files**

| Route | Source | Sections |
|-------|--------|---------|
| `/` | websiteconfig page `/` | 10 sections |
| `/rooms` | websiteconfig page `/rooms` | 2 sections |
| `/rooms/[slug]` × 18 | websiteconfig page `/room-detail` template | 6 sections each |
| `/facilities` | websiteconfig page `/facilities` | 5 sections |
| `/restaurants` | websiteconfig page `/restaurants` | 5 sections |
| `/gallery` | websiteconfig page `/gallery` | 3 sections |
| `/contactus` | websiteconfig page `/contactus` | 5 sections |
| `/attractions` | websiteconfig page `/attractions` | 4 sections |
| `/experiences` | websiteconfig page `/experiences` | 4 sections |
| `/policies` | websiteconfig page `/policies` | 2 sections |

**Room slugs** are derived from room names at build time: `"Superior Twin Room"` → `superior-twin-room`.

`generateStaticParams()` in `src/app/rooms/[slug]/page.tsx` reads `hotelwebsitedata.json` and returns one entry per room.

---

## 3. Project File Structure

```
poc-static-site-generation/
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs         # Tailwind v4 via PostCSS
├── vercel.json
├── websiteconfig.json          # existing
├── hotelwebsitedata.json       # existing
└── src/
    ├── app/
    │   ├── layout.tsx           # fonts, theme CSS vars, Header, Footer, root metadata
    │   ├── page.tsx             # /
    │   ├── rooms/
    │   │   ├── page.tsx         # /rooms
    │   │   └── [slug]/
    │   │       └── page.tsx     # /rooms/[slug]
    │   ├── facilities/page.tsx
    │   ├── restaurants/page.tsx
    │   ├── gallery/page.tsx
    │   ├── contactus/page.tsx
    │   ├── attractions/page.tsx
    │   ├── experiences/page.tsx
    │   └── policies/page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   ├── sections/
    │   │   ├── SectionRenderer.tsx   # maps component name → React component
    │   │   ├── Hero.tsx
    │   │   ├── WhyBookDirectWithUs.tsx
    │   │   ├── RoomTypeList.tsx
    │   │   ├── RoomList.tsx
    │   │   ├── RoomDetails.tsx
    │   │   ├── Amenities.tsx
    │   │   ├── FeaturedAmenities.tsx
    │   │   ├── RoomAmenities.tsx
    │   │   ├── HotelAmenities.tsx
    │   │   ├── AboutHotel.tsx
    │   │   ├── Gallery.tsx
    │   │   ├── GalleryPage.tsx
    │   │   ├── Reviews.tsx
    │   │   ├── Faqs.tsx             # uses 'use client' for accordion toggle
    │   │   ├── HowToReachUs.tsx
    │   │   ├── InstagramFeed.tsx
    │   │   ├── BannerHero.tsx
    │   │   ├── BannerWithCta.tsx
    │   │   ├── Restaurant.tsx
    │   │   ├── RestaurantDescription.tsx
    │   │   ├── RestaurantTiming.tsx
    │   │   ├── ContactUs.tsx
    │   │   ├── MapAndLocation.tsx
    │   │   ├── AboutThePlace.tsx
    │   │   ├── LocalAttraction.tsx
    │   │   ├── Experiences.tsx
    │   │   ├── FeaturedExperiences.tsx
    │   │   ├── RulesAndPolicies.tsx
    │   │   └── TermsAndConditions.tsx
    │   └── ui/
    │       └── SectionWrapper.tsx    # shared padding/background variant wrapper
    └── lib/
        ├── data.ts                   # load + merge both JSON files, typed
        ├── theme.ts                  # generate CSS variables from theme config
        └── images.ts                 # cdnUrl() helper
```

---

## 4. Component & Data Flow

### SectionRenderer

```tsx
// Receives one section config + full hotelData
// Maps section.component → the right React component
// Passes section.content + the relevant hotelData slice
<SectionRenderer section={section} hotelData={hotelData} />
```

All section components are **React Server Components** by default. Only `Faqs.tsx` needs `'use client'` for accordion open/close state.

### Data injection rules

| Component(s) | hotelData slice injected |
|---|---|
| `RoomTypeList`, `RoomList` | `hotelData.rooms` |
| `Amenities`, `FeaturedAmenities`, `RoomAmenities`, `HotelAmenities` | `hotelData.amenities` |
| `Gallery`, `GalleryPage` | `hotelData.images` |
| `Restaurant`, `RestaurantDescription`, `RestaurantTiming` | `hotelData.dining` |
| `Experiences`, `FeaturedExperiences` | `hotelData.experiences` |
| `LocalAttraction` | `hotelData.nearbyPlaces` |
| `Faqs` | `hotelData.faqs` |
| `Reviews` | `hotelData.reviews` + `hotelData.platformRating` |
| `RoomDetails`, `RulesAndPolicies` | Single room from `hotelData.rooms` (matched by slug) |
| All others | `section.content` only (text/images already in websiteconfig) |

### Header & Footer

Read directly from `websiteconfig.json`'s `header` and `footer` keys. Rendered in `layout.tsx` so they appear on every page without duplication.

---

## 5. Vercel Deployment

### `vercel.json`

```json
{
  "framework": "nextjs"
}
```

Vercel auto-detects `output: 'export'` and serves the `out/` directory from its CDN edge network globally.

### Build command

```
next build
```

Output directory: `out/`

### No environment variables needed

All data comes from the two JSON files committed to the repo.

---

## 6. Performance Measurement Plan

After deploying to Vercel:

1. Run **PageSpeed Insights** (`pagespeed.web.dev`) on:
   - Homepage (`/`)
   - Rooms page (`/rooms`)
   - Gallery page (`/gallery`)

2. Key metrics to record:

| Metric | What it measures |
|--------|-----------------|
| **LCP** (Largest Contentful Paint) | How fast the hero image/heading loads |
| **CLS** (Cumulative Layout Shift) | Font swap stability, image dimension stability |
| **TTFB** (Time to First Byte) | CDN edge delivery speed vs SSR server processing |
| **TBT** (Total Blocking Time) | JS bundle blocking the main thread |
| **Performance Score** | Overall Lighthouse score (0–100) |

3. Compare against the live `apycue-repo` `site-renderer` deployment (SSR) on the same pages.

4. Expected outcome: SSG should show significantly lower TTFB (CDN edge vs server render), better or equal LCP, minimal TBT (no heavy client-side JS).

---

## 7. Constraints & Out of Scope

- **No contact form submission** — `ContactUs` section renders the form UI only; no API route (static export has no server)
- **No blog pages** — not present in `websiteconfig.json`
- **No i18n / multi-language** — single language (English) only
- **No on-demand revalidation** — static export; re-deploy to update content
- **Instagram feed** — renders static snapshot from `hotelwebsitedata.json` only (no live API call)
- **Map embed** — renders hotel coordinates as a static link/iframe; no interactive JS map library
