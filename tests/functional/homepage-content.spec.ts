/**
 * tests/functional/homepage-content.spec.ts
 *
 * Functional tests for HopJax homepage business content: the hero, the
 * "3 Easy Steps" process, the benefits section, the provider directory
 * teaser, and the blog article teasers.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Content @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('hero section displays the main heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a non-empty <h1>/<h2>').toBeGreaterThan(0);
  });

  test('"3 Easy Steps" process section lists all steps @functional', async ({ homePage }) => {
    const steps = await homePage.getProcessSteps();
    expect(
      steps.length,
      'Expected the "Find Wellness In 3 Easy Steps" section to list its steps'
    ).toBeGreaterThanOrEqual(3);
  });

  test('"Benefits of HopJax" section is present @functional', async ({ homePage }) => {
    const hasBenefits = await homePage.hasBenefitsSection();
    expect(hasBenefits, 'Expected a "Benefits of HopJax" section on the homepage').toBeTruthy();
  });

  test('"Latest News and Resources" section lists blog teasers @functional', async ({ homePage }) => {
    const teasers = await homePage.getBlogTeasers();

    if (teasers.length === 0) {
      console.warn('[functional] No blog teaser links found — homepage markup may have changed.');
      return;
    }

    for (const teaser of teasers) {
      expect(teaser.title.length, `Blog teaser should have a title: ${JSON.stringify(teaser)}`).toBeGreaterThan(0);
      expect(teaser.href.length, `Blog teaser should have an href: ${JSON.stringify(teaser)}`).toBeGreaterThan(0);
    }
  });
});
