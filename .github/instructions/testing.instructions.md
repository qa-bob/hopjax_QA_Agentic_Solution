---
applyTo: "tests/**/*.ts,src/pages/**/*.ts,src/fixtures/**/*.ts"
---

# Testing & Page Object Rules

Scoped guidance for anything under `tests/`, `src/pages/`, and `src/fixtures/`. See the repo-wide
rules in [`copilot-instructions.md`](../copilot-instructions.md) / [`CLAUDE.md`](../../CLAUDE.md)
for everything else.

## Page objects (`src/pages/`)

- One class per page or major section, extending `BasePage`.
- No `expect()` calls — page objects expose data and actions, tests make assertions.
- Prefer resilient, role-based or text-based selectors (`getByRole`, `getByText`,
  `[class*="..."]` fallback chains) over brittle exact class names, since these are third-party
  marketing/product sites whose markup can change without notice.
- When a selector can't be determined with confidence, use a documented fallback chain (see
  `home.page.ts` / `contact.page.ts` for the established pattern) rather than guessing a single
  brittle selector.

## Tests (`tests/**/*.spec.ts`)

- Tag every test with at least one of `@smoke`, `@navigation`, `@forms`, `@functional`,
  `@visual`, `@responsive`.
- Import `test`/`expect` from `@fixtures/site.fixture`, never `@playwright/test` directly.
- Never submit a form, create an account, or log in.
- Prefer soft, informative assertions (`console.warn` + a lenient threshold) for cosmetic/SEO
  best-practices checks, and hard assertions for functional correctness — follow the existing
  pattern in `tests/smoke/site-availability.spec.ts`.
- When content might legitimately be absent on some sites (e.g. no FAQ accordion), skip with
  `test.skip(condition, reason)` rather than failing.

## Before committing

```bash
npx tsc --noEmit
npm run lint
```
