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

  it('renders nothing when isVisible is false', () => {
    const section: SectionConfig = {
      id: 's4', component: 'Hero', variant: 'hero-03',
      content: {}, isVisible: false, backGroundVariant: 'default',
    }
    const { container } = render(<SectionRenderer section={section} hotelData={mockHotelData} />)
    expect(container.firstChild).toBeNull()
  })
})
