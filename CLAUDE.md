# Frontend Template

Production-grade React SPA template: Vite + React + TypeScript + Tailwind v4 +
shadcn/ui + TanStack Router/Query + Jotai + react-hook-form/zod, with strict
tooling that fails loudly. This repo is cloned as the starting point for new
projects — see `docs/TEMPLATE_SETUP.md` for how to turn it into one.

## Commands

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Start the dev server                                 |
| `pnpm typecheck`  | `tsc -b` across all project references               |
| `pnpm lint`       | ESLint (`--max-warnings 0`) then `prettier --check`  |
| `pnpm format`     | Prettier write                                       |
| `pnpm knip`       | Dead code / unused dependency check                  |
| `pnpm test`       | Vitest unit tests (`pnpm test:watch` for watch)      |
| `pnpm test:e2e`   | Playwright e2e tests (starts the dev server itself)  |
| `pnpm build`      | Typecheck + production build                         |
| `pnpm verify`     | All six checks above, sequentially                   |
| `pnpm run deploy` | Build + deploy to Cloudflare Workers (static assets) |

## Definition of done (non-negotiable)

After completing ANY feature or fix, run `pnpm verify` and fix every failure
before considering the work complete. The order is deliberate:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm knip`
4. `pnpm test`
5. `pnpm test:e2e`
6. `pnpm build`

There is no CI safety net — `pnpm verify` IS the gate. Never skip it, never
"fix it later".

## shadcn/ui rules (non-negotiable)

- Only use shadcn primitives for UI. Add them via the CLI:
  `pnpm dlx shadcn@latest add <component>`. Never hand-write a component that
  shadcn provides.
- Never modify files in `src/components/ui/` except when (a) explicitly asked,
  or (b) aligning them with `docs/DESIGN.md`. Record every modification in
  `docs/DESIGN.md` with the reason.
- Composition happens in feature components and `components/shared/` — never
  by editing primitives.
- `src/components/ui/` is exempt from ESLint, Prettier and knip (vendor code,
  kept byte-identical to the registry). It is still type-checked.

## Import convention

Bare absolute imports rooted at `src/`: `components/ui/button`,
`features/contacts/queries`, `lib/utils`. No `@/` prefix, no deep relative
paths (`../../`). Configured in `tsconfig.app.json` (`paths` wildcard),
`vite.config.ts` (`resolve.alias`), `tests/tsconfig.json` (Playwright) and
`components.json` + root `tsconfig.json` (shadcn CLI). Adding a new top-level
directory under `src/` means updating the `srcDirs` list in `vite.config.ts`
and the `internalPattern` in `eslint.config.js`.

## Knip policy

Unused files, exports and dependencies fail `pnpm knip`. Zero tolerance —
delete dead code, don't ignore it. The only exemption is
`src/components/ui/**` (shadcn primitives ship more exports than the app
uses, by design). Dependencies only referenced from CSS (`tailwindcss`,
`tw-animate-css`) are listed in `knip.jsonc` with a comment.

## Structure rules

```
src/
  app/            # providers, router setup, global fallbacks
  routes/         # TanStack Router file-based routes — THIN, delegate to features
  features/       # one folder per feature: components/, api, atoms, queries, schema, utils
  components/ui/      # shadcn primitives (untouched, exempt from lint/format/knip)
  components/shared/  # cross-feature composed components
  lib/            # generic pure utilities (unit tested)
  config/         # env validation (config/env.ts), constants
  store/          # global Jotai atoms ONLY (feature atoms live in the feature)
  styles/         # Tailwind entry CSS + @theme tokens
tests/e2e/        # Playwright specs
docs/             # architecture, conventions, design, gotchas, setup
```

- Routes are thin: data via Query `queryOptions()` factories co-located in
  features, shared between route loaders and components.
- Error / not-found / pending boundaries are route-level, provided by the
  router defaults in `app/router.ts`.
- Env vars: declare in the zod schema in `src/config/env.ts`, document in
  `.env.example`. The app crashes at boot on invalid env.
- Use the `cn()` helper from `lib/utils` for conditional classes.
- Named exports everywhere; files are named after their export.

## How to add things

- **A new feature**: copy the shape of `src/features/contacts/` — `schema.ts`
  (zod), `api.ts`, `queries.ts` (queryOptions factory + mutation hooks),
  `atoms.ts` (feature state), `utils.ts` (+ `utils.test.ts`), `components/`.
  Add a route that delegates to it, and a Playwright spec in `tests/e2e/`.
- **A new route**: create a file in `src/routes/` (file-based routing). Load
  data with `context.queryClient.ensureQueryData(someQueryOptions())` in the
  loader; keep the component a thin wrapper around a feature component. The
  route tree regenerates on `pnpm dev`/`pnpm build`.
- **A new shadcn primitive**: `pnpm dlx shadcn@latest add <component>`, then
  commit `src/components/ui/<component>.tsx` as generated. If the registry is
  unreachable, see docs/GOTCHAS.md → "shadcn CLI behind restricted networks".
- **A new env var**: add it to `.env.example` AND the schema in
  `src/config/env.ts` (it must start with `VITE_` to reach the client). Read
  it only via `env`, never `import.meta.env` directly.

## Testing strategy

- **Vitest + RTL** (`src/**/*.test.{ts,tsx}`, co-located): unit tests for
  utility functions, zod schemas and pure logic. Not for exhaustive component
  testing.
- **Playwright** (`tests/e2e/`): e2e tests for expected user flows. When
  fixing a user-facing bug: write a failing e2e test first, fix the bug, keep
  the test as a regression guard.

## Writing copy

When writing any user-facing copy — UI labels, empty states, error messages,
marketing text, README prose, emails — use the `anti-ai-slop-writing` skill
(`.claude/skills/anti-ai-slop-writing/`). It is a project skill, so it ships
with every repo cloned from this template.

## Never do

- Edit `src/components/ui/` unprompted (see shadcn rules above)
- Default exports (only tooling configs that require them are exempt)
- `any`, non-null assertions (`!`), floating promises
- `eslint-disable` without a justification comment on the same line/block
- Skip `pnpm verify` or leave it red
- Let docs drift (see below)

## Doc maintenance protocol

Documentation is part of the definition of done. When a piece of work changes
architecture, conventions or theme, or reveals a non-obvious behaviour,
update the relevant file in `docs/` in the same piece of work. When the
example contacts feature is replaced in a real project, `ARCHITECTURE.md` and
`CONVENTIONS.md` must be updated to reference real code. Never let docs
describe things the code no longer does.
