import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface RTContent {
  title: string; sectionLabel: string; breakfastLabel: string
  lunchLabel: string; highTeaLabel: string; dinnerLabel: string; additionalNote: string
}
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RestaurantTiming({ section, hotelData }: Props) {
  const content = section.content as unknown as RTContent
  const timingLabels: Record<string, string> = {
    Breakfast: content.breakfastLabel,
    Lunch: content.lunchLabel,
    'High Tea': content.highTeaLabel,
    Dinner: content.dinnerLabel,
  }
  return (
    <SectionWrapper>
      {content.sectionLabel && <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{content.sectionLabel}</p>}
      <h2 className="text-2xl font-bold mb-6">{content.title}</h2>
      <div className="space-y-6">
        {hotelData.dining.map((d, i) => (
          d.mealTimings?.length > 0 && (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">{d.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {d.mealTimings.map((t, j) => (
                  <div key={j} className="text-sm">
                    <p className="font-medium text-gray-500">{timingLabels[t.label] ?? t.label}</p>
                    <p>{t.startTime} – {t.endTime}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      {content.additionalNote && <p className="text-sm text-gray-500 mt-4 italic">{content.additionalNote}</p>}
    </SectionWrapper>
  )
}
