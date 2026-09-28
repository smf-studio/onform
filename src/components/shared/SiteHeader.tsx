import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { Logo } from 'components/shared/Logo'

/* The one header, on every page: sticky, on the page ground, no rule
   beneath it. The logo lockup sits left, the two anchors right; PROJECTS
   and CONTACT resolve to the home page sections from anywhere. Children
   ride along with the sticky header — the home page uses this to pin
   the hero scroll blur to the header's bottom edge. */
export function SiteHeader({ children }: { children?: ReactNode }) {
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
      {children}
    </header>
  )
}
