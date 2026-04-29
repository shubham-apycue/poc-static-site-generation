'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'

interface FaqsContent { badgeText: string; mainHeading: string; ctaTitle: string; ctaSubtitle: string; ctaButtonHref: string; ctaButtonText: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function Faqs({ section, hotelData }: Props) {
  const content = section.content as unknown as FaqsContent
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <SectionWrapper>
      {content.badgeText && (
        <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
          style={{ backgroundColor: 'oklch(var(--color-badgeBg,96% 0.047 92.6))' }}>
          {content.badgeText}
        </span>
      )}
      <h2 className="text-3xl font-bold mb-8">{content.mainHeading}</h2>
      <div className="max-w-2xl space-y-3">
        {hotelData.faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center px-4 py-4 text-left text-sm font-medium hover:bg-gray-50"
            >
              <span>{faq.question}</span>
              <span className="ml-2 shrink-0">{openId === faq.id ? '−' : '+'}</span>
            </button>
            {openId === faq.id && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      {content.ctaButtonHref && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-1">{content.ctaTitle}</h3>
          <p className="text-sm text-gray-500 mb-4">{content.ctaSubtitle}</p>
          <Link href={content.ctaButtonHref}
            className="inline-block px-5 py-2 rounded text-sm font-semibold"
            style={{ backgroundColor: 'oklch(var(--color-btnPrimary,80% 0.15 85))', color: 'oklch(var(--color-btnPrimaryForeground,20% 0 0))' }}>
            {content.ctaButtonText}
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
