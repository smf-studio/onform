import { Reveal } from 'components/shared/Reveal'
import { CONTACT_EMAIL } from 'config/constants'
import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'

/* The interlude between the hero and the projects, after the Prototype
   about section: the statement sits high on the right, a landscape
   photograph sits low on the left, and the image's top right corner
   meets the text block's bottom left corner so the two describe an
   implicit diagonal grid. No rules anywhere; spacing does the work.
   Body copy is placeholder lorem until the studio's words are ready. */
export function Intro() {
  const property = properties.find((p) => p.slug === 'queenscliff')
  const image = property?.images.find((i) => i.category === 'view')

  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-y-12 px-5 pt-20 pb-24 sm:grid-cols-12 sm:px-7 sm:pt-28 sm:pb-32">
        <div className="sm:col-span-7 sm:col-start-6">
          <Reveal>
            <p className="max-w-[24ch] font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.15] italic">
              onform builds private homes in London, Sydney and Mauritius.
              Everything shown here is completed work, photographed as it lives.
            </p>
          </Reveal>
          <Reveal className="mt-8" delayMs={120}>
            <p className="max-w-md text-sm leading-relaxed text-body-copy">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </Reveal>
          <Reveal className="mt-8" delayMs={200}>
            <a
              className="text-[11px] font-medium tracking-[0.16em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              GET IN TOUCH
            </a>
          </Reveal>
        </div>
        {property && image ? (
          <div className="sm:col-span-5 sm:-mt-8">
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
