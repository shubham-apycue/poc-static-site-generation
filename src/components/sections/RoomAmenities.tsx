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
            <span className="text-base" aria-hidden="true">{a.icon || '✓'}</span>
            <span>{a.name}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
