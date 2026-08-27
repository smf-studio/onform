import type { CSSProperties, Ref } from 'react'

import { cn } from 'lib/utils'

/* A gradient fade with a progressive backdrop blur: the covered content
   dissolves into `background` toward the chosen side instead of hitting
   a hard edge. `stop` is how far the solid colour reaches before the
   dissolve begins; `blur` is the strength at the solid edge. Styled by
   the `.fade` rules in globals.css. */
export function Fade({
  background,
  blur,
  className,
  ref,
  side = 'top',
  stop,
  style,
}: {
  background: string
  blur?: string
  className?: string
  ref?: Ref<HTMLDivElement>
  side?: 'bottom' | 'left' | 'right' | 'top'
  stop?: string
  style?: CSSProperties
}) {
  return (
    <div
      aria-hidden
      className={cn('fade', className)}
      data-fade
      data-side={side}
      ref={ref}
      style={
        {
          '--background': background,
          '--blur': blur,
          '--stop': stop,
          ...style,
        } as CSSProperties
      }
    />
  )
}
