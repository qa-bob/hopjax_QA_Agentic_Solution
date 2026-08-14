# Skills / Slash Commands in This Repository

This file catalogs the custom Claude Code **skills** (slash commands) defined in
[`.claude/commands/`](.claude/commands/). Skills package a repeatable multi-step workflow behind
a single `/command` so contributors don't have to re-explain the procedure every session.

> Files in `.claude/commands/` and `.claude/skills/` both register slash commands in Claude Code
> — this repo currently uses the `.claude/commands/` convention. See
> [CLAUDE.md](CLAUDE.md) for the standing project rules and [AGENTS.md](AGENTS.md) for the
> subagent catalog.

---

## Available skills

| Command | File | What it does |
|---|---|---|
| `/generate-full-suite` | [`generate-full-suite.md`](.claude/commands/generate-full-suite.md) | Analyzes the site in `site.config.json` and generates a complete Playwright + TypeScript POM suite: page objects plus smoke, navigation, forms, functional, visual, and responsive tests. Run this once when onboarding a new site, or after a major redesign. |
| `/analyze-site [url]` | [`analyze-site.md`](.claude/commands/analyze-site.md) | Crawls a live site and produces a fully-populated `site.config.json` block, plus an issues checklist (missing meta description, broken nav links, no contact form, etc.). Defaults to the URL already in `site.config.json` if none is given. |
| `/run-smoke` | [`run-smoke.md`](.claude/commands/run-smoke.md) | Runs `npm run test:smoke` and prints a clean pass/fail/warning summary table with suggested fixes for common failure patterns. |
| `/generate-report` | [`generate-report.md`](.claude/commands/generate-report.md) | Parses the latest `test-results/results.json` and prints a per-suite pass/fail/flaky breakdown, lists failed tests with error messages, and suggests next steps. |
| `/update-baseline` | [`update-baseline.md`](.claude/commands/update-baseline.md) | Runs `npm run baseline` to recapture visual regression screenshots after an intentional design change, then reminds you to review the diffs before committing. |

---

## When to use a skill vs. an agent

- **Skill** (`/command`) — a fixed, repeatable procedure you (or Claude) trigger on demand:
  running tests, generating a report, refreshing baselines.
- **Agent** (see [AGENTS.md](AGENTS.md)) — a specialized worker Claude delegates to for a task
  that needs its own exploration and judgment, such as crawling an unfamiliar site or deciding
  what site-specific test coverage is missing.

`/generate-full-suite` and `/analyze-site` overlap conceptually with the `test-generator` and
`site-analyzer` agents — the skills are the user-triggered, step-by-step version of the same
workflows the agents can also perform autonomously when Claude decides they fit a task.

---

## Adding a new skill

1. Create `.claude/commands/<name>.md` (or `.claude/skills/<name>/SKILL.md` for skills that need
   supporting files, e.g. scripts or templates).
2. Add YAML frontmatter with at least a `description` so it's useful in listings.
3. Document the exact `npm` scripts or file changes it performs — skills should be deterministic
   enough that a human could follow the same steps by hand.
4. Add a row to the table above and commit.
