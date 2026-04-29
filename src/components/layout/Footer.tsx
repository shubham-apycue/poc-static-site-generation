import Link from 'next/link'
import type { FooterConfig, Hotel, Contact, Page } from '@/lib/data'

interface Props {
  config: FooterConfig
  hotel: Hotel
  contact: Contact
  pages: Page[]
}

export default function Footer({ config, hotel, contact, pages }: Props) {
  const { content } = config
  const discoverPages = pages.filter((p) => p.isVisibleFooter && p.slug !== '/room-detail')
  const phone = contact.phones?.[0]?.value
  const email = contact.emails?.[0]?.value
  const addr = contact.address

  return (
    <footer
      className="px-6 py-12"
      style={{
        backgroundColor: 'oklch(var(--color-layoutFooterBg, 20% 0 0))',
        color: 'oklch(var(--color-layoutFooterForeground, 100% 0 0))',
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-semibold mb-3">{content.contactTitle}</h3>
          {addr && (
            <p className="text-sm opacity-80 mb-2">
              {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
            </p>
          )}
          {phone && <p className="text-sm opacity-80">{content.phoneLabel}: {phone}</p>}
          {email && <p className="text-sm opacity-80">{content.emailLabel}: {email}</p>}
        </div>

        <div>
          <h3 className="font-semibold mb-3">{content.discoverSectionTitle}</h3>
          <ul className="space-y-1">
            {discoverPages.map((p) => (
              <li key={p.slug}>
                <Link href={p.slug} className="text-sm opacity-80 hover:opacity-100 capitalize">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{content.connectText}</h3>
          <div className="flex gap-3 flex-wrap">
            {contact.socialLinks?.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-80 hover:opacity-100 underline"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-xs opacity-60">
        &copy; {new Date().getFullYear()} {hotel.name}. {content.copyright}
      </div>
    </footer>
  )
}
