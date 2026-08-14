# Hopjax QA Agentic Solution

A **Playwright + TypeScript** regression test suite for [hopjax.com](https://hopjax.com) — an
online directory and appointment-booking platform connecting patients with mental health
providers. The suite is built with the **Page Object Model (POM)** pattern and OOP conventions,
and is structured for agentic execution by [Claude Code](https://code.claude.com/docs/).

It covers the site's GUI, functional, and regression surface without ever creating an account,
logging in, or submitting a form.

---

## What this repo tests

`site.config.json` defines the target site and a few behavior flags (contact-form presence, which
viewports to exercise, auth requirements). Everything else is derived from that config, so the
same framework can in principle be pointed at a different site by editing that one file — but
today it is scoped to Hopjax.

Coverage is organized by tag, mapped to folders under `tests/`:

| Tag | Folder | What it checks |
|---|---|---|
| `@smoke` | `tests/smoke/` | Site loads (HTTP 2xx/3xx), title/meta present, loads within budget, no critical console errors, served over HTTPS |
| `@navigation` | `tests/navigation/` | Nav is visible, every nav link resolves (no 404s), mobile menu opens/closes, link text is accessible, logo links home |
| `@forms` | `tests/forms/` | Contact form fields, required-field validation, email/name presence, accessible labels — **never submits** |
| `@functional` | `tests/functional/` | Actual business features: the "3 Easy Steps" process, benefits section, blog teasers, newsletter signup, primary CTAs and cross-portal login links |
| `@visual` | `tests/visual/` | Screenshot regression via `toHaveScreenshot()` (desktop/mobile/tablet baselines) |
| `@responsive` | `tests/responsive/` | Layout at each viewport: no horizontal overflow, hamburger nav, readable text, scaled images |

**Known site finding:** every internal nav link discovered on the homepage (`/about/`,
`/contact/`, `/how-it-works/`, `/resource-center/faq/`, `/providers/`, etc.) currently returns a
real HTTP 404 from hopjax.com — only the homepage itself resolves. The `@navigation` reachability
test surfaces this. Functional coverage is therefore concentrated on the homepage, which is the
only page confirmed reachable.

---

## Setting up the development environment

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright's browser binaries
npx playwright install

# 3. (Optional) copy the env template if you need to override the target URL locally
cp .env.example .env
# then set SITE_URL=... in .env, or export it before running tests
```

### Running tests

```bash
npm test                    # full suite, all tags
npm run test:smoke          # @smoke only
npm run test:navigation     # @navigation only
npm run test:forms          # @forms only
npm run test:functional     # @functional only
npm run test:visual         # @visual only
npm run test:responsive     # @responsive only
npm run test:headed         # any of the above with a visible browser

npm run report               # open the last HTML report
npm run baseline             # update visual snapshots (review before committing!)
```

### Before committing

```bash
npx tsc --noEmit    # TypeScript strict-mode check
npm run lint         # ESLint
```

Both must pass cleanly — see [Contributor rules](#contributor-rules) below.

---

## Project structure

```
site.config.json           # Target site URL + behavior flags
playwright.config.ts       # Playwright projects: chromium-desktop, mobile-chrome, tablet
global-setup.ts            # Pre-flight reachability check
src/
  pages/                   # Page Object Model classes, one per page/section
    base.page.ts           # BasePage — shared navigation/screenshot/console-error helpers
    home.page.ts           # HomePage
    navigation.page.ts     # NavigationPage
    contact.page.ts        # ContactFormPage
  fixtures/
    site.fixture.ts        # Custom Playwright fixture exposing page objects + siteConfig
  utils/
    link-checker.ts
    visual-helper.ts
  types/
    site-config.types.ts   # SiteConfig interface + BOM-safe JSON loader
tests/
  smoke/site-availability.spec.ts
  navigation/nav-links.spec.ts
  forms/contact-form.spec.ts
  functional/
    homepage-content.spec.ts
    newsletter-signup.spec.ts
    external-links.spec.ts
  visual/visual-regression.spec.ts
  responsive/layout.spec.ts
.claude/
  agents/                  # Custom Claude Code subagents — see AGENTS.md
  commands/                # Custom Claude Code skills/slash commands — see SKILLS.md
  hooks/                   # Pre-test reachability hook
.github/
  workflows/playwright.yml       # CI: typecheck, lint, smoke, full suite
  copilot-instructions.md        # Same rules as CLAUDE.md, for GitHub Copilot
  instructions/testing.instructions.md
  PULL_REQUEST_TEMPLATE.md
```

## Where the rules live

| File | Audience | Purpose |
|---|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Claude Code | Full architecture rules, loaded automatically every session |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | GitHub Copilot | The same rules, Copilot's format |
| [`.github/instructions/testing.instructions.md`](.github/instructions/testing.instructions.md) | GitHub Copilot | Path-scoped rules for `tests/`, `src/pages/`, `src/fixtures/` |
| [`AGENTS.md`](AGENTS.md) | Contributors | Catalog of the custom Claude Code subagents in `.claude/agents/` |
| [`SKILLS.md`](SKILLS.md) | Contributors | Catalog of the custom Claude Code skills/slash commands in `.claude/commands/` |
| This README | Contributors | Setup, structure, and the rules below |

---

## Contributor rules

- **Never submit a form, create an account, or log in** — unless `auth.required: true` is
  explicitly set in `site.config.json` (it currently is not).
- **Never hardcode the base URL** — always resolve it through `baseURL` / the `siteConfig`
  fixture, which reads `site.config.json`.
- **Page objects contain no `expect()` calls.** They expose data (`getX()`) and actions
  (`doY()`); assertions belong in test files only.
- **One page object per page or major section**, extending `BasePage`.
- **Tag every test** with at least one of `@smoke`, `@navigation`, `@forms`, `@functional`,
  `@visual`, `@responsive`.
- **Never use `page.waitForTimeout()`** — use `waitForSelector`/`waitForLoadState` or Playwright's
  built-in auto-waiting.
- **No `any`** without an explicit justification comment; `tsconfig.json` runs in strict mode.
- Prefer resilient, role/text-based selectors with a documented fallback chain over brittle exact
  class names — this is a third-party site whose markup can change without notice.
- Run `npx tsc --noEmit` and `npm run lint` before opening a PR (see the PR template checklist).
- If you update visual baselines, review the screenshots (`npm run baseline`, then inspect
  `__snapshots__/`) before committing — `__snapshots__/` is gitignored by default in this repo.

## Slash commands

| Command | Description |
|---|---|
| `/generate-full-suite` | Analyze the site and generate a complete POM + test suite |
| `/analyze-site` | Inspect site structure and report pages, forms, and elements |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a test results summary |

See [SKILLS.md](SKILLS.md) for details, and [AGENTS.md](AGENTS.md) for the `site-analyzer` and
`test-generator` subagents these commands build on.
