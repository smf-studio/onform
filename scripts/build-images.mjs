/*
 * Generates web derivatives from the photography masters.
 *
 * Masters live in assets/masters/<slug>/ and are never served. For every
 * image referenced by a manifest in src/data/properties/, this script
 * writes AVIF and WebP at the widths below (skipping widths larger than
 * the source) into public/assets/properties/<slug>/, plus a tiny inline
 * blur placeholder, and emits src/data/properties/derived.json describing
 * what exists. Idempotent: existing up-to-date outputs are skipped.
 *
 * Run: node scripts/build-images.mjs   (wired into pnpm build)
 */
import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const MASTERS = path.join(ROOT, 'assets/masters')
const OUT = path.join(ROOT, 'public/assets/properties')
const DATA = path.join(ROOT, 'src/data/properties')

const WIDTHS = [640, 1280, 2560]
const AVIF = { quality: 62 }
const WEBP = { quality: 78 }

const manifests = readdirSync(DATA).filter(
  (f) => f.endsWith('.json') && !['index.json', 'derived.json'].includes(f),
)

const derived = {}
const queue = []
let made = 0
let skipped = 0

for (const file of manifests) {
  const manifest = JSON.parse(readFileSync(path.join(DATA, file), 'utf8'))
  const slug = manifest.slug
  const outDir = path.join(OUT, slug)
  mkdirSync(outDir, { recursive: true })
  derived[slug] = {}

  for (const image of manifest.images) {
    const src = path.join(MASTERS, slug, image.file)
    if (!existsSync(src)) {
      throw new Error(`master missing: ${src}`)
    }
    const base = image.file.replace(/\.jpg$/, '')
    const meta = await sharp(src).metadata()
    /* Rungs strictly below the native width, then the native width itself
       (capped at the largest rung) so small masters keep full quality. */
    const widths = WIDTHS.filter((w) => w < meta.width)
    widths.push(Math.min(meta.width, WIDTHS[WIDTHS.length - 1]))

    const variants = []
    for (const w of widths) {
      for (const [ext, opts] of [
        ['avif', AVIF],
        ['webp', WEBP],
      ]) {
        const name = `${base}-${String(w)}.${ext}`
        const dest = path.join(outDir, name)
        if (!existsSync(dest)) {
          queue.push(
            sharp(src)
              .resize(w)
              .toFormat(ext, opts)
              .toFile(dest)
              .then(() => {
                made += 1
              }),
          )
        } else {
          skipped += 1
        }
        variants.push({ ext, name, w })
      }
    }

    queue.push(
      sharp(src)
        .resize(24)
        .webp({ quality: 40 })
        .toBuffer()
        .then((blurBuf) => {
          derived[slug][image.file] = {
            blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
            variants,
            width: meta.width,
            height: meta.height,
          }
        }),
    )
    if (queue.length >= 12) {
      await Promise.all(queue.splice(0))
    }
  }
}
await Promise.all(queue.splice(0))

const json = JSON.stringify(derived)
writeFileSync(path.join(DATA, 'derived.json'), json)
const digest = createHash('sha256').update(json).digest('hex').slice(0, 12)
console.log(
  `derivatives: ${String(made)} generated, ${String(skipped)} up to date, derived.json ${digest}`,
)
