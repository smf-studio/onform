import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import type { Property } from 'features/properties/schema'

import { Reveal } from 'components/shared/Reveal'
import { SiteHeader } from 'components/shared/SiteHeader'
import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'
import { heroImage } from 'features/properties/utils'

const MEDIA_COUNT = 8

/* Project page, after the Prototype Studio work detail: the sticky site
   header, a Back link, then a media column on the left and a sticky
   right column where the title reveals character by character over an
   italic location line and quiet label and value rows. The page ends
   with the next project revealed by continuing to scroll. */
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
        <SiteHeader />
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-7">
          <div className="py-4">
            <Link
              aria-label="Back to all projects"
              className="font-display text-lg italic underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
              hash={property.slug}
              to="/"
            >
              Back
            </Link>
          </div>
          <div className="grid gap-x-10 lg:grid-cols-12">
            <div className="flex flex-col gap-6 pb-10 lg:order-1 lg:col-span-7 lg:gap-8">
              {media.map((image, imageIndex) => (
                <Reveal
                  delayMs={imageIndex === 0 ? 0 : 60}
                  key={image.file}
                  variant="media"
                >
                  <AssetImage
                    className="rounded-notch"
                    image={image}
                    priority={imageIndex === 0}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    slug={property.slug}
                  />
                </Reveal>
              ))}
            </div>
            <aside className="order-first pb-8 lg:sticky lg:top-14 lg:order-2 lg:col-span-4 lg:col-start-9 lg:flex lg:h-[calc(100svh-3.5rem)] lg:flex-col lg:pb-0">
              <div className="lg:pt-6">
                <CharTitle text={property.displayName} />
                <p className="mt-2 font-display text-lg text-body-copy italic">
                  ({property.location})
                </p>
              </div>
              <div className="mt-10 flex flex-col gap-4 lg:mt-24">
                <div className="grid grid-cols-2 gap-6">
                  <span className="font-display text-lg text-body-copy italic">
                    Completed
                  </span>
                  <span className="text-sm">{property.year}</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <span className="font-display text-lg text-body-copy italic">
                    Frames
                  </span>
                  <span className="text-sm">
                    {String(property.images.length)}
                  </span>
                </div>
                <p className="mt-4 max-w-xs text-sm text-body-copy">
                  {property.paragraph}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <NextProjectHandoff next={next} />
    </div>
  )
}

/* The title arrives one character at a time, unskewing from a slight
   page-turn, per the reference. The full name stays intact for
   assistive tech via the aria-label. */
function CharTitle({ text }: { text: string }) {
  return (
    <h1
      aria-label={text}
      className="font-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.95]"
      style={{ perspective: '600px' }}
    >
      {text.split('').map((char, index) => (
        <span
          aria-hidden
          className="char-in"
          key={`${String(index)}-${char}`}
          style={{ animationDelay: `${String(index * 30)}ms` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h1>
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
