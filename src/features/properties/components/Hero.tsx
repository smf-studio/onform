import type { Property } from 'features/properties/schema'

import { AssetImage } from 'features/properties/components/AssetImage'
import { heroImage } from 'features/properties/utils'

/* One still photograph, inset with the same gutter on the sides and the
   bottom, filling the rest of the first viewport. Nothing overlays it and
   nothing rotates; the unveil animation runs once on load. */
export function Hero({ property }: { property: Property }) {
  return (
    <section
      aria-label="Featured property"
      className="min-h-0 flex-1 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="hero-unveil relative h-full overflow-hidden rounded-notch">
        <AssetImage
          className="hero-settle size-full"
          fill
          image={heroImage(property)}
          priority
          sizes="100vw"
          slug={property.slug}
        />
      </div>
    </section>
  )
}
