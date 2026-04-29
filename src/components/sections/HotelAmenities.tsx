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
                    <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                      {String(a.icon || 'check').trim().toLowerCase()}
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
