/**
 * src/pages/home.page.ts
 *
 * HomePage models the site's root/homepage.
 * Uses semantic and role-based selectors to stay design-agnostic.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface BlogTeaser {
  title: string;
  href: string;
}

export class HomePage extends BasePage {
  // ── Hero / above-the-fold ───────────────────────────────────────────────────

  /**
   * Return the text content of the hero section.
   * Tries common hero patterns: <section> with role="banner", first <h1>,
   * or elements with data-testid="hero".
   */
  async getHeroText(): Promise<string> {
    // Ordered preference: banner landmark → data-testid → first section
    const candidates = [
      this.page.getByRole('banner').first(),
      this.page.locator('[data-testid="hero"]').first(),
      this.page.locator('section').first(),
      this.page.locator('header').first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.count() > 0) {
        const text = await candidate.textContent();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    }

    return '';
  }

  // ── CTAs ────────────────────────────────────────────────────────────────────

  /**
   * Return all primary call-to-action buttons/links visible on the page.
   * Looks for <button> and <a> elements styled as buttons, or those
   * whose text contains common CTA phrases.
   */
  async getCTAButtons(): Promise<Locator[]> {
    const ctaLocator = this.page.locator(
      'a[class*="btn"], a[class*="button"], a[class*="cta"], ' +
      'button[class*="primary"], button[class*="cta"], ' +
      '[role="button"]'
    );

    const all = await ctaLocator.all();

    // If CSS class approach yields nothing, fall back to text-match heuristics
    if (all.length === 0) {
      const textCta = this.page.locator(
        'a, button'
      ).filter({
        hasText: /get started|try free|sign up|contact us|learn more|request demo/i,
      });
      return textCta.all();
    }

    return all;
  }

  // ── Headings ────────────────────────────────────────────────────────────────

  /**
   * Return the text of the first <h1> on the page.
   * Falls back to first <h2> if no <h1> exists (some SPAs render h2 first).
   */
  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) {
      return (await h1.textContent())?.trim() ?? '';
    }

    const h2 = this.page.locator('h2').first();
    if (await h2.count() > 0) {
      return (await h2.textContent())?.trim() ?? '';
    }

    return '';
  }

  // ── Load verification ───────────────────────────────────────────────────────

  /**
   * Returns true when key homepage elements are present:
   *  - A heading exists
   *  - At least one nav element exists
   *  - Body has some text content
   */
  async isLoaded(): Promise<boolean> {
    try {
      // Heading present
      const headingCount = await this.page.locator('h1, h2').count();
      if (headingCount === 0) return false;

      // Navigation present
      const navCount = await this.page.locator('nav, [role="navigation"]').count();
      if (navCount === 0) return false;

      // Page has meaningful text
      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      if (bodyText.trim().length < 50) return false;

      return true;
    } catch {
      return false;
    }
  }

  // ── "3 Easy Steps" process ──────────────────────────────────────────────────

  /**
   * Return the text of each step in the "Find Wellness In 3 Easy Steps" section.
   */
  async getProcessSteps(): Promise<string[]> {
    const section = this.page.locator('section, div').filter({ hasText: /3 easy steps/i }).first();
    if (await section.count() === 0) return [];

    const steps = section.locator('h3, h4, [class*="step"]');
    const count = await steps.count();
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await steps.nth(i).textContent())?.trim();
      if (text) results.push(text);
    }

    return results;
  }

  // ── Benefits section ─────────────────────────────────────────────────────────

  /** Returns true if the "Benefits of HopJax" section is present. */
  async hasBenefitsSection(): Promise<boolean> {
    const heading = this.page.getByRole('heading', { name: /benefits of hopjax/i });
    return (await heading.count()) > 0;
  }

  // ── Blog / news teasers ──────────────────────────────────────────────────────

  /**
   * Return the title and href of each article teaser in the
   * "Latest News and Resources" section.
   */
  async getBlogTeasers(): Promise<BlogTeaser[]> {
    const section = this.page.locator('section, div').filter({ hasText: /latest news and resources/i }).first();
    if (await section.count() === 0) return [];

    const links = section.locator('a[href*="/resource-center/blog"], article a, a:has(h3), a:has(h4)');
    const count = await links.count();
    const results: BlogTeaser[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const title = (await link.textContent())?.trim();
      const href = await link.getAttribute('href');
      if (title && href) results.push({ title, href });
    }

    return results;
  }

  // ── Newsletter signup ("Join Our Mailing List") ─────────────────────────────

  /**
   * Locate the mailing-list signup form. Uses `.last()` since any header
   * search form would match the same "form with an email-like input" filter
   * before the actual newsletter form further down the page.
   */
  private getNewsletterForm(): Locator {
    return this.page.locator('form').filter({
      has: this.page.locator('input[type="email"], input[name*="email" i]'),
    }).last();
  }

  /** Returns true if the newsletter signup form is present. */
  async hasNewsletterForm(): Promise<boolean> {
    return (await this.getNewsletterForm().count()) > 0;
  }

  /**
   * Fill (but do NOT submit) the newsletter email field.
   */
  async fillNewsletterEmail(email: string): Promise<void> {
    const emailField = this.getNewsletterForm()
      .locator('input[type="email"], input[name*="email" i]')
      .first();
    await emailField.fill(email);
  }

  /** Return the current value of the newsletter email field. */
  async getNewsletterEmailValue(): Promise<string> {
    const emailField = this.getNewsletterForm()
      .locator('input[type="email"], input[name*="email" i]')
      .first();
    return emailField.inputValue();
  }

  // ── Primary CTAs & cross-portal links ───────────────────────────────────────

  /** Return the href of the "Begin Your Journey" CTA, or null if absent. */
  async getPrimaryCtaHref(): Promise<string | null> {
    const cta = this.page.locator('a, button').filter({ hasText: /begin your journey/i }).first();
    if (await cta.count() === 0) return null;
    return cta.getAttribute('href');
  }

  /** Return the href of the "Get Listed" (provider signup) CTA, or null if absent. */
  async getGetListedHref(): Promise<string | null> {
    const cta = this.page.locator('a, button').filter({ hasText: /get listed/i }).first();
    if (await cta.count() === 0) return null;
    return cta.getAttribute('href');
  }

  /** Return the href of the "For Patients Login" link, or null if absent. */
  async getPatientLoginHref(): Promise<string | null> {
    const link = this.page.locator('a').filter({ hasText: /patients? login/i }).first();
    if (await link.count() === 0) return null;
    return link.getAttribute('href');
  }

  /** Return the href of the "For Providers Login" link, or null if absent. */
  async getProviderLoginHref(): Promise<string | null> {
    const link = this.page.locator('a').filter({ hasText: /providers? login/i }).first();
    if (await link.count() === 0) return null;
    return link.getAttribute('href');
  }
}
