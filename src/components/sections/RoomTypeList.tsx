import Image from 'next/image'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { toSlug } from '@/lib/data'

interface RoomTypeListContent {
  mainHeading: string; sectionTitle: string
  viewAllRoomsHref: string; viewAllRoomsText: string
  bookNowButtonText: string; viewDetailsButtonText: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomTypeList({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomTypeListContent
  const rooms = hotelData.rooms.slice(0, 6)
  return (
    <SectionWrapper>
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionTitle}</p>
        <h2 className="text-3xl font-bold">{content.mainHeading}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="relative h-52">
              {room.images[0] ? (
                <Image src={cdnUrl(room.images[0])} alt={room.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              {room.isBestSeller && (
                <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: 'oklch(var(--btn-primary,80% 0.15 85))', color: 'oklch(var(--btn-primary-foreground,20% 0 0))' }}>
                  Best Seller
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-1">
                Up to {room.capacity.adults} adults{room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
              </p>
              <div className="flex gap-2 mt-3">
                <Link href={`/rooms/${toSlug(room.name)}`}
                  className="flex-1 text-center text-sm py-2 rounded border border-gray-300 hover:bg-gray-50">
                  {content.viewDetailsButtonText}
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
      {content.viewAllRoomsHref && (
        <div className="text-center mt-8">
          <Link href={content.viewAllRoomsHref}
            className="inline-block px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50">
            {content.viewAllRoomsText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
