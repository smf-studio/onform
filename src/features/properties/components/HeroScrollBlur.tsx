import type { RefObject } from 'react'

import { useEffect, useRef } from 'react'

import { Fade } from 'components/shared/Fade'

/* A Fade pinned to the underside of the sticky header, so the hero
   photograph's cut-off boundary reads as a soft dissolve into the white
   chrome rather than a hard line. Invisible at rest so the photograph
   starts clean; scrolling fades it in, and it fades back out as the
   hero's bottom edge arrives. */
const FADE_DISTANCE = 24

export function HeroScrollBlur({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>
}) {
  const fadeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fade = fadeRef.current
    if (!fade) return
    let ticking = false
    const update = () => {
      ticking = false
      const hero = heroRef.current
      if (!hero) return
      const fadeTop = fade.getBoundingClientRect().top
      const heroBottom = hero.getBoundingClientRect().bottom
      const fadeIn = Math.min(1, window.scrollY / FADE_DISTANCE)
      const fadeOut = Math.min(
        1,
        Math.max(0, (heroBottom - fadeTop) / FADE_DISTANCE),
      )
      fade.style.opacity = (fadeIn * fadeOut).toFixed(3)
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
    <Fade
      background="var(--color-background)"
      blur="6px"
      className="inset-x-0 top-full h-10 opacity-0"
      ref={fadeRef}
      side="top"
      stop="25%"
    />
  )
}
