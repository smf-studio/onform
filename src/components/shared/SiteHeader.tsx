import { Link } from '@tanstack/react-router'

/* The one header, on every page: sticky, white, a hairline underneath.
   PROJECTS and CONTACT resolve to the home page sections from anywhere. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
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
    </header>
  )
}
