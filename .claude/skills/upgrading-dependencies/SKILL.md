---
name: upgrading-dependencies
description: Use when upgrading, replacing, or removing a dependency, or performing any library migration — the discipline that keeps migrations cheap, the coupling map between libraries in this stack, and the doc-sync checklist that prevents drift.
---

# Upgrading & migrating dependencies

Library churn has historically been this project's most expensive failure mode (zorm→zod4+HeyApi, react-router→TanStack Router, controlled forms→TanStack Form). The migrations succeeded; the cost came from underestimating coupling and from docs drifting afterwards. This skill exists so the next migration is boring.

## Non-negotiables

1. **One library per branch/PR.** Never mix an upgrade with feature work, and never batch two major upgrades. If `bun outdated` shows ten majors, that's ten PRs (patch/minor batches are fine).
2. **Read the official migration guide before touching code.** House rule: follow upstream recipes over local workarounds. If the guide and this codebase disagree, the codebase adapts — local cleverness is what makes the *next* upgrade expensive.
3. **Prove it with the app, not just the compiler.** `bun fix` + `bun run build` passing is necessary, not sufficient — see the verify checklist below.
4. **Don't add dependencies to solve upgrade friction.** Prefer what's in `package.json`; a new dep needs clear necessity.

## Coupling map — what breaks together

| Upgrading…           | Also check…                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| TanStack Router      | `router-i18n.ts` (route-path types from `routeTree.gen.ts`), the `rewrite` hooks in `src/lib/router.tsx`, `@tanstack/router-plugin` version + its `vite.config.ts` options |
| Paraglide / inlang   | `strategy`/`urlPatterns` config in `vite.config.ts`, locale redirects + canonical links in `__root.tsx`, `setLocale`/`getLocale` call sites, `router-i18n.ts` pattern syntax |
| TanStack Form        | `createFormHook` API in `src/lib/forms/index.tsx`, all `tsf-*` connectors, `mutateAndValidate` (a stop-gap for TanStack/form#2188 — check whether native support landed and the helper can be deleted) |
| HeyApi (`@hey-api/*`)| plugin list + output path in `vite.config.ts`, generated import paths everywhere (`lib/heyapi/...`), zod plugin output vs. installed zod major |
| zod                  | HeyApi's zod plugin compatibility, `zod/locales` imports in `src/lib/i18n.ts`, `validateSearch` schemas |
| React                | `babel-plugin-react-compiler` version (paired in `vite.config.ts`), `@types/react`, Base UI peer range |
| Base UI              | every `@base-ui/react/*` import (compound-component APIs move between versions), `docs/recipes/extending-base-ui.md` |
| Vite                 | every plugin in `vite.config.ts` (paraglide, heyapi, router, mkcert, svgr, tsconfig-paths), the SCSS `resolve.alias` regex |
| Biome / prettier     | `biome.json` schema version, `lefthook.yml` commands, editor settings in `.vscode/` |

## Verify after upgrading

1. `bun fix` and `bun run build` pass.
2. Dev server smoke test (see the `verify` skill): login flow, a form submission with a validation error, locale switch, a localized URL (e.g. `/inloggen`), browser console clean.
3. `git diff bun.lock` only contains the intended package(s).

## Doc-sync checklist (do this in the same PR)

Grep the library's name across the repo and update every mention that changed meaning:

- `README.md`
- `.claude/CLAUDE.md` (the stack table especially)
- `docs/**`
- `.claude/skills/**` — **these skills reference concrete APIs and file paths; a migration that doesn't update them poisons every future session.**

A migration PR that leaves stale docs is not done. Drift is how the last stale-README/stale-pipeline problems happened.
