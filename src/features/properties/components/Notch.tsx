import type { ReactNode } from 'react'

/* Renders inside a .notch-host (see globals.css). The two fillet spans
   paint the concave corners that make the cutout read as one carved
   shape rather than a rectangle laid on top. */
export function Notch({ children }: { children: ReactNode }) {
  return (
    <div className="notch">
      <span aria-hidden className="notch-fillet notch-fillet-top" />
      <span aria-hidden className="notch-fillet notch-fillet-right" />
      {children}
    </div>
  )
}
