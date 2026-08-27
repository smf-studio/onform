import type { RefObject } from 'react'

import { useEffect, useRef } from 'react'

/* A short backdrop-blur strip pinned to the underside of the sticky
   header. Invisible at rest so the photograph starts clean; scrolling
   fades it in so the top of the hero softens as it slips beneath the
   header, and it fades back out as the hero's bottom edge arrives. */
const FADE_DISTANCE = 48

export function HeroScrollBlur({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>
}) {
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    let ticking = false
    const update = () => {
      ticking = false
      const hero = heroRef.current
      if (!hero) return
      const stripTop = strip.getBoundingClientRect().top
      const heroBottom = hero.getBoundingClientRect().bottom
      const fadeIn = Math.min(1, window.scrollY / FADE_DISTANCE)
      const fadeOut = Math.min(
        1,
        Math.max(0, (heroBottom - stripTop) / FADE_DISTANCE),
      )
      strip.style.opacity = (fadeIn * fadeOut).toFixed(3)
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
  }, [heroRef])

  return (
    <div
      aria-hidden
      className="hero-scroll-blur pointer-events-none absolute inset-x-0 top-full h-10 opacity-0"
      ref={stripRef}
    />
  )
}
