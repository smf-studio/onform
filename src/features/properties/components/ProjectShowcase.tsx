import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'
import { formatMeta, heroImage } from 'features/properties/utils'
import { cn } from 'lib/utils'

/* The projects showcase, after the Prototype Studio mechanic: one sticky
   full-viewport shell wraps the scrolling centre column of cards. The
   shell carries the oversized counter, the metadata for the active
   property on the left, and the full list of project names on the right;
   the active name reads at full ink while the rest sit faint, and the
   stack crawls so the active name holds the middle. Cards enter with the
   long expo-out rise and parallax inside their masks while scrolling.
   Below lg the shell is hidden and cards carry their own captions. */
export function ProjectShowcase() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const nameTrackRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-index]'))
    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index))
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    const enterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            enterObserver.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    cards.forEach((card) => {
      activeObserver.observe(card)
      enterObserver.observe(card)
    })
    return () => {
      activeObserver.disconnect()
      enterObserver.disconnect()
    }
  }, [])

  /* Scroll-linked parallax inside each card mask; direct style writes
     from a rAF-throttled scroll handler, no React state. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const list = listRef.current
    if (!list) return
    const masks = Array.from(
      list.querySelectorAll<HTMLElement>('[data-parallax]'),
    )
    const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-index]'))
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
      /* The counter drifts down the shell across the whole section's
         scroll, from its resting spot to just above the bottom edge. */
      const counter = counterRef.current
      const section = list.parentElement
      if (counter && section) {
        const sectionRect = section.getBoundingClientRect()
        const startTop = vh * 0.35
        const total = sectionRect.height - vh * 0.65
        if (total > 0) {
          const progress = Math.min(
            1,
            Math.max(0, (startTop - sectionRect.top) / total),
          )
          const maxY = vh - counter.offsetHeight - 96
          counter.style.transform = `translateY(${(progress * maxY).toFixed(1)}px)`
        }
      }
      /* Name crawl, after the Prototype mechanic: the tight stack rests
         at the bottom of its full-height rail, and each name is driven
         individually across the free height of the rail while its own
         card crosses the viewport band, parking tightly beneath the
         names that have already travelled. */
      const track = nameTrackRef.current
      const rail = track?.parentElement
      if (track && rail) {
        const names = Array.from(track.children) as HTMLElement[]
        const travel = rail.clientHeight - track.clientHeight
        const half = (names.at(0)?.clientHeight ?? 0) / 2
        if (travel > 0 && names.length === cards.length) {
          cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect()
            const startTop = vh / 2 + half
            const endTop =
              index === cards.length - 1
                ? vh * 0.3 - rect.height / 2
                : vh * 0.25 - rect.height
            const progress = Math.min(
              1,
              Math.max(0, (startTop - rect.top) / (startTop - endTop)),
            )
            const name = names.at(index)
            if (name) {
              name.style.transform = `translateY(${(-travel * progress).toFixed(1)}px)`
            }
          })
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
        {/* Counter, top left: big numeral, quiet italic denominator. It
            drifts down the shell as the section scrolls. */}
        <div
          className="absolute top-16 left-7 flex items-baseline gap-4"
          ref={counterRef}
        >
          <span className="font-display text-[clamp(6rem,12vw,10.5rem)] leading-[0.85]">
            {String(active + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-2xl text-muted-foreground italic">
            {`of ${String(properties.length).padStart(2, '0')}`}
          </span>
        </div>
        {/* Annotations flanking the card column at its centre line; each
            entry rolls in from below and departs upward. */}
        <div className="absolute inset-y-0 left-0 flex w-[calc(50%-17vw-2.5rem)] items-center">
          <RollingAnnotation
            active={active}
            align="right"
            items={properties.map((property) => property.location)}
          />
        </div>
        <div
          className="absolute inset-y-0 flex w-[calc(50%-17vw-2.5rem)] items-center"
          style={{ left: 'calc(50% + 17vw + 2.5rem)' }}
        >
          <RollingAnnotation
            active={active}
            align="left"
            items={properties.map((property) => `Completed ${property.year}`)}
          />
        </div>
        {/* Project names hugging the right margin: a tight stack resting
            at the bottom of its rail. Each name rides up the rail while
            its card holds the centre, then parks tightly beneath the
            names that went before it. */}
        <div className="absolute top-[16svh] right-7 bottom-[10svh] flex items-end">
          <div className="flex flex-col items-end gap-1.5" ref={nameTrackRef}>
            {properties.map((property, index) => (
              <Link
                className={cn(
                  'pointer-events-auto font-display text-3xl leading-none transition-opacity duration-700 will-change-transform xl:text-4xl',
                  index === active
                    ? 'opacity-100'
                    : 'opacity-25 hover:opacity-60',
                )}
                key={property.slug}
                params={{ slug: property.slug }}
                to="/projects/$slug"
              >
                {property.displayName}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className="relative flex flex-col gap-10 px-5 py-16 sm:px-7 lg:-mt-[100svh] lg:gap-4 lg:pt-[30svh] lg:pb-[42svh]"
        ref={listRef}
      >
        {properties.map((property, index) => (
          <div
            className="flex flex-col gap-3 lg:mx-auto lg:w-[34vw]"
            key={property.slug}
          >
            <Link
              aria-label={`${property.displayName} project`}
              className="enter-media group block"
              data-index={index}
              params={{ slug: property.slug }}
              to="/projects/$slug"
            >
              <div
                className="relative aspect-video overflow-hidden rounded-notch"
                data-parallax
              >
                <AssetImage
                  className="absolute inset-x-0 -inset-y-[12%] h-[124%] w-full will-change-transform"
                  fill
                  image={heroImage(property)}
                  sizes="(min-width: 1024px) 34vw, 100vw"
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

/* One line of italic annotation per project, stacked in the same slot:
   the active entry sits in place, spent entries have rolled up and out,
   waiting entries hold below. Nothing clips: the travel is short and
   opacity resolves before the move finishes, so lines fade in and out
   whole rather than sliding past an edge. */
function RollingAnnotation({
  active,
  align,
  items,
}: {
  active: number
  align: 'left' | 'right'
  items: string[]
}) {
  return (
    <div className="relative h-[1.8em] w-full font-display text-xl italic">
      {items.map((item, index) => (
        <span
          className={cn(
            'absolute inset-0 flex items-center [transition:transform_700ms_cubic-bezier(0.23,1,0.32,1),opacity_450ms_ease-out] motion-reduce:transition-none',
            align === 'right' ? 'justify-end' : 'justify-start',
            index === active
              ? 'translate-y-0 opacity-100'
              : index < active
                ? '-translate-y-[0.8em] opacity-0'
                : 'translate-y-[0.8em] opacity-0',
          )}
          key={item + String(index)}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
