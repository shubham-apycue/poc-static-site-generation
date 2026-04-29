import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface BannerHeroContent { heading: string; pageName: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function BannerHero({ section }: Props) {
  const content = section.content as unknown as BannerHeroContent
  return (
    <SectionWrapper backGroundVariant="primary" className="py-16">
      <div className="text-center text-white">
        <p className="text-sm uppercase tracking-widest opacity-70 mb-2">{content.pageName}</p>
        <h1 className="text-3xl md:text-5xl font-bold">{content.heading}</h1>
      </div>
    </SectionWrapper>
  )
}
