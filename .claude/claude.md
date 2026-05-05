# CLAUDE.md

You are working in a production TypeScript + React repository. Make safe, minimal, maintainable changes that fit the existing architecture.

**Primary rule**: before changing code, read the surrounding files and follow the patterns already present. Prefer the pattern used closest to the code you are editing.

---

## Stack

| Concern         | Tool                                                                |
| --------------- | ------------------------------------------------------------------- |
| Package manager | `bun`                                                               |
| Build           | Vite                                                                |
| Framework       | React 19 + TypeScript 5                                             |
| Routing         | `react-router-dom` v6                                               |
| Data fetching   | `openapi-fetch` + `openapi-react-query` + TanStack Query v5         |
| API types       | Generated — `src/lib/schema.gen.d.ts` + `src/lib/validators.gen.ts` |
| Forms           | react controlled components                                         |
| UI primitives   | `@base-ui/react`                                                    |
| Styling         | CSS Modules + SCSS (`sass-embedded`)                                |
| i18n            | `i18next` + `react-i18next`                                         |
| Unit testing    | Vitest (if applicable)                                              |
| E2e Testing     | Playwright (if applicable)                                          |

---

## Verification

Before finishing any task, run in order:

```
bun check:types   # Check types with tsc
bun fix           # Fixes all formatting issues with oxfmt
```

Never bypass hooks or suggest `--no-verify`.

---

## UI primitives — base-ui

Before implementing any interactive widget (dialog, popover, menu, select, checkbox, slider, tooltip, etc.), fetch `https://base-ui.com/llms.txt` and use the relevant `@base-ui/react` primitive. Do not hand-roll accessible widgets.

---

## Generated files

Do not edit these manually:

- `src/lib/schema.gen.d.ts` + `src/lib/validators.gen.ts` — regenerate with `bun setup:all`
- `*.module.scss.d.ts` — generated automatically by the build tool from CSS Modules; do not create or modify these files

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
- No `useMemo` / `useCallback` unless solving a real referential stability or performance problem
- No hardcoded user-facing copy — use i18n keys

---

## CSS

- Use the sass features `@extend` or `@include` (mixins) instead of css modules' `composes` feature

---

## Data fetching

- Use the existing `openapi-react-query` / TanStack Query patterns
- Always handle loading, empty, and error states
- Never hardcode URLs, tokens, or environment-specific values

---

## Scope

- Change only what is necessary for the requested outcome
- Do not refactor files you are not already modifying
- Do not add dependencies unless clearly necessary — prefer what is already in `package.json`
- Do not add comments unless the _why_ is non-obvious to a future reader

---

## Tests

- Only write tests if similar tests already exist
- Never use snapshots
- Never write unit tests for components
