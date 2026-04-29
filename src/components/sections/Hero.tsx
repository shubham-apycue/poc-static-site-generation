import SmartImage from '@/components/media/SmartImage'
import type { SectionConfig, HotelData, CarouselImage, TrustItem } from '@/lib/data'
import { cdnUrl } from '@/lib/images'

interface HeroContent {
  title: string
  description: string
  carouselImages: CarouselImage[]
  trustUspItems: TrustItem[]
}

interface Props { section: SectionConfig; hotelData: HotelData }

export default function Hero({ section, hotelData }: Props) {
  const content = section.content as unknown as HeroContent
  const firstImage = content.carouselImages?.[0]
  const bookingUrl = hotelData.hotel.bookingEngineUrl || '#'

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden bg-gray-900">
      {firstImage && (
        <SmartImage
          src={cdnUrl(firstImage.src)}
          alt={firstImage.alt}
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
      )}
      <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-16 pt-32 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{content.title}</h1>
        <p className="text-base md:text-lg opacity-90 mb-8 max-w-xl">{content.description}</p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded px-8 py-3 font-semibold text-sm border"
          style={{
            backgroundColor: 'oklch(var(--btn-secondary, 100% 0 0))',
            color: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
            borderColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
          }}
        >
          Book Your Stay
          <span className="material-symbols-outlined icon-sm" aria-hidden="true">
            arrow_forward
          </span>
        </a>
      </div>
      {content.trustUspItems?.length > 0 && (
        <div
          className="relative z-10 w-full overflow-x-auto hide-scrollbar"
          style={{
            backgroundColor: 'oklch(var(--card-accent, 26.5% 0.081 305.68))',
            color: 'oklch(var(--card-accent-foreground, 100% 0 0))',
          }}
        >
          <div className="flex gap-6 px-6 py-3 min-w-max mx-auto">
            {content.trustUspItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                  {String(item.icon || '').trim().toLowerCase()}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
