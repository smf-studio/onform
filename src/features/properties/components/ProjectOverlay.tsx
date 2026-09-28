import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useLayoutEffect, useRef } from 'react'

import type { Property } from 'features/properties/schema'

import { SiteHeader } from 'components/shared/SiteHeader'
import { AssetImage } from 'features/properties/components/AssetImage'
import { properties } from 'features/properties/data'
import { heroImage } from 'features/properties/utils'
import { scrollToTop } from 'lib/scroll'

const MEDIA_COUNT = 8

/* Project page, after the Prototype Studio work detail: the sticky site
   header, a media column on the left with the Back link floating just
   above it, and a sticky right column holding only the title, revealed
   character by character, with the italic location inline after it. On
   arrival the visible frames rise together from the bottom edge of the
   viewport. The page ends with the next project revealed by continuing
   to scroll. */
export function ProjectOverlay({ property }: { property: Property }) {
  const index = properties.findIndex((p) => p.slug === property.slug)
  const next = properties.at((index + 1) % properties.length) ?? property
  const hero = heroImage(property)
  const mediaColRef = useRef<HTMLDivElement>(null)
  const media = [
    hero,
    ...property.images.filter(
      (image) => image.featured && image.file !== hero.file,
    ),
  ].slice(0, MEDIA_COUNT)

  /* Entry, after the Prototype work page: the page always starts at the
     very top, whether reached by a click or by scrolling through the
     previous project's handoff, then every frame that would be on
     screen starts just below the viewport's bottom edge and the group
     rises with a long expo-out settle and a short stagger. Frames below
     the fold arrive unanimated, the same as the reference. */
  useLayoutEffect(() => {
    scrollToTop()
    const col = mediaColRef.current
    if (!col) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = Array.from(col.querySelectorAll<HTMLElement>('[data-media]'))
    const first = nodes.at(0)
    if (!first) return
    const vh = window.innerHeight
    const offset = Math.round(vh - first.getBoundingClientRect().top + 80)
    if (offset <= 0) return
    const risers = nodes.filter((n) => n.getBoundingClientRect().top < vh)
    risers.forEach((node) => {
      node.style.transition = 'none'
      node.style.transform = `translateY(${String(offset)}px)`
    })
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        risers.forEach((node, riseIndex) => {
          node.style.transition = `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${(0.1 + riseIndex * 0.05).toFixed(2)}s`
          node.style.transform = 'translateY(0)'
        })
      })
    })
    return () => {
      cancelAnimationFrame(raf)
      nodes.forEach((node) => {
        node.style.transition = ''
        node.style.transform = ''
      })
    }
  }, [property.slug])

  return (
    <div className="bg-background">
      <div className="relative z-10 bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-7">
          <div className="py-4 lg:hidden">
            <Link
              aria-label="Back to all projects"
              className="font-display text-lg italic underline decoration-terracotta decoration-1 underline-offset-4 transition-colors hover:text-terracotta"
              hash={property.slug}
              to="/"
            >
              Back
            </Link>
          </div>
          <div className="grid gap-x-10 lg:grid-cols-12">
            <div className="lg:order-1 lg:col-span-7 lg:pt-[18svh]">
              <div
                className="relative flex flex-col gap-6 pb-10 lg:gap-8"
                ref={mediaColRef}
              >
                <div
                  className="el-fade absolute bottom-full left-0 mb-8 hidden lg:block"
                  style={{ animationDelay: '0.6s' }}
                >
                  <Link
                    aria-label="Back to all projects"
                    className="font-display text-lg italic underline decoration-terracotta decoration-1 underline-offset-4 transition-colors hover:text-terracotta"
                    hash={property.slug}
                    to="/"
                  >
                    Back
                  </Link>
                </div>
                {media.map((image, imageIndex) => (
                  <div
                    className="will-change-transform"
                    data-media
                    key={image.file}
                  >
                    <AssetImage
                      className="rounded-notch"
                      image={image}
                      priority={imageIndex === 0}
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      slug={property.slug}
                    />
                  </div>
                ))}
              </div>
            </div>
            <aside className="order-first pb-8 lg:sticky lg:top-14 lg:order-2 lg:col-span-4 lg:col-start-9 lg:flex lg:h-[calc(100svh-3.5rem)] lg:flex-col lg:pb-0">
              <div className="lg:pt-[18svh]">
                <CharTitle text={property.displayName} />{' '}
                <TermReveal text={`(${property.location})`} />
              </div>
            </aside>
          </div>
        </div>
      </div>
      <NextProjectHandoff next={next} />
    </div>
  )
}

/* The italic location arrives one character at a time as a quiet fade,
   inline after the title, per the reference. */
function TermReveal({ text }: { text: string }) {
  return (
    <span
      aria-label={text}
      className="inline-block align-top font-display text-lg text-terracotta italic lg:mt-3"
    >
      {text.split('').map((char, charIndex) => (
        <span
          aria-hidden
          className="el-fade inline-block"
          key={`${String(charIndex)}-${char}`}
          style={{
            animationDelay: `${String(500 + charIndex * 40)}ms`,
            animationDuration: '0.4s',
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

/* The title arrives one character at a time, unskewing from a slight
   page-turn, per the reference. Each word is kept whole so the line can
   only break between words, never inside one. The full name stays
   intact for assistive tech via the aria-label. */
function CharTitle({ text }: { text: string }) {
  const words = text.split(' ')
  /* Character offsets per word, so the stagger runs across the whole
     name rather than restarting at each word. */
  const starts = words.map((_, index) =>
    words.slice(0, index).reduce((sum, word) => sum + word.length + 1, 0),
  )
  return (
    <h1
      aria-label={text}
      className="mr-3 inline font-display text-[clamp(2.5rem,4.2vw,4.5rem)] leading-[0.95] tracking-tight"
      style={{ perspective: '600px' }}
    >
      {words.map((word, wordIndex) => (
        <span aria-hidden key={`${String(wordIndex)}-${word}`}>
          {wordIndex > 0 ? ' ' : null}
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, index) => (
              <span
                className="char-in"
                key={`${String(index)}-${char}`}
                style={{
                  animationDelay: `${String(((starts.at(wordIndex) ?? 0) + index) * 30)}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </span>
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
              <span className="text-[11px] font-semibold tracking-[0.2em] text-white/90">
                {`NEXT  ${next.displayName.toUpperCase()}`}
              </span>
              <span className="font-display text-5xl leading-none tracking-tight text-white sm:text-7xl">
                {next.displayName}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
