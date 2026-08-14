# Agents in This Repository

This file is a human-readable catalog of the custom Claude Code **subagents** defined in
[`.claude/agents/`](.claude/agents/). It exists so contributors (and other AI coding tools that
read a root `AGENTS.md` by convention) can discover what automated help is available without
digging through `.claude/`.

> **Note for Claude Code users:** Claude Code loads subagent *definitions* directly from
> `.claude/agents/*.md` — it does not read this file to register agents. This file is a catalog
> for humans; the actual behavior lives in the linked files below. See
> [CLAUDE.md](CLAUDE.md) for the project instructions Claude Code loads automatically every
> session, and [SKILLS.md](SKILLS.md) for the slash commands / skills catalog.

---

## How subagents work here

Each file in `.claude/agents/` is a Markdown file with YAML frontmatter (`name`, `description`,
`tools`, `model`) followed by the agent's system prompt. Claude Code delegates to a subagent
automatically when a task matches its `description`, or you can invoke one explicitly:

```
Use the site-analyzer agent to refresh site.config.json
Use the test-generator agent to add coverage for the new pricing page
```

Subagents run in their own context window, so their exploration/output doesn't clutter your main
conversation — only a summary comes back.

---

## Available agents

### `site-analyzer`

**File:** [`.claude/agents/site-analyzer.md`](.claude/agents/site-analyzer.md)

Crawls a live website and produces a fully-populated `site.config.json`. Use it when:

- Onboarding a new company/site into this framework
- Verifying an existing `site.config.json` is still accurate after a site redesign
- Running the `/analyze-site` skill

It navigates the target site, extracts nav links, forms, industry signals, and auth requirements,
and outputs a config block plus an "issues found" checklist (broken links, missing meta
description, etc.) — never attempting to log in unless credentials are explicitly provided.

### `test-generator`

**File:** [`.claude/agents/test-generator.md`](.claude/agents/test-generator.md)

Reads a populated `site.config.json` and generates site-specific Playwright + TypeScript test
files (POM-based) for functionality the shared generic suites don't cover — pricing calculators,
live chat, unique page structures, regression coverage for a specific reported bug, etc. Output
lands in `tests/custom/`. Follows the same "no form submission, no login" rules as the rest of
this repo.

---

## Adding a new agent

1. Create `.claude/agents/<name>.md` with `name` and `description` frontmatter at minimum
   (see the [Claude Code subagent docs](https://code.claude.com/docs/en/sub-agents) for the full
   field reference: `tools`, `model`, `permissionMode`, etc.).
2. Restrict `tools` to what the agent actually needs (e.g. a read-only analysis agent shouldn't
   get `Write`/`Edit`).
3. Add an entry to this file describing when to use it.
4. Commit — project-scoped agents are shared with the whole team via version control.
