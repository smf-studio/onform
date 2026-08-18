import type {
  DerivedImage,
  Property,
  PropertyImage,
} from 'features/properties/schema'

/* Metadata lines are uppercase labels separated by two spaces; the site
   never uses ornament characters (see docs/DESIGN.md). */
export function formatMeta(
  property: Pick<Property, 'location' | 'year'>,
): string {
  return `${property.location}  Completed ${property.year}`.toUpperCase()
}

function assetUrl(slug: string, variantName: string): string {
  return `/assets/properties/${slug}/${variantName}`
}

export function srcSetFor(
  slug: string,
  derived: DerivedImage,
  ext: 'avif' | 'webp',
): string {
  return derived.variants
    .filter((variant) => variant.ext === ext)
    .map((variant) => `${assetUrl(slug, variant.name)} ${String(variant.w)}w`)
    .join(', ')
}

export function largestVariantUrl(slug: string, derived: DerivedImage): string {
  const webp = derived.variants.filter((variant) => variant.ext === 'webp')
  const largest = webp.at(-1)
  if (!largest) {
    throw new Error(`no webp variants for an image in ${slug}`)
  }
  const widest = webp.reduce((a, b) => (b.w > a.w ? b : a), largest)
  return assetUrl(slug, widest.name)
}

export function heroImage(property: Property): PropertyImage {
  const hero =
    property.images.find((image) => image.category === 'hero-exterior') ??
    property.images.at(0)
  if (!hero) {
    throw new Error(`property ${property.slug} has no images`)
  }
  return hero
}

/* The showcase row uses the hero frame; the block grid takes the next
   featured frames after it, at most `count`. */
export function gridImages(property: Property, count: number): PropertyImage[] {
  const hero = heroImage(property)
  return property.images
    .filter((image) => image.featured && image.file !== hero.file)
    .slice(0, count)
}
