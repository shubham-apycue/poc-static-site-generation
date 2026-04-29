import type { Metadata } from 'next'
import { getPage, getHotelData, getWebsiteConfig, buildPageMetadata } from '@/lib/data'
import SectionRenderer from '@/components/sections/SectionRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage('/restaurants')!
  return buildPageMetadata(page, getWebsiteConfig().globalMeta)
}

export default function RestaurantsPage() {
  const page = getPage('/restaurants')!
  const hotelData = getHotelData()
  return page.sections.map((section) => (
    <SectionRenderer key={section.id} section={section} hotelData={hotelData} />
  ))
}
