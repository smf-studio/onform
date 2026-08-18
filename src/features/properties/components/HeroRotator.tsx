import { useEffect, useMemo, useState } from 'react'

import type { Property } from 'features/properties/schema'

import { AssetImage } from 'features/properties/components/AssetImage'
import { formatMeta, heroImage } from 'features/properties/utils'
import { cn } from 'lib/utils'

const ROTATE_MS = 6000
const FADE_MS = 900

/* The hero: one clean inset photograph per property, slowly crossfading
   through all six. Nothing overlays the image; the active property's
   name and metadata sit below it on white. Rotation pauses entirely for
   reduced motion and when the tab is hidden. */
export function HeroRotator({ properties }: { properties: Property[] }) {
  const frames = useMemo(
    () =>
      properties.map((property) => ({
        image: heroImage(property),
        property,
      })),
    [properties],
  )
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const id = window.setInterval(() => {
      if (document.hidden) return
      setActive((current) => (current + 1) % frames.length)
    }, ROTATE_MS)
    return () => {
      window.clearInterval(id)
    }
  }, [frames.length])

  const current = frames.at(active % frames.length)
  if (!current) return null

  return (
    <section aria-label="Featured properties">
      <div className="px-3 sm:px-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-notch sm:aspect-[16/8.2]">
          {frames.map(({ image, property }, index) => (
            <div
              className={cn(
                'absolute inset-0 transition-opacity motion-reduce:transition-none',
                index === active ? 'opacity-100' : 'opacity-0',
              )}
              key={property.slug}
              style={{ transitionDuration: `${String(FADE_MS)}ms` }}
            >
              <AssetImage
                className="size-full"
                image={image}
                priority={index === 0}
                sizes="100vw"
                slug={property.slug}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-baseline justify-between gap-x-8 gap-y-1 px-5 pt-5 pb-2 sm:px-7">
        <h1 className="font-display text-4xl leading-none sm:text-5xl">
          {current.property.displayName}
        </h1>
        <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
          {formatMeta(current.property)}
        </p>
      </div>
    </section>
  )
}
