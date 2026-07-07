---
name: api-and-generated-code
description: Use when touching API calls, data fetching, or anything under src/lib/heyapi, src/lib/paraglide, or src/routeTree.gen.ts — explains what is generated, what generates it, and how to change it correctly. Also use when generated types look wrong or out of date.
---

# API layer & generated code

A large share of this codebase is **generated at dev/build time by Vite plugins** and is gitignored. Editing generated files is always wrong — the fix belongs in the *input* or the *plugin config*.

## The generation map

| Output (gitignored, never edit)      | Generator (in `vite.config.ts`)        | Input to change instead          |
| ------------------------------------ | -------------------------------------- | -------------------------------- |
| `src/lib/heyapi/**`                  | `@hey-api/vite-plugin`                 | `openapi.json` (or the `input` URL) |
| `src/lib/paraglide/**`               | `@inlang/paraglide-js` plugin          | `messages/{locale}.json`, `project.inlang/settings.json` |
| `src/routeTree.gen.ts`               | `@tanstack/router-plugin`              | files under `src/routes/`        |

Everything regenerates when the dev server or build starts. If generated output looks stale, restart `bun run dev`. If a generated directory exists that no plugin outputs to anymore (output paths have moved before — e.g. an old `src/lib/api/heyapi/`), it's a dead leftover: delete it, nothing will recreate it.

The gitignore convention: generated paths live under the `# Generated files` heading in `.gitignore`. New generator output goes under that heading; the `**/*.gen.*` pattern already covers `.gen.` files anywhere.

## What HeyApi gives you

From `openapi.json`, HeyApi generates into `src/lib/heyapi/`:

- **Types** — request/response types, e.g. `import type { LoginRequest } from "lib/heyapi"`.
- **SDK functions** — direct calls, e.g. `postApiAuthLogout()` for imperative use outside components.
- **TanStack Query factories** — `lib/heyapi/@tanstack/react-query.gen`: `getApiUsersCurrentOptions()` for queries/loaders, `postApiAuthLoginMutation()` to spread into `useMutation`. **Always prefer these over hand-writing query keys or fetchers.**
- **Zod schemas** — `lib/heyapi/zod.gen`: `zLoginRequest` etc., used as form validators so FE validation cannot drift from the spec.

## The hand-written seam

`src/lib/api.ts` is hand-written and owns the client config (`client.setConfig` with `baseUrl` from `src/env.ts`) and the `queryClient` defaults (staleTime 0, gcTime 5 min — tune per project). Response/request interceptors also live here. *(In an unadopted template it also contains a fake-auth interceptor that must be deleted — see `adopting-the-template`.)*

`src/lib/api/error-helpers.ts` and `src/lib/forms/validation-helpers.ts` translate API errors for humans/forms — the single place where the backend error contract is interpreted.

## When endpoints change

1. Update `openapi.json` (or re-fetch from the spec URL).
2. Restart the dev server; HeyApi regenerates.
3. Let the compiler drive: `bun fix` — type errors point at every call site affected by the contract change. Fix call sites, never the generated code.

## Rules

- Never hardcode URLs, tokens, or env-specific values; env goes through `src/env.ts` (zod-validated `import.meta.env`).
- Every data-driven view handles loading, empty, and error states.
- In route loaders, fetch through `context.queryClient.ensureQueryData(<generated>Options())` so router and query cache stay coherent (see `src/routes/_app/route.tsx`).
