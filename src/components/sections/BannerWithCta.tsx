import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface BannerCtaContent { title: string; description: string; bookNowButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function BannerWithCta({ section, hotelData }: Props) {
  const content = section.content as unknown as BannerCtaContent
  const bookingUrl = hotelData.hotel.bookingEngineUrl || '#'
  return (
    <SectionWrapper backGroundVariant="accent">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{content.title}</h2>
        <p className="text-gray-600 mb-6">{content.description}</p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded px-6 py-3 font-semibold text-sm"
          style={{
            backgroundColor: 'oklch(var(--color-btnPrimary, 80% 0.15 85))',
            color: 'oklch(var(--color-btnPrimaryForeground, 20% 0 0))',
          }}
        >
          {content.bookNowButtonText}
        </a>
      </div>
    </SectionWrapper>
  )
}
