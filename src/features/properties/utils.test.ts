import { describe, expect, it } from 'vitest'

import { properties } from 'features/properties/data'
import {
  formatMeta,
  gridImages,
  heroImage,
  largestVariantUrl,
  srcSetFor,
} from 'features/properties/utils'

describe('formatMeta', () => {
  it('uppercases and separates with plain spaces only', () => {
    const meta = formatMeta({ location: 'Sydney NSW', year: '2025' })
    expect(meta).toBe('SYDNEY NSW  COMPLETED 2025')
    expect(meta).toMatch(/^[A-Z0-9 ]+$/)
  })
})

describe('property data', () => {
  it('loads all six properties with derivatives attached', () => {
    expect(properties).toHaveLength(6)
    for (const property of properties) {
      expect(property.images.length).toBeGreaterThanOrEqual(10)
      for (const image of property.images) {
        expect(image.derived.variants.length).toBeGreaterThan(0)
      }
    }
  })

  it('finds a hero frame for every property', () => {
    for (const property of properties) {
      expect(heroImage(property).file).toBeTruthy()
    }
  })

  it('grid images exclude the hero and respect the count', () => {
    for (const property of properties) {
      const hero = heroImage(property)
      const grid = gridImages(property, 3)
      expect(grid.length).toBeLessThanOrEqual(3)
      expect(grid.map((image) => image.file)).not.toContain(hero.file)
      expect(grid.every((image) => image.featured)).toBe(true)
    }
  })
})

describe('srcset helpers', () => {
  it('builds srcsets per format with width descriptors', () => {
    const property = properties.at(0)
    const image = property?.images.at(0)
    if (!property || !image) throw new Error('fixture data missing')
    const avif = srcSetFor(property.slug, image.derived, 'avif')
    expect(avif).toContain('.avif 640w')
    expect(avif).not.toContain('.webp')
    expect(largestVariantUrl(property.slug, image.derived)).toMatch(/\.webp$/)
  })
})
