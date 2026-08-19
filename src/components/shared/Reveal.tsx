import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from 'lib/utils'

/* Once-only entrance: children rise and fade in the first time they cross
   into view. Delay staggers siblings; reduced motion renders instantly
   (handled in globals.css). */
export function Reveal({
  children,
  className,
  delayMs = 0,
  variant = 'rise',
}: {
  children: ReactNode
  className?: string
  delayMs?: number
  /* 'rise' is the quiet default; 'media' is the long expo-out travel
     used for photographs, per the reference site. */
  variant?: 'media' | 'rise'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className={cn(
        variant === 'media' ? 'enter-media' : 'rise',
        shown && 'is-in',
        className,
      )}
      ref={ref}
      style={delayMs ? { transitionDelay: `${String(delayMs)}ms` } : undefined}
    >
      {children}
    </div>
  )
}
