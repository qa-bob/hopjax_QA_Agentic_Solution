/**
 * tests/functional/newsletter-signup.spec.ts
 *
 * Functional tests for the "Join Our Mailing List" newsletter signup form
 * on the homepage.
 * IMPORTANT: These tests do NOT submit the form.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Newsletter Signup @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('newsletter signup form is present @functional', async ({ homePage }) => {
    const hasForm = await homePage.hasNewsletterForm();
    expect(hasForm, 'Expected a "Join Our Mailing List" email signup form on the homepage').toBeTruthy();
  });

  test('newsletter email field accepts input @functional', async ({ homePage }) => {
    const hasForm = await homePage.hasNewsletterForm();
    test.skip(!hasForm, 'No newsletter form found — covered by the presence test');

    await homePage.fillNewsletterEmail('qa-test@example.com');
    const value = await homePage.getNewsletterEmailValue();

    expect(value, 'Email field should accept and retain typed input').toBe('qa-test@example.com');
  });
});
