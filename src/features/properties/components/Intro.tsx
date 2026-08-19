import { Reveal } from 'components/shared/Reveal'
import { CONTACT_EMAIL } from 'config/constants'
import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'

/* The interlude between the hero and the projects, after the Prototype
   about section: a vertical hairline splits the section, the statement
   sits high on the right in the italic display voice, one photograph
   sits low on the left. */
export function Intro() {
  const property = properties.find((p) => p.slug === 'queenscliff')
  const image = property?.images.find((i) => i.category === 'bathroom')

  return (
    <section className="border-y">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 sm:grid-cols-12">
        <div className="order-2 flex items-end px-5 pt-6 pb-10 sm:order-1 sm:col-span-5 sm:px-7 sm:pt-40 sm:pb-14">
          {property && image ? (
            <Reveal className="w-full max-w-md">
              <AssetImage
                className="rounded-lg"
                image={image}
                sizes="(min-width: 640px) 34vw, 100vw"
                slug={property.slug}
              />
            </Reveal>
          ) : null}
        </div>
        <div className="order-1 border-b px-5 pt-14 pb-10 sm:order-2 sm:col-span-7 sm:border-b-0 sm:border-l sm:px-10 sm:pt-24 sm:pb-24">
          <Reveal>
            <p className="max-w-[24ch] font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.15] italic">
              onform builds private homes in London, Sydney and Mauritius.
              Everything shown here is completed work, photographed as it lives.
            </p>
          </Reveal>
          <Reveal className="mt-10" delayMs={140}>
            <a
              className="text-[11px] font-medium tracking-[0.16em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              GET IN TOUCH
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
