# Design

Status: DRAFT direction for the OnForm placeholder portfolio, pending sign-off
on the recommended direction ("The Contemporary Studio") from the design
exploration. The moodboard with all three candidate directions lives in the
project's Claude artifact "OnForm Directions". Sections marked "template" are
inherited from the frontend template and still apply.

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

Pairing (direction one, recommended): **Instrument Serif** display over
**Instrument Sans** for everything else. Self-hosted WOFF2 (four files:
serif regular + italic, sans regular + medium), preload the serif.

| Role          | Face                        | Treatment                                                 |
| ------------- | --------------------------- | --------------------------------------------------------- |
| Display       | Instrument Serif 400        | Property names, hero lines. clamp(3rem, 7vw, 6.5rem),     |
|               |                             | line-height 1.02. Never below 24px.                       |
| Display em    | Instrument Serif 400 italic | One word per line at most, used sparingly                 |
| Body          | Instrument Sans 400         | 16px, line-height 1.6, max width 62ch                     |
| Labels        | Instrument Sans 500         | 11 to 13px, uppercase, letter-spacing 0.14em to 0.2em     |
| Wordmark      | Instrument Serif 400        | lowercase "onform" (pending confirmation)                 |

Alternates held in reserve (see moodboard): Fraunces + Hanken Grotesk
("The Quiet Editorial"), Cormorant Garamond + Hanken Grotesk on dark
("The Grand Estate").

## Palette

Single light theme. The placeholder does not ship a dark mode or a theme
toggle; every reference site in the research commits to one ground. Color
belongs to the photography; the UI stays neutral with one accent used only
for links and active states.

| Token          | Value   | Use                              |
| -------------- | ------- | -------------------------------- |
| Limestone      | #F7F6F3 | page ground                      |
| Raised         | #FFFFFF | cards, overlay panel             |
| Shadow ink     | #1A1916 | headings, wordmark               |
| Warm grey      | #56534B | body copy                        |
| Faint          | #8B867B | metadata labels                  |
| Hairline       | #E2DFD8 | rules, borders                   |
| Coastal slate  | #37464A | links, active filter, focus ring |

Implementation maps these onto the template's semantic tokens in
`src/styles/globals.css` (OKLCH), keeping token names. `--radius` drops to
0.25rem: large rounded corners read consumer-app, not editorial.

## Layout principles

- Navigation is a whisper: wordmark left, three items right (Projects,
  Studio, Contact), floating over the hero with no bar behind it.
- One photograph owns the first viewport, full bleed, with the property name
  in display serif bottom-left and a metadata line beneath it.
- Project grid: 2 to 3 columns, generous gutters, images at their shot
  aspect ratios. Category filters as quiet text buttons, data-driven from
  the manifests in `src/data/properties/`.
- Project detail: overlay route above the grid. Text sidebar (name,
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
