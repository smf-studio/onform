import { Reveal } from 'components/shared/Reveal'
import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'

/* The interlude between the hero and the projects, after the Prototype
   about section: one statement sits high on the right, a landscape
   photograph sits low on the left, and the image's top right corner
   meets the text block's bottom left corner so the two describe an
   implicit diagonal grid. No rules anywhere; spacing does the work.
   The statement is placeholder lorem until the studio's words are ready. */
export function Intro() {
  const property = properties.find((p) => p.slug === 'queenscliff')
  const image = property?.images.find((i) => i.category === 'view')

  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-y-8 px-5 pt-20 pb-24 sm:grid-cols-12 sm:gap-x-8 sm:px-7 sm:pt-28 sm:pb-32">
        <div className="sm:col-span-7 sm:col-start-6">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,2.7vw,2.6rem)] leading-[1.25] italic">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </Reveal>
        </div>
        {property && image ? (
          <div className="sm:col-span-5">
            <Reveal variant="media">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <AssetImage
                  className="absolute inset-0 size-full"
                  fill
                  image={image}
                  sizes="(min-width: 640px) 38vw, 100vw"
                  slug={property.slug}
                />
              </div>
            </Reveal>
          </div>
        ) : null}
      </div>
    </section>
  )
}
