import { z } from 'zod'

/* The property manifests in src/data/properties/ are produced by the
   curation pipeline; derived.json by scripts/build-images.mjs. Parsing
   happens once at module load in data.ts so a manifest that drifts from
   this shape fails the build loudly instead of rendering a broken page. */

const manifestImageSchema = z.object({
  file: z.string().min(1),
  category: z.string().min(1),
  featured: z.boolean(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1),
  note: z.string(),
  source: z.string(),
})

export const propertyManifestSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  hero: z.string().min(1),
  images: z.array(manifestImageSchema).min(1),
})

const derivedVariantSchema = z.object({
  ext: z.enum(['avif', 'webp']),
  name: z.string().min(1),
  w: z.number().int().positive(),
})

const derivedImageSchema = z.object({
  blur: z.string().startsWith('data:image/'),
  variants: z.array(derivedVariantSchema).min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})

export const derivedSchema = z.record(
  z.string(),
  z.record(z.string(), derivedImageSchema),
)

/* Display copy lives in code, not the generated manifests, so the
   curation pipeline can rewrite manifests without touching prose. */
export interface PropertyCopy {
  displayName: string
  location: string
  paragraph: string
  year: string
}

type ManifestImage = z.infer<typeof manifestImageSchema>
export type DerivedImage = z.infer<typeof derivedImageSchema>

export interface PropertyImage extends ManifestImage {
  derived: DerivedImage
}

export interface Property extends PropertyCopy {
  images: PropertyImage[]
  slug: string
}
