import Link from 'next/link'
import SmartImage from '@/components/media/SmartImage'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface AmenitiesContent { badge: string; mainHeading: string; viewAllButtonHref: string; viewAllButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Amenities({ section, hotelData }: Props) {
  const content = section.content as unknown as AmenitiesContent
  const featured = hotelData.amenities.filter((a) => a.isFeatured).slice(0, 4)
  return (
    <SectionWrapper>
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          {content.badge && (
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-3"
              style={{ backgroundColor: 'oklch(var(--badge, 96% 0.047 92.6))' }}
            >
              {content.badge}
            </span>
          )}
          <h2 className="text-4xl font-bold">{content.mainHeading}</h2>
        </div>
        {content.viewAllButtonHref && (
          <Link href={content.viewAllButtonHref} className="text-sm underline underline-offset-4">
            {content.viewAllButtonText}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {featured.map((a) => (
          <div key={a.id} className="relative overflow-hidden radius-image" style={{ height: 360 }}>
            {a.images?.[0] && (
              <SmartImage
                src={cdnUrl(a.images[0])}
                alt={a.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 25vw"
              />
            )}
            <div
              className="absolute bottom-4 left-4 right-4 px-4 py-3 radius-card-inner"
              style={{
                backgroundColor: 'oklch(var(--card, 100% 0 0) / 0.92)',
                color: 'oklch(var(--card-foreground, 15% 0 0))',
              }}
            >
              <p className="text-sm font-semibold">{a.name}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
