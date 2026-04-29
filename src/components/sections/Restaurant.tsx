import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function Restaurant({ section }: Props) {
  return (
    <SectionWrapper backGroundVariant={section.backGroundVariant}>
      <div />
    </SectionWrapper>
  )
}
