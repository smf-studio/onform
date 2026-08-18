# Gotchas

Non-obvious behaviours discovered while building the template. Add to this
file whenever a piece of work surprises you.

## TypeScript 6 deprecates `baseUrl`

The natural way to get bare absolute imports is `baseUrl: "./src"`, but TS 6
errors on it (TS5101, removal planned for TS 7). The equivalent,
forward-compatible spelling used in `tsconfig.app.json` and
`tests/tsconfig.json` is a `paths` wildcard without `baseUrl`:

```jsonc
"paths": { "*": ["./src/*"] }
```

Specifiers that don't match a file under `src/` fall back to `node_modules`
resolution as usual.

## shadcn CLI and the bare (no-prefix) alias

The CLI resolves the aliases in `components.json` through the **root**
`tsconfig.json` only — it does not follow project references, and our root
config is solution-style with no compiler options. The workaround: the root
`tsconfig.json` carries a `compilerOptions` block (`baseUrl: "./src"` +
`paths: { "*": ["./*"] }`) that `tsc` ignores in a solution file but the CLI
reads. With that in place the CLI writes `import { cn } from "lib/utils"`
etc. correctly — no `@/` prefix needed. (`baseUrl` is fine _there_ because
tsc never type-checks that block; see the previous gotcha.)

## shadcn CLI behind restricted networks

The CLI fetches from `https://ui.shadcn.com/r`, which sandboxed/proxied
environments may block. Two facts make an offline path possible:

1. The built registry JSON is committed to the shadcn-ui/ui repo under
   `apps/v4/public/r/` (fetchable from `raw.githubusercontent.com`).
2. The CLI honours a `REGISTRY_URL` env var overriding the registry base URL.

Recipe: mirror `r/colors/<baseColor>.json` and
`r/styles/new-york-v4/<component>.json` into a directory, serve it with any
static file server on localhost, then:

```sh
REGISTRY_URL=http://127.0.0.1:4873/r pnpm dlx shadcn@latest add <component>
```

Note the CLI appends `styles/<style>/<name>.json` itself — point
`REGISTRY_URL` at the directory containing `styles/`, not at a style dir.

## Registry items under-declare npm dependencies

`button.json` declares only `radix-ui` even though the component imports
`class-variance-authority` (the registry assumes the style's init step
installed it). After adding primitives, check that every package imported in
`src/components/ui/` exists in `package.json` — `pnpm typecheck` catches it.

## `src/routeTree.gen.ts` is generated but committed

The TanStack Router Vite plugin regenerates it on every `pnpm dev` /
`pnpm build`. It is committed so that `pnpm typecheck` works on a fresh
clone (the `build` script runs `tsc -b` _before_ Vite would regenerate the
file). It is excluded from ESLint, Prettier and knip — never edit it by hand.

## Vite aliases are an explicit directory list

`vite.config.ts` maps each top-level `src/` directory (`app`, `components`,
`features`, …) to an alias. Adding a new top-level directory requires
updating `srcDirs` there and `internalPattern` in `eslint.config.js` (so the
import sorter groups it as internal). Corollary: a top-level directory name
that collides with an npm package name (e.g. `config`) shadows that package
in app code — keep directory names on the current list or pick non-package
names.

## knip's `ignore` still traces imports

Files matched by `ignore` (here `src/components/ui/**`) are excluded from
_reporting_ but stay in the dependency graph — so packages used only by
shadcn primitives (`radix-ui`, `class-variance-authority`) do **not** need
`ignoreDependencies` entries. Only dependencies referenced from CSS
(`tailwindcss`, `tw-animate-css`) are invisible to knip and stay listed.

## Playwright in environments with a preinstalled browser

Some sandboxes forbid `playwright install` downloads and ship a Chromium at a
fixed path instead. `playwright.config.ts` supports
`PLAYWRIGHT_CHROMIUM_PATH=<path to chromium binary>` to launch that browser
(e.g. `/opt/pw-browsers/chromium` on Claude Code remote environments). Unset,
the config behaves like stock Playwright.

## `eslint-plugin-react-hooks` flat preset location

With v7 the flat-config preset is `reactHooks.configs.flat.recommended` —
`configs['recommended-latest']` is the legacy (eslintrc) shape and crashes
ESLint 10 with "plugins key defined as an array of strings".

## `pnpm deploy` is a pnpm built-in — use `pnpm run deploy`

pnpm resolves `pnpm deploy` to its own workspace-deploy command before
looking at package scripts, and it fails in this single-package repo. The
`deploy` script must be invoked as `pnpm run deploy`. Relatedly, wrangler's
dependencies `esbuild` and `workerd` need their postinstall scripts to fetch
platform binaries, and pnpm blocks build scripts by default, so they are
allowlisted in `pnpm-workspace.yaml` (that file exists purely for pnpm
settings — this is not a workspace). See the next entry before touching it.

## `pnpm-workspace.yaml` has to satisfy three pnpm generations

Whichever pnpm you run locally, a CI image will run a different one, and the
settings file is where the versions disagree. Two traps, both of which the
committed file already works around:

- **No `packages` key means pnpm 10.5 and older refuse to install**, with
  `ERROR packages field missing or empty`. That key only became optional in
  pnpm ~10.6, when settings moved into this file. Cloudflare Workers Builds
  ships pnpm 10.11.1, other images are further behind, and a fresh clone
  that installs fine on your machine dies on theirs. `packages: [.]` keeps
  every version happy and doesn't turn the repo into a monorepo.
- **The build-script allowlist got renamed.** pnpm 10 reads
  `onlyBuiltDependencies` and silently ignores `allowBuilds`; pnpm 11 does
  the reverse and warns `ERR_PNPM_IGNORED_BUILDS`. Whichever one is missing,
  `esbuild` never fetches its binary and the build fails later, in a place
  that looks unrelated to install. Both lists are committed; edit them
  together.

`packageManager` in `package.json` backs this up: pnpm 10 and newer read that
field and hand off to the pinned version before doing anything else, so a
build image on pnpm 10.11.1 installs with 11.1.2 instead. Bump it whenever
you upgrade pnpm, and expect a one-off download of the pinned version on
machines that don't have it (on a network that blocks the pnpm registry, set
`manage-package-manager-versions=false` in `.npmrc`). pnpm 9 ignores the
field entirely, which is why the file itself still has to be valid.

If a build image is ancient enough that even this fails, override the tool
version rather than mangling the file (`PNPM_VERSION` as a build environment
variable on Cloudflare).

## E2e runs on its own port and never reuses a running server

The suite starts its own dev server on 5273 — not the 5173 `pnpm dev`
default — and `reuseExistingServer` is off.

Both are deliberate. Playwright's reuse check is just "is something
answering on this port", which cannot distinguish this app from any other
Vite project. When a stranger's dev server held 5173, the whole suite ran
against that site and failed with seven element-not-found timeouts that
looked like real app bugs. Reuse is off so `--strictPort` fails loudly with
`Port 5273 is already in use` instead.

So if the port is taken, the fix is to free it or point elsewhere —
`E2E_PORT=5399 pnpm test:e2e` (or `E2E_PORT=5399 pnpm verify`) — and _not_
to switch reuse back on. The cost is that each run spins up a fresh server
(~1s) rather than borrowing the one you already have open.
