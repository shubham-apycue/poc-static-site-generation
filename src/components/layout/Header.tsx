import Link from 'next/link'
import Image from 'next/image'
import type { Contact, HeaderConfig, Hotel, Page } from '@/lib/data'
import { cdnUrl } from '@/lib/images'
import { DISABLE_IMAGES } from '@/lib/flags'

interface Props {
  config: HeaderConfig
  hotel: Hotel
  pages: Page[]
  contact: Contact
}

export default function Header({ config, hotel, pages, contact }: Props) {
  const navPages = pages.filter((p) => p.isVisibleHeader && p.slug !== '/room-detail')
  const bookingUrl = hotel.bookingEngineUrl || '#'
  const phone = contact.phones?.[0]?.value
  const email = contact.emails?.[0]?.value
  const city = hotel.address?.city

  return (
    <header className="sticky top-0 z-50 w-full">
      {(phone || email || city) && (
        <div
          className="h-10 flex items-center"
          style={{ backgroundColor: 'oklch(var(--card-accent, var(--primary, 26.5% 0.081 305)))' }}
        >
          <div className="w-full flex items-center justify-between padding-left padding-right text-white">
            <div className="hidden md:flex items-center gap-6 text-sm">
              {phone && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                    call
                  </span>
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                    mail
                  </span>
                  <span>{email}</span>
                </div>
              )}
            </div>
            {city && (
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                  location_on
                </span>
                <span>{city}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="border-b"
        style={{
          backgroundColor: 'oklch(var(--layout-header-bg, 100% 0 0))',
          color: 'oklch(var(--layout-header-foreground, 15% 0 0))',
          borderColor: 'oklch(var(--border-default, 93% 0.086 92))',
        }}
      >
        <div className="relative flex items-center justify-between h-[72px] md:h-[90px] padding-left padding-right">
          <details className="md:hidden">
            <summary className="inline-flex items-center justify-center rounded p-2 list-none cursor-pointer">
              <span className="material-symbols-outlined icon-md" aria-hidden="true">
                menu
              </span>
            </summary>
            <nav className="absolute left-0 right-0 top-[72px] border-b padding-left padding-right pb-4 bg-white">
              <div className="flex flex-col gap-2 pt-2">
                {navPages.map((p) => (
                  <Link
                    key={p.slug}
                    href={p.slug}
                    className="py-2 text-sm font-medium border-b"
                    style={{ borderColor: 'oklch(var(--border, 90% 0 0))' }}
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </nav>
          </details>

          <Link href="/" className="flex items-center gap-3">
            {!DISABLE_IMAGES && hotel.logo?.light ? (
              <Image
                src={cdnUrl(hotel.logo.light)}
                alt={hotel.name}
                width={140}
                height={40}
                style={{ height: 40, width: 'auto' }}
                priority
              />
            ) : (
              <span className="text-xl font-bold">{hotel.name}</span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navPages.map((p) => (
              <Link
                key={p.slug}
                href={p.slug}
                className="text-sm font-medium hover:opacity-70 transition-opacity capitalize"
              >
                {p.name}
              </Link>
            ))}
          </nav>

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 inline-flex items-center gap-2"
            style={{
              backgroundColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
              color: 'oklch(var(--btn-primary-foreground, 100% 0 0))',
            }}
          >
            {config.content.bookNowButtonText}
            <span className="material-symbols-outlined icon-sm" aria-hidden="true">
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
