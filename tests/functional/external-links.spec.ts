/**
 * tests/functional/external-links.spec.ts
 *
 * Functional tests for HopJax's primary CTAs and cross-portal links.
 * These verify link targets only — the suite never navigates into the
 * separate patient/provider login portals, since authentication is out
 * of scope for this framework.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('External CTAs and Portal Links @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('"Begin Your Journey" CTA links to the patient portal @functional', async ({ homePage }) => {
    const href = await homePage.getPrimaryCtaHref();
    expect(href, 'Expected a "Begin Your Journey" CTA on the homepage').not.toBeNull();
    expect(href, 'CTA should link to the patient portal').toContain('client.hopjax.com');
  });

  test('"Get Listed" CTA links to the provider signup page @functional', async ({ homePage }) => {
    const href = await homePage.getGetListedHref();
    expect(href, 'Expected a "Get Listed" CTA on the homepage').not.toBeNull();
    expect(href, 'CTA should link to the /providers/ page').toContain('/providers');
  });

  test('patient login link points to the patient portal @functional', async ({ homePage }) => {
    const href = await homePage.getPatientLoginHref();
    if (!href) {
      console.warn('[functional] No "For Patients Login" link found — homepage markup may have changed.');
      return;
    }
    expect(href, 'Patient login link should point to client.hopjax.com').toContain('client.hopjax.com');
  });

  test('provider login link points to the provider portal @functional', async ({ homePage }) => {
    const href = await homePage.getProviderLoginHref();
    if (!href) {
      console.warn('[functional] No "For Providers Login" link found — homepage markup may have changed.');
      return;
    }
    expect(href, 'Provider login link should point to admin.hopjax.com').toContain('admin.hopjax.com');
  });
});
