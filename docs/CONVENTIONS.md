# Conventions

## File and directory organisation

- One folder per feature under `src/features/<name>/` containing exactly what
  it needs: `components/`, `api.ts`, `atoms.ts`, `queries.ts`, `schema.ts`,
  `utils.ts` and co-located tests. Omit files a feature doesn't need.
- Cross-feature composed components go in `src/components/shared/`. shadcn
  primitives live untouched in `src/components/ui/`.
- Generic, app-agnostic pure functions go in `src/lib/` and must be unit
  tested.
- Routes (`src/routes/`) are thin adapters: a loader that calls a feature's
  `queryOptions()` factory plus a component that renders a feature component.

## Naming

- Component files: `PascalCase.tsx`, named after the exported component
  (`ContactForm.tsx` exports `ContactForm`).
- Non-component files: `camelCase.ts`, named after the export
  (`queryClient.ts` exports `queryClient`).
- Feature module files are named for their role (`api.ts`, `atoms.ts`,
  `queries.ts`, `schema.ts`, `utils.ts`) and may hold several closely related
  named exports.
- Route files follow TanStack Router's file-routing convention
  (`index.tsx`, `projects.$slug.tsx`, `__root.tsx`) and export `Route`.
- Exceptions owned by tooling: `lib/utils.ts` (the shadcn `cn()` contract)
  and `src/routeTree.gen.ts` (generated).

## Exports

Named exports everywhere — default exports are banned by ESLint
(`no-restricted-syntax`). The only exemptions are tooling configs that
require a default export (`vite.config.ts`, `playwright.config.ts`,
`eslint.config.js`).

## Imports

- Bare absolute imports rooted at `src/`: `features/properties/schema`,
  `components/ui/button`. No `@/` prefix; relative imports only for the
  generated `routeTree.gen` sibling.
- Ordering is enforced by `perfectionist/sort-imports` (external → internal →
  relative); members within an import are sorted too. Run `eslint --fix` and
  don't fight it.

## Formatting and lint separation

Prettier owns style (including Tailwind class order via
`prettier-plugin-tailwindcss`); ESLint owns correctness and import/member
ordering only. All ESLint rules are errors — a warning-free build is not a
goal, it's the definition. `eslint-disable` requires a justification comment.

## Testing strategy

- **Vitest** (`*.test.ts(x)`, co-located with the code under test): utility
  functions, zod schemas, pure logic. Component tests via RTL are the
  exception, not the rule — one example lives at
  `features/properties/utils.test.ts`.
- **Playwright** (`tests/e2e/*.spec.ts`): expected user flows against the
  real app. E2e is also the debugging tool: when fixing a user-facing bug,
  first write a failing e2e test reproducing it, then fix, then keep the test
  as a regression guard.
- Tests must be deterministic. The fake api layer keeps latency low and data
  seeded; assert on visible behaviour (roles, labels, text), not on
  implementation details.

## Copy and UX writing

All user-facing copy (UI labels, empty states, error messages, marketing
text, README prose) is written with the `anti-ai-slop-writing` skill in
`.claude/skills/anti-ai-slop-writing/` — invoke it (or let it auto-activate
on writing tasks) whenever producing copy, so text doesn't read as
AI-generated. The skill's rules (banned vocabulary, structural variety,
punctuation discipline) apply to prose, not code comments or docs like this
one.

## Git & workflow

Run `pnpm verify` before declaring any piece of work done (see CLAUDE.md for
the full definition-of-done). Update the relevant file in `docs/` in the same
commit as the change that makes it necessary.
