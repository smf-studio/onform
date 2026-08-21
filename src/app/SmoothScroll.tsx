import Lenis from 'lenis'
import { useEffect } from 'react'

import { registerLenis } from 'lib/scroll'

/* Site-wide smooth scrolling. Skipped entirely for reduced-motion users;
   `anchors` keeps the in-page nav links (#projects, #contact) eased. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const lenis = new Lenis({ anchors: true, lerp: 0.1 })
    registerLenis(lenis)
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      registerLenis(null)
      lenis.destroy()
    }
  }, [])
  return null
}
