# OnForm site plan

Status: DRAFT, pending direction sign-off (see docs/DESIGN.md). Phases are
ordered so the site is deployable placeholder-first at every step.

## Phase 1, foundation

- Self-host Instrument Serif (regular + italic) and Instrument Sans
  (400 + 500) as WOFF2; preload the display serif.
- Retheme `src/styles/globals.css` to the OnForm palette and radius; single
  light theme; remove the `.dark` block, `ThemeToggle` and `themeAtom`.
- Replace the template's example `contacts` feature per
  `docs/TEMPLATE_SETUP.md`; update `ARCHITECTURE.md` and `CONVENTIONS.md`
  references as the docs protocol requires.
- New feature folder `src/features/properties/` reading the manifests in
  `src/data/properties/` (schema.ts validates the manifest shape with zod).

## Phase 2, image pipeline

- Move masters out of `public/` (they must not deploy) into
  `assets/masters/<slug>/`, keeping filenames.
- Build script (sharp) generates `public/assets/properties/<slug>/` AVIF and
  WebP at 640 / 1280 / 2560 widths plus a base64 blur placeholder, and emits
  `src/data/properties/derived.json` consumed by an `<AssetImage>` component
  (srcset, sizes, aspect-ratio box, blur-up fade).
- Wire into `pnpm build`; derivatives are committed so deploys stay static.

## Phase 3, pages

- Home: full-bleed hero (featured Queenscliff frame), wordmark and three
  nav items, property name in display serif, metadata line. A quiet
  featured strip of the other properties below the fold.
- Projects: filterable grid from manifest categories, honest aspect
  ratios, 2 to 3 columns. Filters are data-driven text buttons.
- Project overlay route `/projects/$slug`: sidebar with name, location,
  year, one paragraph; featured images then gallery bank; next-project
  link at the end.
- Studio and Contact: single quiet page each, near-zero copy.
- Playwright specs per page in `tests/e2e/` per the template's testing
  strategy.

## Phase 4, hero shader

- ogl flowmap displacement per docs/DESIGN.md "Hero shader", gated behind
  WebGL2 + fine pointer + no reduced-motion, dynamically imported after
  hero paint. Plain img remains the LCP element.

## Phase 5, ship

- `pnpm verify` green, deploy via `pnpm run deploy` (Cloudflare Workers
  static assets), custom domain when ready.

## Open decisions

1. Direction confirmation (recommended: The Contemporary Studio).
2. Wordmark case: lowercase serif "onform" vs "OnForm".
3. Property display names and the one-paragraph copy per property.
4. Whether the Studio page carries a short statement or stays image-only.
