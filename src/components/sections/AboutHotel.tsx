import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { DISABLE_IMAGES } from '@/lib/flags'

interface AboutContent {
  image: string; imageAlt: string; description: string
  mainHeading?: string; sectionLabel?: string
  happyCustomerCount?: string; happyCustomerLabel?: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function AboutHotel({ section, hotelData }: Props) {
  const content = section.content as unknown as AboutContent
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
          <h2 className="text-3xl font-bold mb-4">{content.mainHeading ?? hotelData.hotel.name}</h2>
          <p className="text-gray-600 leading-relaxed">{content.description ?? hotelData.hotel.description}</p>
          {content.happyCustomerCount && (
            <p className="mt-4 text-sm font-semibold">{content.happyCustomerCount} {content.happyCustomerLabel}</p>
          )}
        </div>
        {content.image && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            {!DISABLE_IMAGES ? (
              <Image src={cdnUrl(content.image)} alt={content.imageAlt || 'Hotel'} fill className="object-cover"
                sizes="(max-width:768px) 100vw,50vw" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
