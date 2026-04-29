import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface Category { title: string; items: string[] }
interface TACContent { categories: Category[] }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function TermsAndConditions({ section, hotelData }: Props) {
  const content = section.content as unknown as TACContent
  const { policies } = hotelData
  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto space-y-8">
        {content.categories?.map((cat, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold mb-3">{cat.title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {cat.items?.map((item, j) => (
                <li key={j} className="text-gray-600 text-sm leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="text-xl font-semibold mb-3">Hotel Policies</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Check-in: {policies.checkInTime} | Check-out: {policies.checkOutTime}</li>
            <li>Pets: {policies.petsAllowed ? 'Allowed' : 'Not allowed'}</li>
            <li>Smoking: {policies.smokingAllowed ? 'Permitted' : 'Not permitted'}</li>
            <li>Parking: {policies.parkingAvailable ? 'Available' : 'Not available'}</li>
            {policies.cancellationPolicy && <li>{policies.cancellationPolicy}</li>}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  )
}
