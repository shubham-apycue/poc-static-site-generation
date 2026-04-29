import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface HowContent { badge: string; title: string; getDirectionsButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function HowToReachUs({ section, hotelData }: Props) {
  const content = section.content as unknown as HowContent
  const { address } = hotelData.hotel
  const mapsUrl = `https://www.google.com/maps?q=${address?.latitude ?? ''},${address?.longitude ?? ''}`
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.badge}</span>}
      <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div>
            <p className="font-medium text-sm mb-1">Address</p>
            <p className="text-gray-600 text-sm">
              {address.addressLine1}, {address.city}, {address.state} {address.postalCode}, {address.country}
            </p>
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            {content.getDirectionsButtonText}
          </a>
        </div>
        <div className="rounded-lg overflow-hidden h-52 bg-gray-200 flex items-center justify-center">
          <p className="text-sm text-gray-500">{address.city}, {address.state}</p>
        </div>
      </div>
    </SectionWrapper>
  )
}
