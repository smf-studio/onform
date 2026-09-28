# Design

Status: REBRANDED against the client's brand pack (OnForm LOGO ART,
received September 2026): Montserrat throughout, the terracotta brand
mark and lockup, a warm off-white ground with dark brown ink. The layout
decisions locked on 18 August 2026 (inset hero, showcase rows, single
page plus project overlays) still stand; only identity, typography and
palette changed. Boards live in the Claude artifacts "OnForm Composition"
and "OnForm Tokens". Remaining open items are listed at the bottom of
this file. Sections marked "template" are inherited from the frontend
template and still apply.

## Identity

OnForm is a portfolio and showcase of completed properties. The site is
photography-led: one typeface, facts instead of marketing copy, and the
brand's terracotta as the only colour the UI carries. The reference
register is MAD Architects' site (structure) crossed with The Modern
House (warmth); the client's own references are Sophie Paterson
Interiors, Cote Interiors and Bone Made (see "Reference themes").

Hard rules from the client:

- No monospace typefaces anywhere.
- No ornament characters: no midpoints, plus signs, arrows, slashes or other
  non-alphanumeric ASCII used decoratively. Plain punctuation only, where
  grammar needs it. Metadata items are separated by whitespace alone.
- Copy is minimal. Property name, location, year, category tags, and at most
  one short paragraph per project.

## Logo

The designer's artwork lives outside the repo (OnForm LOGO ART zip:
Positive, Negative and Brand Mark in .ai, .eps, .pdf, .png, .jpg). The
vector PDFs were traced to SVG paths and inlined in
`src/components/shared/Logo.tsx`:

- `Logo` (lockup): the mark plus the "on form INTERIORS" wordmark. The
  wordmark takes `currentColor`, so the same component renders the
  positive form on the page and the negative form on the footer curtain.
  The mark is always terracotta.
- `Logo variant="mark"`: the circular brand mark alone.
- `public/favicon.svg` is the mark with a small margin;
  `public/apple-touch-icon.png` is the mark on the page ground at 180px
  (iOS ignores transparency). The OG image stays a photograph.

Header: lockup at 32px tall (36px from sm), left. Footer: lockup at
clamp(3.5rem, 9vw, 7rem) tall, in the negative form. Never render the
name as text in place of the logo; never recolour the mark.

## Typography

One family, per the brand pack: **Montserrat**, self-hosted from the
Fontsource build (OFL) as WOFF2 in `public/fonts/`. Weights are the two
the pack names, Regular (400, with its italic) and Semi-Bold (600).
Regular is preloaded. `--font-display` and `--font-sans` both point at
Montserrat; the display token is kept so large type could be re-pointed
without touching components.

| Role       | Face                  | Treatment                                           |
| ---------- | --------------------- | --------------------------------------------------- |
| Display    | Montserrat 400        | Property names, counter. clamp sizes per component, |
|            |                       | `tracking-tight`, line-height 0.85 to 0.95.         |
| Display em | Montserrat 400 italic | Intro statement, locations, "of 06", annotations    |
| Body       | Montserrat 400        | 16px, line-height 1.6, max width 62ch               |
| Labels     | Montserrat 400        | 11px, uppercase, letter-spacing 0.16em to 0.2em     |
| Emphasis   | Montserrat 600        | The footer strapline and the "NEXT" label only      |

Montserrat is wide: project titles keep each word whole (`CharTitle`
wraps words in nowrap spans) and sit at clamp(2.5rem, 4.2vw, 4.5rem).

Signature device, carried over: uppercase lines carrying one or two
lowercase italic words.

## Palette

The brand pack gives five CMYK colours and no screen values. Terracotta
is taken from the RGB rendering in the vector artwork; the others are
approximations to confirm with the designer.

| Token       | Value   | Pack colour        | Use                                      |
| ----------- | ------- | ------------------ | ---------------------------------------- |
| Ground      | #F9F7F3 | (derived, warm)    | page ground, header, cards               |
| Quiet panel | #F1ECE5 | (derived from Tan) | notch fills, muted surfaces              |
| Dark brown  | #3A322F | Dark Brown         | ink: display, labels, footer curtain     |
| Body copy   | #5C524D | (derived)          | paragraphs                               |
| Faint       | #9A8D85 | (derived)          | inactive names, metadata                 |
| Hairline    | #E6DFD7 | (derived)          | rules, borders                           |
| Terracotta  | #B16F67 | Terracotta         | mark, annotations, italic metadata,      |
|             |         |                    | hover states, focus ring, Back underline |
| Tan         | #D8B79F | Tan                | footer link underline and hover          |
| Autumn      | #AD7A51 | Autumn             | reserved, unused so far                  |

Terracotta is an accent, not a fill: never as a background behind text
and never on more than one element in a group. The photographs remain
the colour of the site.

Implementation maps these onto the template's semantic tokens in
`src/styles/globals.css` (OKLCH), keeping token names, with the brand
colours as `--dark-brown`, `--terracotta`, `--tan`, `--autumn` and
`terracotta` and `tan` exposed as Tailwind colours. Radius: 16px on
images and the notch (one shared value, `--nr`), 4px on small elements.

## Reference themes

What the client's three references share, and what the site takes from
each:

- All three pair large light headings with a small sans, on a warm
  off-white ground, with a dark warm brown for text instead of black.
  Taken: the warm ground and brown ink; Montserrat replaces the serif
  because the pack names it.
