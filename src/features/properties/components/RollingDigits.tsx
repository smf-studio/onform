import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from 'lib/utils'

/* A number whose digits roll when the value changes: counting up, each
   changed digit rises in from below while the old one leaves upward;
   counting down, the reverse. Tabular figures keep every slot the same
   width so nothing beside the number shifts. Reduced motion swaps the
   digits in place. */
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
    <span className={cn('inline-flex overflow-hidden tabular-nums', className)}>
      <span className="sr-only">{value}</span>
      {value.split('').map((char, slot) => (
        <span
          aria-hidden
          className="inline-grid"
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
                  : {
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1],
                      opacity: { duration: 0.3, ease: 'easeOut' },
                    }
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

const variants = {
  center: { opacity: 1, y: '0%' },
  enter: (direction: number) => ({
    opacity: 0,
    y: direction === 0 ? '0%' : direction > 0 ? '60%' : '-60%',
  }),
  exit: (direction: number) => ({
    opacity: 0,
    y: direction === 0 ? '0%' : direction > 0 ? '-60%' : '60%',
  }),
}
