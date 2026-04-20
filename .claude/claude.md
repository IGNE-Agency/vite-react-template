# CLAUDE.md

You are working in a production TypeScript + React repository.

Your job is to make safe, minimal, maintainable changes that fit the
existing architecture and conventions of the codebase.

## Primary rule

Before changing code, inspect the surrounding files and follow the
patterns already used in this repository.

Do not treat this file as permission to redesign the codebase. Prefer
small, targeted changes unless a broader refactor is explicitly
requested.

---

## Core principles

### 1. Make the smallest correct change
- Prefer focused fixes over broad rewrites
- Change only what is necessary for the requested outcome
- Avoid touching unrelated files
- Keep diffs easy to review

### 2. Match the local codebase
- Follow existing naming, structure, and patterns
- Reuse local utilities, hooks, components, and helpers before creating new ones
- Prefer consistency with nearby code over abstract best practices

### 3. Keep everything production-safe
- Preserve existing behavior unless a behavior change is requested
- Do not leave debug code, dead code, or placeholder logic behind
- Avoid speculative abstractions
- Do not add temporary workarounds without explaining them

### 4. Optimize for maintainability
- Write code another engineer can quickly understand
- Keep components focused
- Keep state as simple as possible
- Preserve type safety

---

## What to inspect first

Before implementing changes, inspect the repo and infer:

- package manager
- framework and build tool
- tsconfig and type strictness
- linting and formatting rules
- routing approach
- styling approach
- state management approach
- data fetching and API patterns
- form handling patterns
- file and component organization
- test setup, if any
- environment variable conventions
- shared UI components or design system

If the repo already has a pattern, use it.

If multiple patterns exist, prefer the one used closest to the code you
are editing.

---

## TypeScript rules

### General
- Prefer explicit, narrow types
- Preserve or improve type safety
- Avoid `any`
- Avoid unsafe casts unless absolutely necessary
- Prefer inference when it keeps code clear
- Add types where they improve readability or correctness

### Practical guidance
- Use existing domain types before creating new ones
- Reuse exported types from API, hooks, or shared modules when available
- Prefer discriminated unions over loosely typed state when appropriate
- Keep function signatures simple and precise
- Do not silence type errors without good reason

### Avoid
- `any`
- broad `as unknown as ...` casts
- non-null assertions unless the invariant is genuinely guaranteed
- type definitions that duplicate existing source-of-truth types

---

## React rules

### Components
- Prefer functional components
- Keep components small and focused
- Prefer composition over unnecessary abstraction
- Do not create "shared" components unless there is real reuse or an existing shared pattern
- Keep props minimal, explicit, and well typed

### Hooks
- Follow the Rules of Hooks
- Use existing custom hooks when appropriate
- Do not create a custom hook unless it improves reuse, readability, or separation of concerns
- Keep hooks focused on a single concern

### State
- Prefer local state when sufficient
- Do not lift state unless necessary
- Do not introduce global state for local UI concerns
- Keep derived state derived rather than duplicated
- Avoid overly clever state flows

### Effects
- Use effects only when needed
- Do not use `useEffect` for logic that can run during render, in event handlers, or in memoized values
- Be careful with dependency arrays
- Prevent unnecessary re-renders and effect loops

### Memoization
- Do not add `useMemo` or `useCallback` by default
- Use memoization only when it solves a real referential stability or performance problem
- Prefer simpler code over premature optimization

---

## JSX and rendering

- Keep render logic straightforward
- Extract repeated UI only when it improves clarity
- Avoid deeply nested conditional JSX when a small helper or subcomponent is clearer
- Preserve loading, empty, success, and error states
- Do not hardcode user-facing copy if the repo uses localization

When rendering lists:
- use stable keys
- do not use array indices as keys unless the list is static and order cannot change

---

## Forms

When working with forms:

- follow the repository's existing form library and validation approach
- keep validation consistent with nearby forms
- prefer controlled or uncontrolled inputs based on existing local patterns
- handle submit, loading, validation, and error states explicitly
- preserve accessibility for labels, descriptions, and errors

Do not introduce a new form library unless explicitly asked.

---

## Data fetching and API integration

Follow the repository's existing API/data layer.

- use existing API clients, hooks, or request utilities
- use existing cache/fetching patterns
- preserve loading and error handling conventions
- do not hardcode URLs, tokens, or environment-specific values
- do not bypass established abstractions without reason

