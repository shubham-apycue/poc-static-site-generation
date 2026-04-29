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
    <SectionWrapper backGroundVariant="accent">
      <div className="mb-8">
        {content.badgeText && (
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-4"
            style={{ backgroundColor: 'oklch(var(--badge, 96% 0.047 92.6))' }}
          >
            {content.badgeText}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-bold">{content.mainHeading}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div
          className="p-8 radius-card"
          style={{
            backgroundColor: 'oklch(var(--card-accent, 26.5% 0.081 305.68))',
            color: 'oklch(var(--card-accent-foreground, 100% 0 0))',
          }}
        >
          <h3 className="text-2xl font-bold">{content.ctaTitle}</h3>
          <p className="mt-2 opacity-90">{content.ctaSubtitle}</p>
          {content.ctaButtonHref && (
            <Link
              href={content.ctaButtonHref}
              className="mt-6 inline-flex items-center justify-center px-8 py-3 font-semibold radius-button"
              style={{
                backgroundColor: 'oklch(var(--btn-secondary, 100% 0 0))',
                color: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))',
              }}
            >
              {content.ctaButtonText}
            </Link>
          )}
        </div>

        <div
          className="border-t"
          style={{ borderColor: 'oklch(var(--border-default, 93% 0.086 92))' }}
        >
          {hotelData.faqs.map((faq, idx) => {
            const open = openId === faq.id
            return (
              <div
                key={faq.id}
                className="border-b"
                style={{ borderColor: 'oklch(var(--border-default, 93% 0.086 92))' }}
              >
                <button
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-semibold">{idx + 1}.</span>
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                  <span className="material-symbols-outlined icon-md" aria-hidden="true">
                    {open ? 'remove' : 'add'}
                  </span>
                </button>
                {open && (
                  <div className="pb-6 pl-9 text-sm text-gray-700 leading-relaxed">
                    {faq.answer}
                    <div className="mt-3">
                      <button
                        type="button"
                        className="text-sm underline underline-offset-4"
                        style={{ color: 'oklch(var(--btn-primary, 62.15% 0.127 86.49))' }}
                        onClick={() => setOpenId(null)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
