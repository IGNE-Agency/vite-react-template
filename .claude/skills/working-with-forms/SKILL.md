---
name: working-with-forms
description: Use when building, modifying, or debugging any form — TanStack Form via useAppForm, tsf-* connector components, zod validation, and the mutateAndValidate backend-error bridge. Also use when adding a new form field component type.
---

# Working with forms

Forms use **TanStack Form** (TSF) composed with generated zod schemas and TanStack Query mutations. `docs/working-with-forms.md` has the background; this skill is the operational recipe. The reference implementations are `src/routes/_auth/login.tsx` (real-world shape) and `src/routes/_app/form-example.tsx` (kitchen sink, deletable example).

When TSF behavior surprises you, read the official docs (https://tanstack.com/form/latest) before inventing a workaround — that's a house rule.

## The one form hook

There is exactly **one** `useAppForm` per project, created in `src/lib/forms/index.tsx` via `createFormHook`. Every field component type must be registered there in `fieldComponents`. Never call `createFormHook` or `createFormHookContexts` a second time.

## Standard form recipe

```tsx
const form = useAppForm({
	// `satisfies` a generated type from lib/heyapi so drift breaks the build
	defaultValues: { email: "", password: "" } satisfies LoginRequest,
	validationLogic: revalidateLogic(),
	validators: {
		// Frontend validation: prefer the generated zod schema (lib/heyapi/zod.gen)
		onDynamic: zLoginRequest,
		// Backend validation: submit through the mutation, map errors back
		onSubmitAsync: ({ value }) => mutateAndValidate(mutation, { body: value }),
	},
});
```

- The mutation comes from a generated option factory: `useMutation({ ...postApiAuthLoginMutation(), ... })`.
- Render fields with `form.AppField` and the registered connector: `{(field) => <field.Input label={m.login_email()} />}`.
- Wrap in the `Form` component (`components/form`) — its inner `<fieldset disabled>` disables all controls at once; pass `disabled={mutation.isPending}`.
- Submit with `evt.preventDefault(); form.handleSubmit();`.

## Backend errors

`mutateAndValidate` (`src/lib/forms/validation-helpers.ts`) catches the mutation error and converts it via `apiErrorToFormErrors`, which:

1. Parses against the generated `zValidationError` (RFC 9457 problem details).
2. Maps `errors[].path` from snake_case to camelCase field names.
3. Returns `{ form, fields }` — TSF assigns `fields` errors to matching fields, `form` to the form level.

This is a stop-gap until TSF supports it natively (TanStack/form#2188) — keep the mechanism inside `validation-helpers.ts`, never per-form.

**Form-level errors** are read via `form.Subscribe` on `state.errorMap.onSubmit`; note the bag can be a plain string *or* `{ form, fields }` — see the selector in `login.tsx` for the correct narrowing. Render through `<ErrorText>` (it no-ops on empty).

**Field errors** are arrays of mixed types; always pass them through `normalizeFieldErrors` before rendering.

## Grouped fields sharing one error slot

For rows of small fields (postal code + house number): give each field `noError`, then render one shared error below via `form.Subscribe` + `getFieldErrors(state, ["postalCode", "houseNumber"])`. See the address block in `form-example.tsx`.

## Adding a new field component type

1. Build the plain component on a Base UI primitive first (see the `ui-components-and-styling` skill).
2. Create the TSF connector as `components/form/<name>/tsf-<name>.tsx`: call `useFieldContext<ValueType>()`, wrap the control in `Field` (which renders label/description/error), pass `error={normalizeFieldErrors(field.getMeta().errors)}`, wire `value`/`handleChange`/`handleBlur`, and set `aria-invalid={!field.state.meta.isValid}`. Use `field.name` as the DOM id.
3. Register it in `fieldComponents` in `src/lib/forms/index.tsx`.
4. Do **not** export the connector from `components/form/index.ts` — connectors are only reachable through `useAppForm` (this is enforced by convention, the index file says so).

Naming: `tsf-` prefix = TSF-connected; plain name = uncontrolled/standalone. Something used only once may not need a component at all — use Base UI primitives directly and reuse styling classnames.

## Checklist before finishing a form

- Labels and errors are i18n messages, not literals.
- Loading (`mutation.isPending` → `disabled`), error, and success paths all handled.
- Backend error shape verified against the real API, not assumed (see `adopting-the-template` step 3).
- `bun fix` passes.
