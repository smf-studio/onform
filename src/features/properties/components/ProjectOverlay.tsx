import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import type { Property } from 'features/properties/schema'

import { Reveal } from 'components/shared/Reveal'
import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'
import { heroImage } from 'features/properties/utils'

const MEDIA_COUNT = 8

/* Project detail, after the Prototype Studio work page: a single column
   of large frames on the left, a sticky sidebar with the title and the
   facts on the right, and at the end the next project revealed by
   continuing to scroll. */
export function ProjectOverlay({ property }: { property: Property }) {
  const index = properties.findIndex((p) => p.slug === property.slug)
  const next = properties.at((index + 1) % properties.length) ?? property
  const hero = heroImage(property)
  const media = [
    hero,
    ...property.images.filter(
      (image) => image.featured && image.file !== hero.file,
    ),
  ].slice(0, MEDIA_COUNT)

  return (
    <div className="bg-background">
      <div className="relative z-10 bg-background">
        <div className="mx-auto grid max-w-screen-2xl gap-x-10 px-5 sm:px-7 lg:grid-cols-12">
          <aside className="pt-5 lg:sticky lg:top-0 lg:order-2 lg:col-span-4 lg:col-start-9 lg:flex lg:h-svh lg:flex-col lg:pt-6">
            <Link
              aria-label="Back to all projects"
              className="w-fit text-[11px] font-medium tracking-[0.16em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
              hash={property.slug}
              to="/"
            >
              CLOSE
            </Link>
            <Reveal className="mt-6 lg:mt-10" delayMs={80}>
              <h1 className="font-display text-5xl leading-[0.95] lg:text-6xl">
                {property.displayName}
              </h1>
              <p className="mt-3 font-display text-xl text-body-copy italic">
                {property.location}
              </p>
            </Reveal>
            <Reveal className="mt-8 flex flex-col gap-3" delayMs={180}>
              <div className="flex justify-between gap-6 border-t pt-3">
                <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                  COMPLETED
                </span>
                <span className="text-sm">{property.year}</span>
              </div>
              <div className="flex justify-between gap-6 border-t pt-3">
                <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                  FRAMES
                </span>
                <span className="text-sm">
                  {String(property.images.length)}
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-body-copy">
                {property.paragraph}
              </p>
            </Reveal>
          </aside>

          <div className="flex flex-col gap-6 py-6 lg:order-1 lg:col-span-8 lg:gap-8">
            {media.map((image, imageIndex) => (
              <Reveal delayMs={(imageIndex % 2) * 60} key={image.file}>
                <AssetImage
                  className="rounded-notch"
                  image={image}
                  priority={imageIndex === 0}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  slug={property.slug}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <NextProjectHandoff next={next} />
    </div>
  )
}

/* Keep scrolling past the last frame and the next project rises into
   view; when it fills the viewport the router moves on. Touch and
   reduced-motion users get the same panel as a plain link. */
function NextProjectHandoff({ next }: { next: Property }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const firedRef = useRef(false)
  const armedRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    firedRef.current = false
    /* Only arm the auto-advance once the visitor has genuinely been above
       the threshold on THIS page; a fresh navigation can mount with the
       previous page's scroll position still applied, which would
       otherwise chain straight through every project. */
    armedRef.current = false
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    let ticking = false
    const update = () => {
      ticking = false
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height - vh
      if (total <= 0) return
      const progress = Math.min(1, Math.max(0, -rect.top / total))
      if (!reduced) {
        stage.style.transform = `scale(${(0.92 + progress * 0.08).toFixed(4)})`
        stage.style.opacity = (0.55 + progress * 0.45).toFixed(3)
      }
      if (progress < 0.9) armedRef.current = true
      if (
        progress >= 0.985 &&
        armedRef.current &&
        fine &&
        !reduced &&
        !firedRef.current
      ) {
        firedRef.current = true
        void navigate({ params: { slug: next.slug }, to: '/projects/$slug' })
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [navigate, next.slug])

  return (
    <div className="relative h-[170svh]" ref={sectionRef}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          className="h-full origin-center will-change-transform"
          ref={stageRef}
        >
          <Link
            className="group relative block h-full"
            params={{ slug: next.slug }}
            to="/projects/$slug"
          >
            <div className="absolute inset-3 overflow-hidden rounded-notch sm:inset-4">
              <AssetImage
                className="size-full"
                fill
                image={heroImage(next)}
                sizes="100vw"
                slug={next.slug}
              />
              <div className="absolute inset-0 bg-foreground/25 transition-opacity duration-700 group-hover:bg-foreground/10" />
            </div>
            <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 text-center">
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/90">
                {`NEXT  ${next.displayName.toUpperCase()}`}
              </span>
              <span className="font-display text-5xl leading-none text-white sm:text-7xl">
                {next.displayName}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
