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
