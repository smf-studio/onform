import { Link } from '@tanstack/react-router'

import type { Property } from 'features/properties/schema'

import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'
import { formatMeta } from 'features/properties/utils'

/* A property in its entirety: deep-linkable page styled as an overlay
   panel. Facts stay pinned on the left while every frame in the bank
   scrolls on the right, featured first, ending at the next project. */
export function ProjectOverlay({ property }: { property: Property }) {
  const index = properties.findIndex((p) => p.slug === property.slug)
  const next = properties.at((index + 1) % properties.length) ?? property
  const featured = property.images.filter((image) => image.featured)
  const gallery = property.images.filter((image) => !image.featured)

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto grid max-w-screen-2xl sm:grid-cols-[minmax(240px,2fr)_5fr]">
        <aside className="flex flex-col gap-4 border-b px-5 py-6 sm:sticky sm:top-0 sm:h-svh sm:border-r sm:border-b-0 sm:px-7 sm:py-8">
          <Link
            aria-label="Back to all projects"
            className="w-fit text-[11px] font-medium tracking-[0.16em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
            hash={property.slug}
            to="/"
          >
            CLOSE
          </Link>
          <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">
            {property.displayName}
          </h1>
          <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
            {formatMeta(property)}
          </p>
          <p className="max-w-xs text-sm text-body-copy">
            {property.paragraph}
          </p>
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground">
            {`${String(property.images.length)} FRAMES`}
          </p>
          <Link
            className="mt-auto pt-6 text-[11px] font-medium tracking-[0.16em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
            params={{ slug: next.slug }}
            to="/projects/$slug"
          >
            {`NEXT  ${next.displayName.toUpperCase()}`}
          </Link>
        </aside>
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {featured.map((image, imageIndex) => (
            <AssetImage
              className="rounded-notch"
              image={image}
              key={image.file}
              priority={imageIndex === 0}
              sizes="(min-width: 640px) 70vw, 100vw"
              slug={property.slug}
            />
          ))}
          {gallery.length > 0 && (
            <>
              <p className="px-1 pt-4 text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
                FROM THE WIDER SET
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {gallery.map((image) => (
                  <AssetImage
                    className="rounded-lg"
                    image={image}
                    key={image.file}
                    sizes="(min-width: 640px) 35vw, 50vw"
                    slug={property.slug}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
