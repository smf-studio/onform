import { useState } from 'react'

import type { PropertyImage } from 'features/properties/schema'

import { largestVariantUrl, srcSetFor } from 'features/properties/utils'
import { cn } from 'lib/utils'

interface AssetImageProps {
  className?: string
  /* Fill the parent instead of reserving the image's aspect ratio. */
  fill?: boolean
  image: PropertyImage
  imgClassName?: string
  priority?: boolean
  sizes: string
  slug: string
}

/* Responsive picture with a blur-up arrival: the tiny inline placeholder
   shows immediately, the decoded image fades in over it. Aspect ratio is
   reserved from the manifest dimensions so nothing shifts. */
export function AssetImage({
  slug,
  image,
  sizes,
  priority = false,
  fill = false,
  className,
  imgClassName,
}: AssetImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      className={cn('relative overflow-hidden bg-secondary', className)}
      style={
        fill
          ? undefined
          : { aspectRatio: `${String(image.width)} / ${String(image.height)}` }
      }
    >
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full scale-105 object-cover blur-md"
        src={image.derived.blur}
      />
      <picture>
        <source
          sizes={sizes}
          srcSet={srcSetFor(slug, image.derived, 'avif')}
          type="image/avif"
        />
        <source
          sizes={sizes}
          srcSet={srcSetFor(slug, image.derived, 'webp')}
          type="image/webp"
        />
        <img
          alt={image.alt}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:transition-none',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => {
            setLoaded(true)
          }}
          sizes={sizes}
          src={largestVariantUrl(slug, image.derived)}
        />
      </picture>
    </div>
  )
}
