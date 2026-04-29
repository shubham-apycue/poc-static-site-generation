import websiteConfigRaw from '../../websiteconfig.json'
import hotelDataRaw from '../../hotelwebsitedata.json'

export interface CarouselImage { src: string; alt: string }
export interface TrustItem { icon: string; text: string }
export interface Feature { icon: string; title: string; description: string }
export interface HighlightStat { label: string; value: string }
export interface NavLink { label: string; href: string }
export interface RulesPoint { text: string; label: string; value: string }

export type SectionContent = Record<string, unknown>

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
  twitterImage?: string
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
  openingTime: string
  closingTime: string
}

export interface DiningVenue {
  name: string
  description: string
  shortDescription: string
  images: string[]
  mealTimings: Record<string, MealTiming> | null
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
      images: meta.twitterImage ? [meta.twitterImage] : undefined,
    },
    robots: meta.robots ?? globalMeta.seo.defaultRobots,
    alternates: { canonical: meta.canonicalPath },
  }
}
