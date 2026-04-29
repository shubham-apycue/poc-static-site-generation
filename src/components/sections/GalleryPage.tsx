import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'

interface Props { section: SectionConfig; hotelData: HotelData }

export default function GalleryPage({ hotelData }: Props) {
  const categories = Array.from(new Set(hotelData.images.map((i) => i.category).filter(Boolean)))
  return (
    <SectionWrapper>
      {categories.map((cat) => {
        const imgs = hotelData.images.filter((i) => i.category === cat)
        return (
          <div key={cat} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{cat}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {imgs.map((img, i) => (
                <div key={i} className="relative h-48 rounded overflow-hidden">
                  <Image src={cdnUrl(img.url)} alt={img.title || cat} fill className="object-cover"
                    sizes="(max-width:768px) 50vw,(max-width:1024px) 33vw,25vw" />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </SectionWrapper>
  )
}
