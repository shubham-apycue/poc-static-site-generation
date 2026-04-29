import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface LAContent { mainHeading: string; sectionLabel: string; getDirectionButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function LocalAttraction({ section, hotelData }: Props) {
  const content = section.content as unknown as LAContent
  const places = hotelData.nearbyPlaces.slice(0, 6)
  return (
    <SectionWrapper>
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, i) => (
          <article key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            {place.imageUrl && (
              <div className="relative h-44">
                <Image src={cdnUrl(place.imageUrl)} alt={place.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{place.category}</span>
              <h3 className="font-semibold mt-1 mb-1">{place.name}</h3>
              {place.distanceKm != null && (
                <p className="text-sm text-gray-500">{place.distanceKm} km away</p>
              )}
              {place.shortDescription && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{place.shortDescription}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
