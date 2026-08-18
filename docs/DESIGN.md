# Design

Status: DIRECTION LOCKED by the client on 18 August 2026: Gambetta display
serif, black and white palette, MAD-style inset hero with a clean
photograph, gallery as per-project showcase row plus editorial grid.
Boards live in the Claude artifacts "OnForm Composition" and "OnForm
Tokens". Remaining open items are listed at the bottom of this file.
Sections marked "template" are inherited from the frontend template and
still apply.

## Identity

OnForm is a portfolio and showcase of completed properties. The site is
photography-led: one serif voice for display, one sans for everything
functional, facts instead of marketing copy. The reference register is MAD
Architects' site (structure) crossed with The Modern House (warmth).

Hard rules from the client:

- No monospace typefaces anywhere.
- No ornament characters: no midpoints, plus signs, arrows, slashes or other
  non-alphanumeric ASCII used decoratively. Plain punctuation only, where
  grammar needs it. Metadata items are separated by whitespace alone.
- Copy is minimal. Property name, location, year, category tags, and at most
  one short paragraph per project.

## Typography

Pairing, locked: **Gambetta** display over **Instrument Sans** for
everything functional. Gambetta ships from Fontshare under the Indian
Type Foundry Free Font License (free for commercial web use); soft flared
serifs, closest free face to Canora, with a true italic. Self-host
Regular, Italic and Medium as WOFF2 and preload Regular. Boska and
Melodrama were the runners-up; all Google Fonts serif candidates were
rejected as lacking flair.

| Role          | Face                        | Treatment                                                 |
| ------------- | --------------------------- | --------------------------------------------------------- |
| Display       | Gambetta 400                | Property names, hero lines. clamp(3rem, 7vw, 6.5rem),     |
|               |                             | line-height 1.03. Never below 26px.                       |
| Display em    | Gambetta 400 italic         | One or two words per line; also breaks caps lines         |
| Body          | Instrument Sans 400         | 16px, line-height 1.6, max width 62ch                     |
| Labels        | Instrument Sans 500         | 11 to 13px, uppercase, letter-spacing 0.14em to 0.2em     |
| Wordmark      | Gambetta 400                | lowercase "onform" (pending confirmation)                 |

Signature device (from the reference teardown): uppercase sans lines
carrying one or two lowercase italic serif words, and a "ghost marquee",
an enormous italic serif word behind a section at about six percent
opacity.

## Palette

Black and white, single light theme, no accent color anywhere. The
photographs are the only color on the site. Hierarchy comes from a short
grey ramp; interaction states are black with underlines or opacity shifts.

| Token     | Value   | Use                              |
| --------- | ------- | -------------------------------- |
| White     | #FFFFFF | page ground                      |
| Dim white | #F4F4F2 | notch fills, quiet panels        |
| Black     | #111110 | display, wordmark, links, focus  |
| Grey      | #4A4A47 | body copy                        |
| Faint     | #8F8F8A | metadata labels                  |
| Hairline  | #E7E7E4 | rules, borders                   |

Implementation maps these onto the template's semantic tokens in
`src/styles/globals.css` (OKLCH), keeping token names. Radius: 16px on
images and the notch (one shared value, `--nr`), 4px on small elements.

## Layout principles

The site is two sections: the hero and the gallery. Locked treatments:

- Hero: MAD-style inset, never full bleed. Chrome on white above (wordmark
  left, nav right), photograph inset with a white gutter and 16px rounded
  corners. The photograph stays CLEAN, no overlay of any kind; the
  property name and metadata sit below the image on white.
- Gallery: one block per property, combining the two chosen treatments.
  Each block opens with a showcase row (large frame with the property
  name carved into a bottom-left notch, metadata and one short paragraph
  beside it, alternating left and right per block) followed by an
  editorial three column grid of supporting frames at honest ratios with
  small caps captions. Data-driven from the manifests in
  `src/data/properties/`.
- The notch is the signature motif, carried by the gallery showcase rows:
  text space carved out of the image corner in page ground, 16px inverted
  rounded fillets, type always on page ground.
- Project detail: overlay route above the gallery. Text sidebar (name,
  location, year, one paragraph at most) with large scrolling images.
  Featured images first, then the gallery bank. Ends with a link to the
  next project, never a dead end.
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
- Installed primitives: `button`, `card`, `form`, `input`, `label`,
  `textarea`. Primitives stay byte-identical to the registry and exempt
  from lint/format/knip.

## Modification log for `components/ui/`

Every deviation from registry output must be listed here with a reason.

| Date | Component | Change | Reason                                             |
| ---- | --------- | ------ | -------------------------------------------------- |
| —    | —         | none   | All primitives are as generated by the shadcn CLI. |

## Open decisions

1. Wordmark case: lowercase "onform" or "OnForm". Proposed: lowercase.
2. Site shape: single scrolling page (hero straight into the six project
   blocks) versus project overlay routes on top. Proposed for the
   placeholder: single page, overlays later.
3. Hero photograph: static single frame versus a slow crossfade rotation
   through the six properties. Proposed: slow rotation, one name below.
4. Nav contents: with a one-pager, Projects can scroll-anchor to the
   gallery; Studio and Contact need a target (a footer block, or drop
   them). Proposed: Projects anchor plus a Contact footer with email.
5. Hero shader: confirmed in principle by the brief; final go given at
   build time once the real page performs.
6. Per-property display names and the one-line paragraph each block
   carries. Drafts will be proposed for sign-off.
