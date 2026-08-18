# Frontend Template

A production-grade starting point for React SPAs. Clone it, follow
[`docs/TEMPLATE_SETUP.md`](docs/TEMPLATE_SETUP.md), build features.

## Stack

Vite · React · TypeScript (strictest) · Tailwind CSS v4 · shadcn/ui ·
TanStack Router (file-based) · TanStack Query · Jotai · react-hook-form + zod
· Vitest + RTL · Playwright · ESLint (typed, all-errors) · Prettier · knip

## Quick start

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm verify       # typecheck + lint + knip + unit tests + e2e + build
pnpm run deploy   # build + deploy to Cloudflare Workers (needs wrangler login)
```

## Where things live

- **`CLAUDE.md`** — the rules: definition of done, shadcn policy, import
  convention, how to add features/routes/primitives/env vars.
- **`docs/ARCHITECTURE.md`** — stack decisions, data flow, state management.
- **`docs/CONVENTIONS.md`** — naming, organisation, testing strategy.
- **`docs/DESIGN.md`** — theme tokens, dark mode, shadcn modification log.
- **`docs/GOTCHAS.md`** — non-obvious behaviours, learned the hard way.
- **`src/features/contacts/`** — the reference feature new features copy.

The whole quality gate is `pnpm verify` — six checks, run in order, all
green before any work counts as done.
