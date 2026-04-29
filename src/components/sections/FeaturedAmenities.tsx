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
            <span className="material-symbols-outlined icon-xl shrink-0 mt-1" aria-hidden="true">
              {String(a.icon || 'check').trim().toLowerCase()}
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
