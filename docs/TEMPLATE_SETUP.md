# Template setup checklist

Steps to turn this template into a real project. Work top to bottom; run
`pnpm verify` at the end.

## Identity

- [ ] Rename the project: `name` in `package.json`, `<title>` in
      `index.html`, `VITE_APP_NAME` default in `src/config/env.ts` and
      `.env.example`, headings in `src/routes/index.tsx`, and `name` in
      `wrangler.jsonc` (it becomes the `*.workers.dev` subdomain).
- [ ] Replace `public/favicon.svg`.
- [ ] Rewrite `README.md` for the actual product.
- [ ] Update the one-line description at the top of `CLAUDE.md`.

## Environment

- [ ] Define the real environment variables in `src/config/env.ts` (zod
      schema) and `.env.example`.
- [ ] Create `.env.local` for local development (gitignored).

## Replace the example feature

- [ ] Build your first real feature by copying the structure of
      `src/features/contacts/` (see CLAUDE.md → "How to add things").
- [ ] Delete `src/features/contacts/`, `src/routes/contacts.tsx` and
      `tests/e2e/contacts.spec.ts`.
- [ ] Update `src/routes/index.tsx` (it links to the example) and
      `tests/e2e/navigation.spec.ts`.
- [ ] Point the api layer at your real backend (replace the in-memory fake).
- [ ] Update `docs/ARCHITECTURE.md` and `docs/CONVENTIONS.md` to reference
      the real feature instead of contacts — docs must never describe code
      that no longer exists.

## Theme

- [ ] Set the real palette and radius in `src/styles/globals.css` and record
      the choices in `docs/DESIGN.md`.
- [ ] Decide on system-preference dark mode (see `docs/DESIGN.md`).

## Housekeeping

- [ ] Set up real CI if the project gets one (run `pnpm verify`).
- [ ] First deploy: `pnpm exec wrangler login`, then `pnpm run deploy` (see
      `docs/ARCHITECTURE.md` → "Deployment").
- [ ] Review `docs/GOTCHAS.md` — remove entries that stop applying (e.g. the
      registry mirror recipe once you're off a restricted network).
- [ ] `pnpm verify` — everything green before the first feature PR.