- Sophie Paterson: project cards as a row of three portrait frames,
  the name in caps beneath with the city in small tracked caps; a
  "featured in" press strip; a stone panel behind the about block.
  Taken: caption pattern (name, then tracked location).
- Cote Interiors: the tagline as the only copy above the fold, an
  italic second line; the brand mark alone as a footer motif above a
  three column footer. Taken: mark-first footer, italic emphasis.
- Bone Made: one statement in large type with two italic words, a
  studio paragraph in a narrow column beside a portrait, a horizontal
  scroll of project frames, and the founders' story near the end.
  Taken: italic emphasis inside a statement; the studio story is
  pending the client's copy and a portrait.

## Layout principles

The site is two sections: the hero and the gallery. Locked treatments:

- Hero: MAD-style inset, never full bleed. Chrome on white above (wordmark
  left, nav right), photograph inset with a white gutter and 16px rounded
  corners. The photograph stays CLEAN, no overlay of any kind; the
  property name and metadata sit below the image on white. One scroll-time
  exception to "clean": a gradient-plus-blur `Fade` (pinned under the
  sticky header by `HeroScrollBlur`), invisible at rest, that fades in
  with scroll so the photograph's cut-off boundary dissolves into the
  white chrome rather than ending in a hard line, and fades out once the
  hero has passed.
- Gallery: one block per property, combining the two chosen treatments.
  Each block opens with a showcase row (large frame with the property
  name carved into a bottom-left notch, metadata and one short paragraph
  beside it, alternating left and right per block) followed by an
  editorial three column grid of supporting frames at honest ratios with
  small caps captions. Data-driven from the manifests in
  `src/data/properties/`.
- The notch motif is PARKED: the Prototype Studio style showcase and
  detail layouts that replaced the gallery rows carry no text on images,
  so the cutout currently has no home. Its geometry survives as the
  shared 16px radius; the component lives in git history if a future
  surface wants it back.
- Site shape, locked: a single scrolling page (hero then the six project
  blocks), plus an overlay route per project (`/projects/$slug`) above the
  page for seeing one property in its entirety: text sidebar (name,
  location, year, the paragraph) with all bank images scrolling, featured
  first, ending in a link to the next project.
- Hero rotation, locked: the hero slowly crossfades through one featured
  frame per property (about 6 seconds each, 900ms fade); the name and
  metadata below the image update with it. Paused for reduced motion.
- Motion elsewhere is fades and drift only: slow crossfades, hover scale
  1.02 inside a cropped frame at about 700ms, images arriving through a
  blurred placeholder.

## Hero shader

One considered WebGL moment on the hero photograph only; the grid stays
still. Cursor-reactive displacement in the flowmap style:

- Library: ogl (about 30KB), dynamically imported only after the hero
  image has painted, and only when WebGL2 is available, the pointer is
  fine, and prefers-reduced-motion is off. Touch and reduced-motion users
  never download the module.
- The plain `img` element stays in the DOM as the LCP element; the canvas
  fades in above it after the first GL frame.
- Tuning: displacement capped near 15px at 1440 viewport, healing over
  roughly 800ms with exponential ease. No chromatic aberration. Texture
  capped at 2560px wide. Device pixel ratio clamped to 2. The render loop
  sleeps when flow energy is near zero.
- Fallback chain: plain img, then CSS reveal, then shader. Every failure
  collapses one layer up with zero layout shift.

## Imagery

- Masters live in the repo but are never served directly (4 to 15MB each).
  A build step generates AVIF/WebP derivatives (640, 1280, 2560 widths)
  plus a tiny blur placeholder; pages consume only derivatives via srcset.
- Per-property manifests in `src/data/properties/<slug>.json` carry display
  order, featured flags (showcase set), dimensions, alt text and source
  provenance. Curation changes are JSON edits, not file moves.

## Theme tokens (template)

Token structure is unchanged from the template: `:root` defines the
semantic palette in OKLCH in `src/styles/globals.css`, `@theme inline` maps
it into Tailwind. Retheme by changing values only, never renaming tokens.
The `.dark` block and `ThemeToggle` are removed for this project (single
light theme, see Palette).

## shadcn/ui usage (template)

- Style `new-york`, base color `neutral`, CSS variables on, lucide icons.
- Installed primitives: `button` only (used by the router fallbacks).
  The template's `card`, `form`, `input`, `label` and `textarea` were
  removed with the example contacts feature; reinstall via the shadcn
  CLI when a feature needs them. Primitives stay byte-identical to the
  registry and exempt from lint/format/knip.

## Modification log for `components/ui/`

Every deviation from registry output must be listed here with a reason.

| Date | Component | Change | Reason                                             |
| ---- | --------- | ------ | -------------------------------------------------- |
| —    | —         | none   | All primitives are as generated by the shadcn CLI. |

## Open decisions

All layout and identity decisions are locked (18 August 2026): lowercase
wordmark, single page plus per-project overlay routes, hero rotation,
Projects anchor nav with a Contact footer. Still pending:

1. Contact email address for the footer.
2. Hero shader final go once the real page performs.
3. Sign-off on the six drafted property paragraphs.
4. Screen (hex) values for Dark Brown, Tan and Autumn from the designer;
   the tokens carry approximations until then.
5. The intro statement and a studio paragraph, plus a portrait, if the
   site is to carry a Bone Made style founders' block.
6. Image curation: some frames should be moments rather than rooms, with
   a line of commentary each (client to select).
