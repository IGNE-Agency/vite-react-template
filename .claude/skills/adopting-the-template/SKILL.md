---
name: adopting-the-template
description: Use when starting a new project from the IGNE vite-react-template, or when you encounter CHANGE_ME markers, fake API handlers, or example code and wonder what is template scaffolding vs. real code. Walks through every seam that must be adapted, in order.
---

# Adopting the template

This repo started as the IGNE `vite-react-template`. The template ships **deliberately deletable example code** and marked seams where a real project must plug in. Work through the seams in this order — later steps depend on earlier ones.

The prime directive while adopting: **example code must never grow roots.** If you find real features importing from example files (like the form-example route), untangle that before anything else.

## 1. Identity

- `package.json` → `name`. This also namespaces the language localStorage key (`${name}-lang` in `vite.config.ts`), so set it before users exist.
- `src/lib/title.ts` → `APP_NAME` (used by `makePageTitle` for every page title).
- `index.html`, `public/` favicon, `LICENSE`.

## 2. API connection

The whole API layer is generated from `openapi.json` — see the `api-and-generated-code` skill for how that works.

1. Replace `openapi.json` with the project's real spec, or point `input` in the `heyApiPlugin` config (`vite.config.ts`) at a spec URL.
2. Set the proxy in `vite.config.ts` → `server.proxy` — replace `CHANGE_ME` with the real backend origin. The app sends requests to its own origin and relies on a reverse proxy; this avoids CORS in dev and must be mirrored by the production host (see README).
3. Set `VITE_API_BASEURL` in `.env` (validated by `src/env.ts`).
4. **Delete the fake API interceptor** in `src/lib/api.ts` (the block marked `THIS IS FAKE API HANDLING`). It fakes login/logout/current-user with a `FAKE_AUTH` cookie. Real auth will not work until this is gone.

## 3. Verify the backend error contract

Do this **before** wiring any real form. The template assumes RFC 9457 problem details with a `ValidationError` shape (`{ type, title, errors: [{ path, detail }] }`, snake_case paths). Confirm with the backend team, then resolve the TODOs in:

- `src/lib/forms/validation-helpers.ts` (`apiErrorToFormErrors`, `normalizeFieldErrors`)
- `src/lib/api/error-helpers.ts` (`parseErrorString` — note the Dutch fallback string, replace with an i18n message)

If the backend deviates from RFC 9457, this is the single place to absorb the difference. Do not spread per-form workarounds.

## 4. Design tokens

- `src/style/variables/color.scss` — replace the placeholder `$colors` map; a 050–950 palette is generated per color via `color-mix`.
- `src/style/variables/unit.scss` and `fonts.scss` — match the project's design system.

## 5. Locales

- `project.inlang/settings.json` — set `baseLocale` and `locales` (template ships `nl-NL` base + `en-US`).
- `messages/{locale}.json` — replace the joke loading messages; keep the key conventions from `CLAUDE.md`.
- `router-i18n.ts` — localized pathnames for the routes you keep. The types **require** an entry per non-index route, so deleting/adding routes forces an update here (that's intentional).

## 6. Delete the examples

- `src/routes/_app/form-example.tsx` + its `.module.scss` and its `/form-example` link in `src/components/header/app-header.tsx`.
- Any remaining `fakeSubmit`-style stubs.
- Prune `docs/` sections that describe template adoption once done, keep the recipes.

## 7. CI

Two CI configs ship; keep one, delete the other:

- `.github/workflows/build.yml` — runs `bun run build` (works as-is).
- `bitbucket-pipelines.yml` — **references scripts that don't exist** (`lint`, `check-ts`). If the project lives on Bitbucket, rewrite it to use `bun run check` and `bun run build` before relying on it.

## 8. Auth

The auth guard is a placeholder. See the `auth-and-permissions` skill — this is the least-finished part of the template (upstream issue IGNE-Agency/vite-react-template#43).

## Done when

`bun run dev` starts against the real backend, login works without the fake interceptor, `bun fix` passes, no `CHANGE_ME` or `FAKE` markers remain (`grep -rn "CHANGE_ME\|FAKE" src vite.config.ts` is clean), and the README describes *this* project instead of the template.
