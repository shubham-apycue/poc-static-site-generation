import type { Metadata } from 'next'
import { Work_Sans, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { getWebsiteConfig, getHotelData } from '@/lib/data'
import { generateThemeCSS } from '@/lib/theme'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const config = getWebsiteConfig()
  const { globalMeta } = config
  return {
    title: {
      default: globalMeta.siteName,
      template: `%s | ${globalMeta.siteName}`,
    },
    description: globalMeta.seo.defaultRobots,
    metadataBase: new URL(globalMeta.seo.siteUrl),
    openGraph: {
      siteName: globalMeta.siteName,
      images: [globalMeta.seo.defaultOgImage],
    },
    robots: globalMeta.seo.defaultRobots,
    verification: globalMeta.seo.googleSiteVerification
      ? { google: globalMeta.seo.googleSiteVerification }
      : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = getWebsiteConfig()
  const hotelData = getHotelData()
  const themeCSS = generateThemeCSS({
    colors: config.theme.colors,
    typography: config.theme.typography as never,
    icons: config.theme.icons,
    radius: config.theme.radius,
  })

  return (
    <html lang="en" className={`${workSans.variable} ${ibmPlexSans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body>
        <Header config={config.header} hotel={hotelData.hotel} pages={config.pages} />
        <main>{children}</main>
        <Footer config={config.footer} hotel={hotelData.hotel} contact={hotelData.contact} pages={config.pages} />
      </body>
    </html>
  )
}
