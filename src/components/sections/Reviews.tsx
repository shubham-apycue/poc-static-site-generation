import type { SectionConfig, HotelData, HighlightStat } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface ReviewsContent { mainHeading: string; sectionLabel: string; highlightStats: HighlightStat[] }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Reviews({ section, hotelData }: Props) {
  const content = section.content as unknown as ReviewsContent
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {content.highlightStats?.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl font-bold" style={{ color: 'oklch(var(--color-primary,26.5% 0.081 305.68))' }}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {hotelData.platformRating.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {hotelData.platformRating.map((r, i) => (
            <div key={i} className="bg-white rounded-lg px-4 py-3 shadow-sm text-center min-w-[100px]">
              <p className="font-bold text-lg">{r.rating}/{r.ratingOutOf}</p>
              <p className="text-xs text-gray-500">{r.source}</p>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
