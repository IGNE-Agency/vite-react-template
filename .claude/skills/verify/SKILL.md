---
name: verify
description: Use before declaring any change done — how to run checks, launch the app, and smoke-test the flows that actually break in this project (forms, auth redirect, localized URLs). Also the reference for what CI runs.
---

# Verifying changes

There is no unit-test suite (deliberately — see `CLAUDE.md`). Verification here means: static checks pass **and** the affected flow was exercised in the running app.

## 1. Static checks

```sh
bun fix    # biome check --write src, prettier --write on (s)css, then tsc --noEmit
```

`bun fix` must pass before finishing any task. `bun run check` is the non-mutating variant (CI parity). Never bypass the lefthook pre-commit hook or suggest `--no-verify`.

CI (GitHub, on PRs to main) runs `bun i --frozen-lockfile && bun run build` — so a change that only breaks under `vite build` + full `tsc` (not `--noEmit` dev flow) surfaces there. Run `bun run build` locally when you touched `vite.config.ts`, generated-code inputs, or dependencies.

Type errors in `router-i18n.ts` after adding/removing a route are **intentional** — add/remove the localized pathname entry (see `adding-a-route`).

## 2. Run the app

```sh
bun run dev   # installs deps, regenerates heyapi/paraglide/routeTree, opens the browser
```

- Serves over **https** via `vite-plugin-mkcert` — first run may prompt to install a local CA; a cert warning in odd browsers is expected.
- `VITE_API_BASEURL` comes from `.env`; API requests go through the Vite proxy (`vite.config.ts`). In an unadopted template, auth endpoints are faked by an interceptor in `src/lib/api.ts` — login accepts anything.
- Generated code is rebuilt at startup; if types look stale mid-session, restart the dev server.

## 3. Smoke-test what this project actually breaks

Pick the ones your change can plausibly affect:

- **Auth round-trip**: visit a protected route logged out → land on `/login?redirect=…` → log in → arrive at the original deep link. Log out → back to login.
- **Form validation, both layers**: submit invalid input (FE zod errors appear per-field, translated) and trigger a backend validation error (field + form-level errors render; in the template, `form-example.tsx`'s `fakeSubmit` can be flipped to fail).
- **i18n**: switch locale in the header — copy changes, URL swaps to the localized pathname (e.g. `/login` ↔ `/inloggen`), reload keeps the locale, `<html lang>` updates.
- **Titles/head**: the tab title is `Page · App` on each visited route.
- **Console is clean**: biome bans `console.*` in committed code, so any console output at runtime is a signal.

## 4. Honest reporting

Report exactly what was run and what was observed. "`bun fix` passes" is not "the login flow works" — say which flows you exercised and which you didn't.
