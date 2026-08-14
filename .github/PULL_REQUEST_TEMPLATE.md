## Summary

<!-- What does this PR change, and why? -->

## Test coverage

<!-- Which tags/spec files does this touch or add? e.g. @functional, tests/functional/pricing.spec.ts -->

## Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes locally (or failures are explained below and are pre-existing/site-side)
- [ ] No form was submitted, and no account/login was created, by any new or changed test
- [ ] New/changed tests are tagged with at least one of `@smoke`, `@navigation`, `@forms`,
      `@functional`, `@visual`, `@responsive`
- [ ] Page object changes contain no `expect()` calls
- [ ] If visual baselines changed, screenshots were reviewed before committing
      (`npm run baseline`, then inspect `__snapshots__/`)

## Notes for reviewers

<!-- Anything that needs extra context: known site issues, flaky tests, follow-up work, etc. -->