If the repository uses generated API code:
- do not manually edit generated files
- use the project's generation command

When adding data-dependent UI:
- handle loading state
- handle empty state
- handle error state
- avoid assuming data is always present
- keep types aligned with the actual response shape

---

## Routing

Follow the existing routing approach already in the repository.

- keep route components consistent with nearby routes
- preserve guard logic and auth flows
- do not break deep links or navigation assumptions
- use existing navigation helpers and route constants if present

If route-level code splitting or lazy loading is already used, continue using it.

---

## Styling and UI

Use the styling approach already present in the repo.

- reuse existing UI primitives, tokens, variables, and utilities
- match nearby spacing, typography, and interaction patterns
- keep styles local if that is the local convention
- do not introduce a new styling system unless explicitly asked

### Accessibility
Preserve or improve accessibility:

- use semantic HTML
- keep labels associated with form controls
- preserve keyboard access
- preserve focus behavior
- use correct button and link semantics
- do not hide important state only in color
- ensure disabled and loading states remain understandable

### Responsive behavior
- keep layouts responsive in the same way surrounding components are
- do not introduce brittle fixed sizing without a reason
- preserve existing mobile and desktop patterns

---

## Formatting and linting

All changes must be formatted and lint-clean according to the repository
setup.

- Follow the repo's existing formatter/linter responsibilities exactly
- Do not manually format code in ways that fight the configured tools
- Do not reformat unrelated files

If the repository uses both Biome and Prettier:
- follow the existing division of responsibility
- do not replace one with the other
- do not introduce conflicting formatting changes

Your final code should look like it has already been run through the
project's formatting and linting pipeline.

---

## Pre-commit and verification rules

Assume all changes must pass the repository's pre-commit hooks.

- Make changes that pass pre-commit checks cleanly
- Do not bypass hooks
- Do not suggest using `--no-verify`
- Do not leave the repo in a state that would fail staged checks
- Prefer changes that pass typecheck, lint, and formatting checks on the first run

Before finishing, validate with the smallest relevant project checks,
especially those that mirror pre-commit behavior.

Typical priorities:
1. type check
2. lint
3. formatting check
4. build, when needed

If the repo has hook-based validation, your changes must be compatible
with that workflow.

---

## File structure

Follow the repository's local file organization.

Examples of patterns you should infer and match:

- colocated component files
- shared `components/` directory
- `hooks/`, `lib/`, `utils/`, `pages/`, or `features/` structure
- barrel exports or direct imports
- CSS modules, styled components, or other local styling conventions

Do not reorganize files unless that is necessary for the requested change.

---

## Naming

Match local naming conventions exactly.

Common expectations:

- React components: `PascalCase`
- hooks: `useSomething`
- utilities/functions: local project convention
- types/interfaces: local project convention
- files: match surrounding naming pattern exactly

Prefer descriptive names over short clever names.

---

## Dependencies

Be conservative with dependencies.

- prefer existing libraries already in the repo
- do not add new dependencies unless clearly necessary
- do not replace an established library without being asked
- if a dependency is needed, choose the smallest stable option that fits the existing stack

Do not change package managers or introduce a second lockfile.

---

## Quality checks

Use the repository's existing scripts and tooling.

Before finishing, run the smallest relevant checks available, such as:

1. type check
2. lint
3. format check
4. targeted build verification when needed

Prefer the minimum verification that gives reasonable confidence.

Code should be ready to pass:
- local validation
- CI validation
- pre-commit hooks

Do not bypass hooks, checks, or safeguards.

---

## Testing

If the repository already has tests:
- add or update tests when it is natural and low-friction
- prefer focused tests near the changed behavior
- do not rewrite unrelated tests

If the repository does not have tests configured:
- do not introduce a test framework unless explicitly asked

---

## Refactoring rules

You may refactor only when it directly supports the requested change.

Refactoring must be:
- tightly scoped
- behavior-preserving
- easy to review

Do not perform drive-by refactors.

If you notice a broader structural issue, mention it separately rather
than silently expanding scope.

---

## Output expectations

When proposing or making changes:

- preserve existing behavior unless asked otherwise
- keep the implementation minimal
- keep the code type-safe
- keep the code readable
- ensure the result is formatter-clean
- ensure the result is lint-clean
- ensure the result would survive pre-commit hooks

If multiple valid solutions exist, prefer:
1. the one most consistent with nearby code
2. the one with the smallest diff
3. the one with the lowest maintenance burden
