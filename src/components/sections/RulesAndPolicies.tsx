import type { SectionConfig, HotelData, RulesPoint } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface RulesCard { title: string; points: RulesPoint[] }
interface RulesContent { badge: string; rulesCard: RulesCard }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function RulesAndPolicies({ section, hotelData }: Props) {
  const content = section.content as unknown as RulesContent
  const { policies } = hotelData
  return (
    <SectionWrapper backGroundVariant="muted">
      {content.badge && (
        <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block"
          style={{ backgroundColor: 'oklch(var(--badge,96% 0.047 92.6))' }}>
          {content.badge}
        </span>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {content.rulesCard && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">{content.rulesCard.title}</h3>
            <ul className="space-y-3">
              {content.rulesCard.points?.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="font-medium w-28 shrink-0 text-gray-500">{p.label}:</span>
                  <span className={p.value.toLowerCase().includes('not') || p.value.toLowerCase().includes('no') ? 'text-red-600' : 'text-green-700'}>
                    {p.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Check-in / Check-out</h3>
          <p className="text-sm text-gray-600 mb-1">Check-in: {policies?.checkInTime}</p>
          <p className="text-sm text-gray-600">Check-out: {policies?.checkOutTime}</p>
          {policies?.cancellationPolicy && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{policies.cancellationPolicy}</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
