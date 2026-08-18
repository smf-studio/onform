import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'
import { formatMeta, heroImage } from 'features/properties/utils'
import { cn } from 'lib/utils'

/* The projects showcase, after the Prototype Studio mechanic: one sticky
   full-viewport shell carries the oversized counter and the active
   property's name and facts, while a narrow centre column of cards
   scrolls through in normal flow. A card becomes active when it crosses
   the viewport centre; state changes are instant for the counter and a
   short fade for the text. Card images parallax inside their masks.
   Below lg the shell is hidden and cards carry their own captions. */
export function ProjectShowcase() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-index]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index))
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    cards.forEach((card) => {
      observer.observe(card)
    })
    return () => {
      observer.disconnect()
    }
  }, [])

  /* Scroll-linked parallax: each card's inner image is oversized and
     slides within the mask as the card traverses the viewport. Direct
     style writes from a rAF-throttled scroll handler; no React state. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const list = listRef.current
    if (!list) return
    const masks = Array.from(
      list.querySelectorAll<HTMLElement>('[data-parallax]'),
    )
    let ticking = false
    const update = () => {
      ticking = false
      const vh = window.innerHeight
      for (const mask of masks) {
        const rect = mask.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > vh) continue
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh
        const img = mask.firstElementChild as HTMLElement | null
        if (img) {
          img.style.transform = `translateY(${(progress * -8).toFixed(2)}%) scale(1.18)`
        }
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
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const current = properties.at(active) ?? properties[0]
  if (!current) return null

  return (
    <section className="relative" id="projects">
      <div className="pointer-events-none sticky top-0 hidden h-svh lg:block">
        <div className="mx-auto grid h-full max-w-screen-2xl grid-cols-12 items-end gap-6 px-7 pb-10">
          <div className="col-span-3 self-end" key={`count-${current.slug}`}>
            <div className="font-display text-[clamp(6rem,13vw,11.5rem)] leading-[0.85]">
              {String(active + 1).padStart(2, '0')}
            </div>
            <div className="mt-3 text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
              {`OF ${String(properties.length).padStart(2, '0')} PROJECTS`}
            </div>
          </div>
          <div className="col-span-3 col-start-10 flex flex-col items-end gap-3 text-right">
            <div
              className="swap-in flex flex-col items-end gap-3"
              key={current.slug}
            >
              <h2 className="font-display text-4xl leading-none xl:text-5xl">
                {current.displayName}
              </h2>
              <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
                {formatMeta(current)}
              </p>
              <p className="max-w-2xs text-sm text-body-copy">
                {current.paragraph}
              </p>
              <Link
                className="pointer-events-auto text-[11px] font-medium tracking-[0.16em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
                params={{ slug: current.slug }}
                to="/projects/$slug"
              >
                VIEW PROJECT
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative flex flex-col gap-14 px-5 py-16 sm:px-7 lg:-mt-[100svh] lg:gap-[16vh] lg:py-[30svh]"
        ref={listRef}
      >
        {properties.map((property, index) => (
          <div
            className="flex flex-col gap-3 lg:mx-auto lg:w-[42vw]"
            key={property.slug}
          >
            <Link
              aria-label={`${property.displayName} project`}
              className="group block"
              data-index={index}
              params={{ slug: property.slug }}
              to="/projects/$slug"
            >
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-notch"
                data-parallax
              >
                <AssetImage
                  className="absolute inset-x-0 -inset-y-[12%] h-[124%] w-full will-change-transform"
                  fill
                  image={heroImage(property)}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  slug={property.slug}
                />
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 bg-background transition-opacity duration-700',
                    index === active
                      ? 'opacity-0'
                      : 'opacity-40 group-hover:opacity-0',
                  )}
                />
              </div>
            </Link>
            <div className="flex items-baseline justify-between gap-4 lg:hidden">
              <span className="font-display text-2xl leading-none">
                {property.displayName}
              </span>
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
                {formatMeta(property)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
