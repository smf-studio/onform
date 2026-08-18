import { useEffect, useRef, useState } from 'react'

import { CONTACT_EMAIL } from 'config/constants'
import { cn } from 'lib/utils'

/* The dark curtain: the footer sits sticky beneath the page, so the last
   scroll peels the white content away to reveal it. Its content rises in
   a staggered reveal the first time it becomes visible. */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <footer
      className="sticky bottom-0 z-0 bg-foreground text-background"
      id="contact"
      ref={ref}
    >
      <div
        className={cn(
          'footer-reveal mx-auto flex max-w-screen-2xl flex-col gap-10 px-5 pt-14 pb-8 sm:px-7 sm:pt-20 sm:pb-10',
          revealed && 'is-revealed',
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-8">
          <span className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.9]">
            onform
          </span>
          <a
            className="pb-2 text-sm underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-background/20 pt-6">
          <span className="text-[11px] font-medium tracking-[0.2em] opacity-70">
            COMPLETED HOMES IN LONDON SYDNEY AND MAURITIUS
          </span>
          <span className="text-[11px] font-medium tracking-[0.2em] opacity-70">
            SMF STUDIO 2026
          </span>
        </div>
      </div>
    </footer>
  )
}
