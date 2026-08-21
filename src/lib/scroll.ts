import type Lenis from 'lenis'

/* The live Lenis instance, registered by SmoothScroll so route-level
   code can command the scroller directly; null when smooth scrolling is
   off (reduced motion) and plain window scrolling is in charge. */
let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

/* Jump to the very top with no easing and no residual velocity, so a
   fresh page starts exactly where a hard navigation would. */
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { force: true, immediate: true })
  }
  window.scrollTo(0, 0)
}
