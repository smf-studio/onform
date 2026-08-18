import freshwater from 'data/properties/26-carlton-st-freshwater.json'
import manly from 'data/properties/7-carlton-st-manly.json'
import derivedJson from 'data/properties/derived.json'
import queenscliff from 'data/properties/queenscliff.json'
import radnorMews from 'data/properties/radnor-mews.json'
import theGlebe from 'data/properties/the-glebe.json'
import valricheVilla from 'data/properties/valriche-villa.json'

import {
  derivedSchema,
  type Property,
  type PropertyCopy,
  propertyManifestSchema,
} from 'features/properties/schema'

/* Display copy is authored here, keyed by slug; the manifests stay
   machine-generated. Order of this record is the display order. */
const copy: Record<string, PropertyCopy> = {
  queenscliff: {
    displayName: 'Queenscliff',
    location: 'Sydney NSW',
    year: '2025',
    paragraph:
      'A clifftop home above Freshwater Beach, with a rooftop pool that meets the horizon.',
  },
  'radnor-mews': {
    displayName: 'Radnor Mews',
    location: 'London W2',
    year: '2022',
    paragraph: 'A wisteria-clad mews house on a cobbled lane behind Hyde Park.',
  },
  '7-carlton-st-manly': {
    displayName: 'Carlton Street',
    location: 'Manly NSW',
    year: '2021',
    paragraph:
      'A terrace home near the beach at Manly, opened up to its rear courtyard.',
  },
  'the-glebe': {
    displayName: 'The Glebe',
    location: 'London SE3',
    year: '2021',
    paragraph:
      'A family house in southeast London whose garden runs to a hundred and ten feet.',
  },
  'valriche-villa': {
    displayName: 'Villa Valriche',
    location: 'Bel Ombre Mauritius',
    year: '2026',
    paragraph: 'A villa on the Bel Ombre estate, pool first, ocean beyond.',
  },
  '26-carlton-st-freshwater': {
    displayName: 'Freshwater',
    location: 'Freshwater NSW',
    year: '2024',
    paragraph: 'A family home a few streets back from Freshwater Beach.',
  },
}

const derived = derivedSchema.parse(derivedJson)

const manifests = [
  queenscliff,
  radnorMews,
  manly,
  theGlebe,
  valricheVilla,
  freshwater,
].map((raw) => propertyManifestSchema.parse(raw))

function buildProperty(slug: string): Property {
  const manifest = manifests.find((m) => m.slug === slug)
  const propertyCopy = copy[slug]
  const derivedImages = derived[slug]
  if (!manifest || !propertyCopy || !derivedImages) {
    throw new Error(`property data incomplete for ${slug}`)
  }
  return {
    slug,
    ...propertyCopy,
    images: manifest.images.map((image) => {
      const derivedImage = derivedImages[image.file]
      if (!derivedImage) {
        throw new Error(`no derivatives for ${slug}/${image.file}`)
      }
      return { ...image, derived: derivedImage }
    }),
  }
}

export const properties: Property[] = Object.keys(copy).map(buildProperty)

export function getProperty(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug)
}
