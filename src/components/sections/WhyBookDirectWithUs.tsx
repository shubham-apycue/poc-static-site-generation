import Image from 'next/image'
import type { SectionConfig, HotelData, Feature } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface WBDContent { badge: string; image: string; features: Feature[] }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function WhyBookDirectWithUs({ section, hotelData }: Props) {
  const content = section.content as unknown as WBDContent
  const bookingUrl = hotelData.hotel.bookingEngineUrl || '#'
  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {content.image && (
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src={cdnUrl(content.image)} alt="Book direct" fill className="object-cover" sizes="(max-width:768px) 100vw,50vw" />
          </div>
        )}
        <div>
          {content.badge && (
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
              style={{ backgroundColor: 'oklch(var(--badge,96% 0.047 92.6))', color: 'oklch(var(--badge-foreground,30% 0 0))' }}>
              {content.badge}
            </span>
          )}
          <ul className="space-y-4 mt-4">
            {content.features?.map((f, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'oklch(var(--primary,26.5% 0.081 305.68))', color: 'white' }}>
                  <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                    {String(f.icon || '').trim().toLowerCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-block rounded px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--btn-primary,80% 0.15 85))', color: 'oklch(var(--btn-primary-foreground,20% 0 0))' }}>
            Book Now
          </a>
        </div>
      </div>
    </SectionWrapper>
  )
}
