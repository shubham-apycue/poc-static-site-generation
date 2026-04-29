import type { Metadata } from 'next'
import { getPage, getHotelData, getWebsiteConfig, buildPageMetadata } from '@/lib/data'
import SectionRenderer from '@/components/sections/SectionRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage('/attractions')!
  return buildPageMetadata(page, getWebsiteConfig().globalMeta)
}

export default function AttractionsPage() {
  const page = getPage('/attractions')!
  const hotelData = getHotelData()
  return page.sections.map((section) => (
    <SectionRenderer key={section.id} section={section} hotelData={hotelData} />
  ))
}
