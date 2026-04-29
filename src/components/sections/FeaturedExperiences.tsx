import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface FEContent { badge: string; title: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function FeaturedExperiences({ section, hotelData }: Props) {
  const content = section.content as unknown as FEContent
  const featured = hotelData.experiences.filter((e) => e.isFeatured)
  return (
    <SectionWrapper>
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-8">{content.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((exp, i) => (
          <article key={i} className="rounded-lg overflow-hidden border border-gray-200">
            {exp.images[0] && (
              <div className="relative h-48">
                <Image src={cdnUrl(exp.images[0])} alt={exp.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{exp.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{exp.shortDescription}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
