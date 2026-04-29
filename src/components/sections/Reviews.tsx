import type { SectionConfig, HotelData, HighlightStat } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface ReviewsContent { mainHeading: string; sectionLabel: string; highlightStats: HighlightStat[] }
interface Props { section: SectionConfig; hotelData: HotelData }

function getPlatformLabel(source: string, label: string | Record<string, string> | undefined): string {
  if (label && typeof label === 'object' && label['en-US']) return label['en-US']
  if (typeof label === 'string' && label) return label
  const normalized = source.toUpperCase()
  if (normalized === 'BOOKING') return 'Booking.com'
  if (normalized === 'AGODA') return 'Agoda'
  if (normalized === 'GOIBIBO') return 'Goibibo'
  if (normalized === 'MAKEMYTRIP') return 'MakeMyTrip'
  if (normalized === 'GOOGLE_HOTELS') return 'Google'
  if (normalized === 'TRIPADVISOR') return 'Tripadvisor'
  return source
}

function getPlatformAccent(source: string): { bg: string; fg: string } {
  const normalized = source.toUpperCase()
  if (normalized === 'BOOKING') return { bg: '#1a56db', fg: '#ffffff' }
  if (normalized === 'AGODA') return { bg: '#ffffff', fg: '#1f2937' }
  if (normalized === 'GOIBIBO') return { bg: '#16a34a', fg: '#ffffff' }
  if (normalized === 'MAKEMYTRIP') return { bg: '#1e3a8a', fg: '#ffffff' }
  if (normalized === 'GOOGLE_HOTELS') return { bg: '#ffffff', fg: '#111827' }
  if (normalized === 'TRIPADVISOR') return { bg: '#ffffff', fg: '#111827' }
  return { bg: '#ffffff', fg: '#111827' }
}

export default function Reviews({ section, hotelData }: Props) {
  const content = section.content as unknown as ReviewsContent
  return (
    <SectionWrapper backGroundVariant="accent">
      <div className="text-center mb-8">
        {content.sectionLabel && (
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-4"
            style={{ backgroundColor: 'oklch(var(--badge, 96% 0.047 92.6))' }}
          >
            {content.sectionLabel}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-bold">{content.mainHeading}</h2>
      </div>

      {hotelData.platformRating.length > 0 && (
        <div
          className="w-full border-y"
          style={{ borderColor: 'oklch(var(--border-default, 93% 0.086 92))' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-0">
            {hotelData.platformRating.map((r, i) => {
              const accent = getPlatformAccent(r.source)
              const label = getPlatformLabel(r.source, r.label)
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-6">
                  <div
                    className="w-14 h-14 flex items-center justify-center font-bold text-lg radius-card-inner"
                    style={{ backgroundColor: accent.bg, color: accent.fg, border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    {r.rating.toFixed(1).replace(/\\.0$/, '')}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">{label}</div>
                    <div className="text-gray-500">
                      {r.ratingOutOf ? `out of ${r.ratingOutOf}` : ''}
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-12 ml-6" style={{ backgroundColor: '#d1d5db' }} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {content.highlightStats?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-center">
          {content.highlightStats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold" style={{ color: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))' }}>
                {s.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
