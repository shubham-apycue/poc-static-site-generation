import type { Metadata } from 'next'
import { getPage, getHotelData, getWebsiteConfig, buildPageMetadata } from '@/lib/data'
import SectionRenderer from '@/components/sections/SectionRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage('/policies')!
  return buildPageMetadata(page, getWebsiteConfig().globalMeta)
}

export default function PoliciesPage() {
  const page = getPage('/policies')!
  const hotelData = getHotelData()
  return page.sections.map((section) => (
    <SectionRenderer key={section.id} section={section} hotelData={hotelData} />
  ))
}
