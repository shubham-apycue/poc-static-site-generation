import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface RestaurantContent { mainHeading: string; sectionLabel: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Restaurant({ section, hotelData }: Props) {
  const content = section.content as unknown as RestaurantContent
  return (
    <SectionWrapper>
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelData.dining.map((d, i) => (
          <article key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            {d.images[0] && (
              <div className="relative h-52">
                <Image src={cdnUrl(d.images[0])} alt={d.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,50vw" />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{d.category}</span>
              <h3 className="font-semibold text-lg mt-1 mb-2">{d.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{d.shortDescription}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
