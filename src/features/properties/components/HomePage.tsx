import { SiteFooter } from 'components/shared/SiteFooter'
import { SiteHeader } from 'components/shared/SiteHeader'
import { Hero } from 'features/properties/components/Hero'
import { Intro } from 'features/properties/components/Intro'
import { ProjectShowcase } from 'features/properties/components/ProjectShowcase'
import { properties } from 'features/properties/data'

export function HomePage() {
  const featured = properties[0]
  return (
    <>
      <div className="relative z-10 bg-background" id="top">
        <div className="flex h-svh flex-col">
          <SiteHeader />
          {featured ? <Hero property={featured} /> : null}
        </div>
        <Intro />
        <main aria-label="Projects">
          <ProjectShowcase />
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
