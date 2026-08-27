import { useRef } from 'react'

import { SiteFooter } from 'components/shared/SiteFooter'
import { SiteHeader } from 'components/shared/SiteHeader'
import { Hero } from 'features/properties/components/Hero'
import { HeroScrollBlur } from 'features/properties/components/HeroScrollBlur'
import { Intro } from 'features/properties/components/Intro'
import { ProjectShowcase } from 'features/properties/components/ProjectShowcase'
import { properties } from 'features/properties/data'

export function HomePage() {
  const featured = properties[0]
  const heroRef = useRef<HTMLElement>(null)
  return (
    <>
      <div className="relative z-10 bg-background" id="top">
        <div className="flex h-svh flex-col">
          <SiteHeader>
            <HeroScrollBlur heroRef={heroRef} />
          </SiteHeader>
          {featured ? <Hero property={featured} ref={heroRef} /> : null}
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
