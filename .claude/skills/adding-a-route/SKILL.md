---
name: adding-a-route
description: Use when adding, moving, or deleting a page/route — file-based TanStack Router with pathless layout groups, mandatory localized pathnames in router-i18n.ts, page titles, search-param validation, and loaders.
---

# Adding a route

Routing is file-based TanStack Router (`src/routes/`), with `autoCodeSplitting` on and a Paraglide-powered URL localization layer on top. Official docs: https://tanstack.com/router/latest — follow them for router mechanics; this skill covers what's project-specific.

## Where the file goes

- `src/routes/_app/` — authenticated pages. `_app/route.tsx` is the layout route: it renders `AppLayout` and runs the auth guard in `beforeLoad` (see the `auth-and-permissions` skill).
- `src/routes/_auth/` — public pages (login, forgot-password) rendered in `AuthLayout`.
- `_app`/`_auth` are pathless: they group and guard without appearing in the URL.
- Colocate styles as `<route>.module.scss` next to the route file — the router plugin is configured to ignore `.module.scss` files, so this is safe.

`src/routeTree.gen.ts` regenerates on dev/build start; never edit it.

## The steps that are easy to miss

**1. Localized pathname (compile-enforced).** `router-i18n.ts` at the repo root maps every route path to its per-locale URL. Its input type *requires an entry for every non-index route path*, so adding a route without adding its translations is a **type error, on purpose** — that's the drift guard. Add the entry:

```ts
"/settings": {
	"en-US": "/settings",
	"nl-NL": "/instellingen",
},
```

This feeds both the Paraglide `urlPatterns` (via `vite.config.ts`) and — through the router's `rewrite` (`localizeUrl`/`deLocalizeUrl` in `src/lib/router.tsx`) — means route files always use the *canonical* path while users see the localized one. Locale redirects and canonical `<link>` tags are already handled in `src/routes/__root.tsx`; don't re-implement them per route.

**2. Page title.** Every route sets one, i18n'd:

```tsx
head: () => ({ meta: [{ title: makePageTitle(m.settings_title()) }] }),
```

**3. Message keys.** Titles/copy need keys in *both* `messages/*.json` files (see the `i18n-messages` skill).

**4. Navigation.** App-level nav lives in the `links` array in `src/components/header/app-header.tsx`. `to` is typed against the route tree, so typos fail the build.

## Search params & loaders

- Validate search params with a zod schema via `validateSearch`. Follow `login.tsx`'s redirect param for the defensive pattern: `z.string().startsWith("/").catch("/")` — it doubles as open-redirect protection.
- Loaders get `context.queryClient` (typed via `RouterContext` in `src/lib/router.tsx`); fetch with `ensureQueryData(<generated>Options())` rather than ad-hoc fetching.

## Deleting a route

Remove the route file + its `.module.scss`, its entry in `router-i18n.ts` (the compiler will insist), its nav link, and its now-unused message keys in both locale files.
