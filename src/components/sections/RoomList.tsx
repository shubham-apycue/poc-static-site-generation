import Image from 'next/image'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { toSlug } from '@/lib/data'
import { DISABLE_IMAGES } from '@/lib/flags'

interface RoomListContent { bookNowButtonText: string; viewMoreButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomList({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomListContent
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelData.rooms.map((room) => (
          <article key={room.id} className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="relative h-52">
              {!DISABLE_IMAGES && room.images[0] ? (
                <Image src={cdnUrl(room.images[0])} alt={room.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-base mb-2">{room.name}</h2>
              <p className="text-sm text-gray-500 mb-3">
                Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
              </p>
              <div className="flex gap-2">
                <Link href={`/rooms/${toSlug(room.name)}`}
                  className="flex-1 text-center text-sm py-2 rounded border border-gray-300 hover:bg-gray-50">
                  {content.viewMoreButtonText}
                </Link>
                <a href={hotelData.hotel.bookingEngineUrl || '#'} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-sm py-2 rounded font-semibold"
                  style={{ backgroundColor: 'oklch(var(--btn-primary,80% 0.15 85))', color: 'oklch(var(--btn-primary-foreground,20% 0 0))' }}>
                  {content.bookNowButtonText}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
