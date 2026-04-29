import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface AboutPlaceContent {
  images: string[]; imageAlt: string; paragraphs: string[]
  mainHeading: string; sectionLabel: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function AboutThePlace({ section }: Props) {
  const content = section.content as unknown as AboutPlaceContent
  const img = content.images?.[0]
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
          <h2 className="text-3xl font-bold mb-4">{content.mainHeading}</h2>
          {content.paragraphs?.map((p, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-3">{p}</p>
          ))}
        </div>
        {img && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src={cdnUrl(img)} alt={content.imageAlt || 'Place'} fill className="object-cover"
              sizes="(max-width:768px) 100vw,50vw" />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
