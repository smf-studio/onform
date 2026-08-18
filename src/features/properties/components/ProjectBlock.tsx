import { Link } from '@tanstack/react-router'

import type { Property } from 'features/properties/schema'

import { AssetImage } from 'features/properties/components/AssetImage'
import { Notch } from 'features/properties/components/Notch'
import { formatMeta, gridImages, heroImage } from 'features/properties/utils'
import { cn } from 'lib/utils'

/* One gallery block per property: a showcase row (large frame with the
   name carved into a bottom-left notch, facts beside it) followed by an
   editorial grid of supporting frames. Rows alternate direction. */
export function ProjectBlock({
  property,
  flip,
}: {
  flip: boolean
  property: Property
}) {
  const hero = heroImage(property)
  const grid = gridImages(property, 3)

  return (
    <article className="flex flex-col gap-5 sm:gap-7" id={property.slug}>
      <div
        className={cn(
          'grid items-end gap-5 sm:gap-8',
          flip ? 'sm:grid-cols-[4fr_7fr]' : 'sm:grid-cols-[7fr_4fr]',
        )}
      >
        <Link
          className={cn(
            'notch-host group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
            flip && 'sm:order-2',
          )}
          params={{ slug: property.slug }}
          to="/projects/$slug"
        >
          <AssetImage
            className="size-full"
            image={hero}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
            sizes="(min-width: 640px) 62vw, 100vw"
            slug={property.slug}
          />
          <Notch>
            <span className="font-display text-2xl leading-tight sm:text-4xl">
              {property.displayName}
            </span>
          </Notch>
        </Link>
        <div
          className={cn(
            'flex flex-col gap-3 pb-1',
            flip ? 'sm:order-1 sm:items-end sm:text-right' : '',
          )}
        >
          <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
            {formatMeta(property)}
          </p>
          <p className="max-w-xs text-sm text-body-copy">
            {property.paragraph}
          </p>
          <Link
            className="text-[11px] font-medium tracking-[0.16em] text-foreground underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
            params={{ slug: property.slug }}
            to="/projects/$slug"
          >
            {`VIEW ALL ${String(property.images.length)} FRAMES`}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {grid.map((image) => (
          <figure className="m-0 flex flex-col gap-2" key={image.file}>
            <AssetImage
              className="rounded-lg"
              image={image}
              sizes="(min-width: 640px) 30vw, 33vw"
              slug={property.slug}
            />
            <figcaption className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              {image.category.replace(/-/g, ' ')}
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  )
}
