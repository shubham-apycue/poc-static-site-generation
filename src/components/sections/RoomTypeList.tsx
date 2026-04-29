'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { toSlug } from '@/lib/data'
import { useMemo, useRef } from 'react'

interface RoomTypeListContent {
  mainHeading: string; sectionTitle: string
  viewAllRoomsHref: string; viewAllRoomsText: string
  bookNowButtonText: string; viewDetailsButtonText: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RoomTypeList({ section, hotelData }: Props) {
  const content = section.content as unknown as RoomTypeListContent
  const rooms = useMemo(() => hotelData.rooms.slice(0, 6), [hotelData.rooms])
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  function scrollByCard(dir: 'prev' | 'next') {
    const el = scrollerRef.current
    if (!el) return
    const delta = Math.max(320, Math.round(el.clientWidth * 0.9))
    el.scrollBy({ left: dir === 'next' ? delta : -delta, behavior: 'smooth' })
  }

  return (
    <SectionWrapper backGroundVariant="accent">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          {content.sectionTitle && (
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-3"
              style={{ backgroundColor: 'oklch(var(--badge, 96% 0.047 92.6))' }}
            >
              {content.sectionTitle}
            </span>
          )}
          <h2 className="text-4xl font-bold">{content.mainHeading}</h2>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {content.viewAllRoomsHref && (
            <Link href={content.viewAllRoomsHref} className="text-sm underline underline-offset-4">
              {content.viewAllRoomsText}
            </Link>
          )}
          <button
            type="button"
            className="w-10 h-10 border inline-flex items-center justify-center"
            style={{ borderColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))' }}
            aria-label="Previous"
            onClick={() => scrollByCard('prev')}
          >
            <span className="material-symbols-outlined icon-sm" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <button
            type="button"
            className="w-10 h-10 border inline-flex items-center justify-center"
            style={{ borderColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))' }}
            aria-label="Next"
            onClick={() => scrollByCard('next')}
          >
            <span className="material-symbols-outlined icon-sm" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {rooms.map((room) => (
          <article
            key={room.id}
            className="shrink-0 bg-white border p-4 radius-card"
            style={{
              width: 380,
              scrollSnapAlign: 'start',
              borderColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49) / 0.4)',
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden radius-image">
              {room.images[0] ? (
                <Image
                  src={cdnUrl(room.images[0])}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw,(max-width:1200px) 60vw, 380px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            <h3 className="font-semibold text-lg mt-4">{room.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Up to {room.capacity.adults} adults
              {room.capacity.children > 0 ? `, ${room.capacity.children} children` : ''}
            </p>

            <div className="flex gap-4 mt-5">
              <a
                href={hotelData.hotel.bookingEngineUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm py-3 font-semibold radius-button"
                style={{
                  backgroundColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
                  color: 'oklch(var(--btn-primary-foreground, 100% 0 0))',
                }}
              >
                {content.bookNowButtonText}
              </a>
              <Link
                href={`/rooms/${toSlug(room.name)}`}
                className="flex-1 text-center text-sm py-3 border radius-button"
                style={{
                  borderColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
                  color: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
                }}
              >
                {content.viewDetailsButtonText}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {content.viewAllRoomsHref && (
        <div className="md:hidden mt-8">
          <Link href={content.viewAllRoomsHref} className="text-sm underline underline-offset-4">
            {content.viewAllRoomsText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
