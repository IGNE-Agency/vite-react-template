---
name: auth-and-permissions
description: Use when touching login, logout, session handling, route guards, redirects, roles, or permissions — documents what the template's auth actually does, which parts are fake, and the discipline for building the real thing. This is the least-finished area of the template.
---

# Auth & permissions

**Status: the weakest seam in the template.** What ships is a minimal cookie-session skeleton plus a deliberately fake backend. A robust auth/permission template is tracked upstream as IGNE-Agency/vite-react-template#43 (wip). Expect to build here — carefully.

## What exists and how it flows

1. **Guard** — `src/routes/_app/route.tsx` `beforeLoad`: `context.queryClient.ensureQueryData(getApiUsersCurrentOptions())`. If fetching the current user throws, redirect to `/login` with the attempted path in `?redirect` (omitted when it's just `/`). Because it's `ensureQueryData`, the user stays cached for the session per the queryClient defaults.
2. **Login** — `src/routes/_auth/login.tsx`: TSF form posting via the generated `postApiAuthLoginMutation()`. Two deliberate details: `gcTime: 0` on the mutation (credentials must never linger in the query cache) and the `redirect` search param validated as `z.string().startsWith("/").catch("/")` (open-redirect protection). On success: `navigate({ to: redirect || "/" })`.
3. **Logout** — `handleLogout` in `app-header.tsx`: generated SDK call `postApiAuthLogout()`, then navigate to `/login`.
4. **Session** — assumed to be an http-only cookie set by the backend; the client sends no token header.

## What is FAKE (in an unadopted template)

The response interceptor in `src/lib/api.ts` intercepts `/api/auth/login`, `/api/auth/logout`, `/api/users/current` and simulates a session with a `FAKE_AUTH` cookie. **Nothing about auth is real until this block is deleted** and the proxy points at a real backend (see `adopting-the-template`).

## Discipline for building the real thing

- **Verify the session mechanism with the backend first** (cookie vs. token, refresh behavior, what 401 vs 403 mean). If tokens are involved, they belong in the client config/interceptors in `src/lib/api.ts` — one place, never per-call.
- **Keep guards in `beforeLoad` on layout routes**, not inside components. New protected areas = new pathless layout route with its own guard, mirroring `_app`.
- **Preserve deep links**: any new guard must carry the attempted location through to login, the way `_app` does.
- **Centralize permission logic**: when roles arrive (the `roles_user`/`roles_admin` message keys are a placeholder for this), derive them from the cached current-user query and expose checks from a single `src/lib/` module (e.g. a `useCurrentUser`/`can(permission)` pair). Never scatter `user.role === "admin"` comparisons through components — the whole point of #43 is avoiding that.
- **On auth state change, reset caches**: after logout (and login-as-different-user), clear or invalidate the query cache so no privileged data survives (`queryClient.clear()` at minimum for logout). The current skeleton does *not* do this — it's a known gap to close when adopting.
- **Handle 401 globally, not per-query**: an interceptor/queryClient-level redirect to login beats per-component error handling. Add it in `src/lib/api.ts`.
- Check upstream issue #43 and the template's `main` branch before designing from scratch — if a permission template has landed since, follow it.
