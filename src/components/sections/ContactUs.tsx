import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface ContactUsContent { formTitle: string; sectionBadge: string; sectionTitle: string; formDescription: string; submitButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function ContactUs({ section, hotelData }: Props) {
  const content = section.content as unknown as ContactUsContent
  const { contact } = hotelData
  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {content.sectionBadge && (
            <span className="text-xs font-semibold uppercase tracking-widest opacity-60 block mb-2">{content.sectionBadge}</span>
          )}
          <h2 className="text-3xl font-bold mb-4">{content.sectionTitle}</h2>
          <p className="text-gray-600 mb-6">{content.formDescription}</p>
          <div className="space-y-2">
            {contact.phones?.[0] && <p className="text-sm"><span className="font-medium">Phone: </span>{contact.phones[0].value}</p>}
            {contact.emails?.[0] && <p className="text-sm"><span className="font-medium">Email: </span>{contact.emails[0].value}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{content.formTitle}</h3>
          <input type="text" placeholder="Your Name" aria-label="Your Name"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none" />
          <input type="email" placeholder="Your Email" aria-label="Your Email"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none" />
          <textarea placeholder="Your Message" rows={4} aria-label="Your Message"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none" />
          <button type="button"
            className="w-full py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--btn-primary,80% 0.15 85))', color: 'oklch(var(--btn-primary-foreground,20% 0 0))' }}>
            {content.submitButtonText}
          </button>
        </div>
      </div>
    </SectionWrapper>
  )
}
