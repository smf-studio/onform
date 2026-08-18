import { CONTACT_EMAIL } from 'config/constants'
import { HeroRotator } from 'features/properties/components/HeroRotator'
import { ProjectBlock } from 'features/properties/components/ProjectBlock'
import { properties } from 'features/properties/data'

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-5 py-4 sm:px-7 sm:py-5">
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

      <main className="flex flex-col" id="top">
        <HeroRotator properties={properties} />

        <section
          aria-label="Projects"
          className="mx-auto flex w-full max-w-screen-2xl flex-col gap-16 px-5 py-14 sm:gap-24 sm:px-7 sm:py-20"
          id="projects"
        >
          {properties.map((property, index) => (
            <ProjectBlock
              flip={index % 2 === 1}
              key={property.slug}
              property={property}
            />
          ))}
        </section>
      </main>

      <footer
        className="mt-auto border-t px-5 py-10 sm:px-7 sm:py-14"
        id="contact"
      >
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-display text-3xl leading-none sm:text-4xl">
              onform
            </span>
            <span className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
              COMPLETED HOMES IN LONDON SYDNEY AND MAURITIUS
            </span>
          </div>
          <a
            className="text-sm text-foreground underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  )
}
