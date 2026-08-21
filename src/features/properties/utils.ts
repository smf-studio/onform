import type {
  DerivedImage,
  Property,
  PropertyImage,
} from 'features/properties/schema'

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
