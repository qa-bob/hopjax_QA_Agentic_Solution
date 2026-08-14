# Copilot Instructions

This repository is a **Playwright + TypeScript regression test suite** for the site defined in
`site.config.json`, built with the Page Object Model (POM) and OOP conventions. These are the
same rules Claude Code follows from [`CLAUDE.md`](../CLAUDE.md) — keep both files in sync if you
change one.

## Architecture

- Page objects live in `src/pages/`, one class per page or major section, extending `BasePage`
  (`src/pages/base.page.ts`).
- Locators are `readonly Locator` properties or computed on demand inside methods — never put
  `expect()` assertions inside a page object; assertions belong in tests only.
- Tests import page objects through the custom fixture in `src/fixtures/site.fixture.ts`, not
  `@playwright/test` directly.
- Every test is tagged with at least one of `@smoke`, `@navigation`, `@forms`, `@functional`,
  `@visual`, `@responsive`.
- Never hardcode the base URL — always resolve it via `baseURL` / the `siteConfig` fixture, which
  reads `site.config.json`.

## Hard rules

- **Never submit a form.** Fill and validate fields only.
- **Never create an account, log in, or enter real credentials** unless `auth.required: true` is
  explicitly set in `site.config.json`.
- **Never use `page.waitForTimeout()`** — use `waitForSelector` or Playwright's built-in
  auto-waiting instead.
- Avoid `any` without explicit justification; `tsconfig.json` runs in strict mode.
- Run `npm run typecheck` and `npm run lint` before finishing any change.

## Useful commands

```bash
npm test                    # full suite
npm run test:smoke          # @smoke only
npm run typecheck           # tsc --noEmit
npm run lint                # eslint
npm run baseline            # update visual snapshots (review before committing!)
```

See [`README.md`](../README.md) for full setup instructions, [`AGENTS.md`](../AGENTS.md) for the
Claude Code subagent catalog, and [`SKILLS.md`](../SKILLS.md) for the slash-command catalog.
