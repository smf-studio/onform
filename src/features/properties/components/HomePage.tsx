import { SiteFooter } from 'components/shared/SiteFooter'
import { Hero } from 'features/properties/components/Hero'
import { ProjectShowcase } from 'features/properties/components/ProjectShowcase'
import { properties } from 'features/properties/data'

export function HomePage() {
  const featured = properties[0]
  return (
    <>
      <div className="relative z-10 bg-background" id="top">
        <div className="flex h-svh flex-col">
          <header className="flex items-center justify-between px-5 py-2.5 sm:px-7 sm:py-3">
            <a
              className="font-display text-xl leading-none sm:text-2xl"
              href="#top"
            >
              onform
            </a>
            <nav className="flex items-center gap-6 sm:gap-9">
              <a
                className="text-[11px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60"
                href="#projects"
              >
                PROJECTS
              </a>
              <a
                className="text-[11px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60"
                href="#contact"
              >
                CONTACT
              </a>
            </nav>
          </header>
          {featured ? <Hero property={featured} /> : null}
        </div>

        <main aria-label="Projects">
          <ProjectShowcase />
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
