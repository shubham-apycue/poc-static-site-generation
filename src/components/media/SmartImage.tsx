'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { imagesDisabled } from '@/lib/flags'

type Props = Omit<ImageProps, 'placeholder' | 'alt'> & {
  alt: string
  fallbackClassName?: string
}

export default function SmartImage({ fallbackClassName, ...props }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showImage = useMemo(() => mounted && !imagesDisabled(), [mounted])

  if (!showImage) {
    // Keep layout consistent for `fill` and fixed-size images.
    if ('fill' in props && props.fill) {
      return <div className={fallbackClassName ?? 'w-full h-full bg-gray-200'} />
    }

    const width = typeof props.width === 'number' ? `${props.width}px` : undefined
    const height = typeof props.height === 'number' ? `${props.height}px` : undefined
    return <div className={fallbackClassName ?? 'bg-gray-200'} style={{ width, height }} />
  }

  const { alt, ...rest } = props
  return <Image alt={alt} {...rest} />
}
