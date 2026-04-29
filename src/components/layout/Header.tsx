import Link from 'next/link'
import Image from 'next/image'
import type { HeaderConfig, Hotel, Page } from '@/lib/data'
import { cdnUrl } from '@/lib/images'

interface Props {
  config: HeaderConfig
  hotel: Hotel
  pages: Page[]
}

export default function Header({ config, hotel, pages }: Props) {
  const navPages = pages.filter((p) => p.isVisibleHeader && p.slug !== '/room-detail')
  const bookingUrl = hotel.bookingEngineUrl || '#'

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm"
      style={{ backgroundColor: 'oklch(var(--color-layoutHeaderBg, 100% 0 0))' }}
    >
      <Link href="/" className="flex items-center gap-3">
        {hotel.logo?.light ? (
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
        className="rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
          color: 'oklch(var(--btn-primary-foreground, 100% 0 0))',
        }}
      >
        {config.content.bookNowButtonText}
      </a>
    </header>
  )
}
