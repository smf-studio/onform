import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from 'lib/utils'

/* A number whose digits roll like an odometer drum when the value
   changes: counting up, the old digit slides out through the top while
   the new one slides in from below, as one strip with no overlap;
   counting down, the reverse. Each slot is a fixed 1ch wide (the width
   of a zero, the widest figure) with the glyph centred, so the number
   keeps its width in the face's own proportional figures and nothing
   beside it shifts. Reduced motion swaps the digits in place. */
export function RollingDigits({
  className,
  value,
}: {
  className?: string
  value: string
}) {
  const reduced = useReducedMotion()
  const [last, setLast] = useState({ direction: 1, value })
  if (last.value !== value) {
    setLast({
      direction: Number(value) >= Number(last.value) ? 1 : -1,
      value,
    })
  }
  const direction = reduced ? 0 : last.direction

  return (
    <span className={cn('inline-flex overflow-hidden', className)}>
      <span className="sr-only">{value}</span>
      {value.split('').map((char, slot) => (
        <span
          aria-hidden
          className="inline-grid w-[1ch] justify-items-center"
          /* Slots are positional: the same slot keeps its element across
             values so only its glyph animates. */
          key={slot}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.span
              animate="center"
              className="block [grid-area:1/1]"
              custom={direction}
              exit="exit"
              initial="enter"
              key={char}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.55, ease: [0.23, 1, 0.32, 1] }
              }
              variants={variants}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

/* A full slot height of travel each way: the leaving digit is entirely
   out of the clipped box before the arriving one is entirely in, so the
   two never overlap. */
const variants = {
  center: { y: '0%' },
  enter: (direction: number) => ({
    y: direction === 0 ? '0%' : direction > 0 ? '100%' : '-100%',
  }),
  exit: (direction: number) => ({
    y: direction === 0 ? '0%' : direction > 0 ? '-100%' : '100%',
  }),
}
