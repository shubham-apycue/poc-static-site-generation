import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface ExpContent { badge: string; mainHeading: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Experiences({ section, hotelData }: Props) {
  const content = section.content as unknown as ExpContent
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelData.experiences.map((exp, i) => (
          <article key={i} className="flex gap-4">
            {exp.images[0] && (
              <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0">
                <Image src={cdnUrl(exp.images[0])} alt={exp.name} fill className="object-cover" sizes="112px" />
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-1">{exp.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{exp.description}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
