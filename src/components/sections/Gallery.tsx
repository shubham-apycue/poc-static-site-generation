import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { DISABLE_IMAGES } from '@/lib/flags'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function Gallery({ hotelData }: Props) {
  const images = hotelData.images.slice(0, 6)
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative h-48 rounded overflow-hidden">
            {!DISABLE_IMAGES ? (
              <Image src={cdnUrl(img.url)} alt={img.title || `Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width:768px) 50vw,33vw" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
