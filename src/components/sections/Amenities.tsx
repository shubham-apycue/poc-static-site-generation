import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface AmenitiesContent { badge: string; mainHeading: string; viewAllButtonHref: string; viewAllButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Amenities({ section, hotelData }: Props) {
  const content = section.content as unknown as AmenitiesContent
  const featured = hotelData.amenities.filter((a) => a.isFeatured).slice(0, 8)
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="text-center mb-8">
        {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
        <h2 className="text-3xl font-bold">{content.mainHeading}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map((a) => (
          <div key={a.id} className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl mb-2" aria-hidden="true">{a.icon || '✓'}</p>
            <p className="text-sm font-medium">{a.name}</p>
          </div>
        ))}
      </div>
      {content.viewAllButtonHref && (
        <div className="text-center mt-8">
          <Link href={content.viewAllButtonHref}
            className="inline-block px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50">
            {content.viewAllButtonText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
