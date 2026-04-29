import Image from 'next/image'
import type { SectionConfig, HotelData } from '@/lib/data'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { cdnUrl } from '@/lib/images'
import { DISABLE_IMAGES } from '@/lib/flags'

interface InstaContent { sectionTitle: string }
interface Props { section: SectionConfig; hotelData: HotelData }

export default function InstagramFeed({ section, hotelData }: Props) {
  const content = section.content as unknown as InstaContent
  const { instagram } = hotelData
  const posts = instagram.feed?.slice(0, 6) ?? []
  return (
    <SectionWrapper backGroundVariant="muted">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{content.sectionTitle}</h2>
        {instagram.userName && (
          <a href={`https://instagram.com/${instagram.userName}`} target="_blank" rel="noopener noreferrer"
            className="text-sm underline opacity-70 hover:opacity-100">
            @{instagram.userName}
          </a>
        )}
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {posts.map((post, i) => (
            <div key={i} className="relative aspect-square rounded overflow-hidden">
              {!DISABLE_IMAGES ? (
                <Image src={cdnUrl(post.imageUrl)} alt={`Instagram post ${i + 1}`} fill className="object-cover"
                  sizes="(max-width:768px) 33vw,16vw" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No posts to display.</p>
      )}
    </SectionWrapper>
  )
}
