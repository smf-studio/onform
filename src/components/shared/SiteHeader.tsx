import { Link } from '@tanstack/react-router'

import { Fade } from 'components/shared/Fade'

/* The one header, on every page: sticky, white, no rule beneath it.
   PROJECTS and CONTACT resolve to the home page sections from anywhere.
   A Fade hangs under its bottom edge so whatever scrolls beneath the
   header dissolves into it rather than being cut off. Zero height at
   rest; the `.header-fade` rules in globals.css grow it with the first
   pixels of scroll, the way Ruminate's scroll fade does. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="flex items-center justify-between px-5 py-2.5 sm:px-7 sm:py-3">
        <Link className="font-display text-xl leading-none sm:text-2xl" to="/">
          onform
        </Link>
        <nav className="flex items-center gap-6 sm:gap-9">
          <Link
            className="text-[11px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60"
            hash="projects"
            to="/"
          >
            PROJECTS
          </Link>
          <Link
            className="text-[11px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60"
            hash="contact"
            to="/"
          >
            CONTACT
          </Link>
        </nav>
      </div>
      <Fade
        background="var(--color-background)"
        blur="6px"
        className="header-fade inset-x-0 top-full"
        side="top"
        stop="25%"
      />
    </header>
  )
}
