import Image from 'next/image'
import type { SectionConfig, HotelData, Room } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { DISABLE_IMAGES } from '@/lib/flags'

interface RoomDetailsContent {
  bookNowButtonText: string
  roomAmenitiesTitle: string
  bathroomAmenitiesTitle: string
  room?: Room
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomDetails({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomDetailsContent
  const room = content.room
  if (!room) return null
  const mainImage = room.images[0]

  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {mainImage && !DISABLE_IMAGES && (
            <div className="relative h-80 rounded-lg overflow-hidden mb-4">
              <Image src={cdnUrl(mainImage)} alt={room.name} fill className="object-cover" sizes="(max-width:768px) 100vw,50vw" priority />
            </div>
          )}
          {DISABLE_IMAGES && <div className="h-80 rounded-lg bg-gray-200 mb-4" />}
          <div className="grid grid-cols-3 gap-2">
            {room.images.slice(1, 4).map((img, i) => (
              <div key={i} className="relative h-24 rounded overflow-hidden">
                {!DISABLE_IMAGES ? (
                  <Image src={cdnUrl(img)} alt={`${room.name} ${i + 2}`} fill className="object-cover" sizes="(max-width:768px) 33vw,16vw" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-3">{room.name}</h1>
          <p className="text-gray-600 mb-4">
            Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
          </p>
          {room.description && <p className="text-gray-600 mb-6 leading-relaxed">{room.description}</p>}
          <a href={hotelData.hotel.bookingEngineUrl || '#'} target="_blank" rel="noopener noreferrer"
            className="inline-block rounded px-6 py-3 font-semibold text-sm"
            style={{ backgroundColor: 'oklch(var(--btn-primary,80% 0.15 85))', color: 'oklch(var(--btn-primary-foreground,20% 0 0))' }}>
            {content.bookNowButtonText}
          </a>
        </div>
      </div>
    </SectionWrapper>
  )
}
