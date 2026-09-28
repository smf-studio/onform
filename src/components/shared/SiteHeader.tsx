import { Link } from '@tanstack/react-router'

import { Fade } from 'components/shared/Fade'
import { Logo } from 'components/shared/Logo'

/* The one header, on every page: sticky, on the page ground, no rule
   beneath it. The logo lockup sits left, the two anchors right; PROJECTS
   and CONTACT resolve to the home page sections from anywhere.
   A Fade hangs under its bottom edge so whatever scrolls beneath the
   header dissolves into it rather than being cut off. Zero height at
   rest; the `.header-fade` rules in globals.css grow it with the first
   pixels of scroll, the way Ruminate's scroll fade does. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="flex items-center justify-between px-5 py-3 sm:px-7 sm:py-4">
        <Link aria-label="onform" className="block h-8 sm:h-9" to="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 sm:gap-9">
          <Link
            className="text-[11px] tracking-[0.16em] transition-colors hover:text-terracotta"
            hash="projects"
            to="/"
          >
            PROJECTS
          </Link>
          <Link
            className="text-[11px] tracking-[0.16em] transition-colors hover:text-terracotta"
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
