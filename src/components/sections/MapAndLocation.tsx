import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function MapAndLocation({ hotelData }: Props) {
  const { address } = hotelData.hotel
  const mapsUrl = `https://www.google.com/maps?q=${address?.latitude ?? ''},${address?.longitude ?? ''}`
  return (
    <SectionWrapper>
      <div className="rounded-lg overflow-hidden h-64 bg-gray-100 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-600 font-medium">{address.addressLine1}, {address.city}</p>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm underline"
          style={{ color: 'oklch(var(--color-link,62.15% 0.127 86.49))' }}>
          View on Google Maps
        </a>
      </div>
    </SectionWrapper>
  )
}
