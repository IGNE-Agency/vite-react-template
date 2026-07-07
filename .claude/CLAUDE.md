# CLAUDE.md

You are working in a production TypeScript + React repository. Make safe, minimal, maintainable changes that fit the existing architecture.

**Primary rule**: before changing code, read the surrounding files and follow the patterns already present. Prefer the pattern used closest to the code you are editing.

---

## Stack

| Concern         | Tool                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| Package manager | `bun`                                                                          |
| Build           | Vite                                                                           |
| Framework       | React 19 (React Compiler enabled) + TypeScript 5.9                             |
| Routing         | `@tanstack/react-router` — file-based, localized URLs via Paraglide            |
| Data fetching   | HeyApi-generated SDK + `@tanstack/react-query`                                 |
| API layer       | Generated — `src/lib/heyapi/` from `openapi.json` (Vite plugin; types, query options, zod schemas) |
| Forms           | `@tanstack/react-form` via `useAppForm` (`src/lib/forms/`)                     |
| UI primitives   | `@base-ui/react`                                                               |
| Styling         | CSS Modules + SCSS                                                             |
| i18n            | `@inlang/paraglide-js`                                                         |
| Testing         | None currently — see Tests section                                             |

---

## Skills

Project skills in `.claude/skills/` carry the deep how-to knowledge. Use the matching skill **before** working in its area:

- `adopting-the-template` — turning this template into a real project (CHANGE_ME seams, fake API, error contract)
- `working-with-forms` — building forms with `useAppForm`, `tsf-*` connectors, backend-error mapping
- `api-and-generated-code` — what is generated, by what, and how to change it correctly
- `adding-a-route` — file routes, layout guards, **mandatory** localized pathnames in `router-i18n.ts`
- `i18n-messages` — Paraglide message workflow, locales, zod locale bridge
- `ui-components-and-styling` — Base UI extend pattern, component/folder conventions, token system
- `auth-and-permissions` — what's real vs. fake in auth; discipline for building the real thing
- `upgrading-dependencies` — migration discipline and the library coupling map
- `verify` — checks, running the app, and the smoke tests that matter here

---

## House rules (unwritten elsewhere)

- **Example code must stay deletable.** Template examples (`form-example` route, fake API interceptor, joke loading messages) exist to be removed. Never let real features import from or depend on example files.
- **Follow official recipes.** For TanStack, Base UI, Paraglide, HeyApi, or zod problems, consult the upstream docs and follow their patterns rather than inventing local workarounds. Local cleverness is what makes the next upgrade expensive.

---

## Verification

Before finishing any task, run in order:

```
bun fix   # Auto-fix formatting, then type-check
```

Never bypass hooks or suggest `--no-verify`.

CI runs `bun run build` on PRs. See the `verify` skill for the full checklist including app smoke tests.

---

## UI primitives — base-ui

Before implementing any interactive widget (dialog, popover, menu, select, checkbox, slider, tooltip, etc.), fetch `https://base-ui.com/llms.txt` and use the relevant `@base-ui/react` primitive. Do not hand-roll accessible widgets.

---

## Generated files

- Generated in this repo: `src/lib/heyapi/`, `src/lib/paraglide/`, `src/routeTree.gen.ts` — all produced by Vite plugins at dev/build start.
- Generated files should be gitignored.
- Do not edit generated files — change their inputs instead (see the `api-and-generated-code` skill).
- Include new generated files/folders in the gitignore, under the right comment heading.
- Gitignored files not under the specific generated files heading are not necessarily generated, and thus are exempt from this rule.

---

## TypeScript

- No `any`
- No casts — help the compiler infer correctness through runtime logic. If a third-party type makes this impossible, cast with a comment explaining why. Last resort only.
- No non-null assertions — prefer type guards and narrowing
- No duplicate type definitions — reuse exported types from API, hooks, or shared modules
- Add JSDoc to util functions you create, including at least one example. Add docs to existing util functions you edit that are missing them. Keep types in typescript.

---

## React

- Extract into subcomponents or hooks when a component exceeds ~150–200 LOC
- No global state for local UI concerns
- No `useEffect` for logic that can run during render, in event handlers, or as derived/memoized values
- No `useMemo` / `useCallback` unless solving a real referential stability or performance problem (React Compiler handles memoization)
- No hardcoded user-facing copy — use i18n keys

---

## Forms

- Use TanStack Form through the single `useAppForm` hook (`src/lib/forms/index.tsx`); register new field components there
- Validate with generated zod schemas (`lib/heyapi/zod.gen`) via `onDynamic`; submit through `mutateAndValidate` via `onSubmitAsync`
- See the `working-with-forms` skill before building or changing any form

---

## CSS

- Use the sass features `@extend` or `@include` (mixins) instead of css modules' `composes` feature
- Use the design tokens (`var(--unit-*)`, `var(--color-*-*)`) from `src/style/variables/` — no hardcoded sizes or hex colors in components

---

## Data fetching

- Use the generated HeyApi SDK and TanStack Query option factories (`lib/heyapi/@tanstack/react-query.gen`) — never hand-write query keys or fetchers
- Always handle loading, empty, and error states
- Never hardcode URLs, tokens, or environment-specific values — env goes through `src/env.ts`

---

## i18n

- This project uses Paraglide JS. When in doubt about message format, arrays, pluralization, or other Paraglide-specific behavior, consult the docs at https://inlang.com/m/gerre34r/library-inlang-paraglideJs before making assumptions.
- Messages are in the root `messages/` folder — add every key to **all** locale files
- Scope keys to their feature, not a generic layer — `login_email` not `field_email`. Identical strings across features should still have separate keys so they can evolve independently.
- Reserve `common_` only for structural UI strings unlikely to ever diverge, like `common_save` or `common_cancel`. Field labels don't qualify.
- Use `{feature}_{concept}` as the default pattern: `login_submit`, `nav_logout`, `error_page_title`.
- Separate logical groups of keys with a blank line (roles, loading messages, nav, pages, etc.).

---

## Scope

- Change only what is necessary for the requested outcome
- Do not refactor files you are not already modifying
- Do not add dependencies unless clearly necessary — prefer what is already in `package.json`
- Do not add comments unless the _why_ is non-obvious to a future reader

---

## Tests

- Only write tests if similar tests already exist, or explicitly asked to
- Never use snapshots
- Never write unit tests for components

---

## Docs stay true

When a change makes `README.md`, `docs/`, this file, or a skill in `.claude/skills/` inaccurate, update it in the same PR. Stale docs have cost this project real time; a PR that leaves them wrong is not done.
