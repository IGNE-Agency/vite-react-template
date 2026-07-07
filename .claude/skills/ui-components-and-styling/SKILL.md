---
name: ui-components-and-styling
description: Use when creating or styling components — Base UI-first widget policy, the extend-and-reexport pattern, component folder conventions, and the CSS Modules + SCSS token system (units, generated color palette, mixins over composes).
---

# UI components & styling

## Base UI first — never hand-roll widgets

Before implementing any interactive widget (dialog, popover, menu, select, checkbox, slider, tooltip, …), fetch https://base-ui.com/llms.txt and build on the `@base-ui/react` primitive. Hand-rolled accessible widgets are how this codebase accumulated rework before; the policy is absolute.

To customize a Base UI compound component project-wide, use the **import-and-reexport pattern** documented in `docs/recipes/extending-base-ui.md`: spread the original namespace, override only the parts you change, name overrides with the parent as suffix-prefix (`MenuTrigger`, avoiding reserved-name clashes), and export a Props type whenever you add props.

## Component conventions

- One folder per component: `component-name/component-name.tsx` + `component-name.module.scss`.
- Form controls live in `src/components/form/`; plain (uncontrolled) components are exported from `components/form/index.ts`, while `tsf-*` TanStack Form connectors are **not** exported there — they're only reachable through `useAppForm` (see the `working-with-forms` skill).
- Something used exactly once may not deserve a component — use Base UI primitives inline and reuse existing style classnames.
- Field structure (label / control / error / description) comes from the shared `Field` component (`components/form/field`); don't rebuild that layout per control.
- Extract subcomponents/hooks past ~150–200 LOC; no `useEffect` for derivable logic; no `useMemo`/`useCallback` without a real problem (React Compiler is enabled).
- Icons: import SVGs with `?react` (SVGR + SVGO are configured); see `app-header.tsx`.

## Styling system

- **CSS Modules + SCSS**, camelCase access (`style.gridMain` for `.grid-main` — `localsConvention: "camelCase"`).
- **Tokens are CSS custom properties** from `src/style/variables/`: spacing `var(--unit-2)`, colors `var(--color-primary-500)` (a 050–950 palette is auto-generated from each base color in `color.scss` — never hardcode hex values in components).
- **Sharing styles**: use SCSS `@mixin`/`@include` or `@extend` — never CSS Modules' `composes`. Shared form mixins live in `src/components/form/form.scss`; shared form classnames for TSX in `form.module.scss`.
- **Importing SCSS from SCSS**: the `style/` prefix alias works in SCSS via a Vite `resolve.alias` regex (tsconfig paths don't apply to SASS): `@use "style/variables/unit.scss"`.
- CSS/SCSS is formatted by **prettier** (with css-order plugin), not biome — `bun fix` runs both.
- Global styles only in `src/style/main.scss` (reset, base typography); everything else is scoped through modules.
