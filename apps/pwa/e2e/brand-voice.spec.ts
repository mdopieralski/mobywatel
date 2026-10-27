import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Team page: the brand voice guide rendered from docs/product/brand-voice.md.
test.describe('brand voice page', () => {
  test('shows the explanation and the full guide', async ({ page }) => {
    await page.goto('/brand-voice');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Brand voice');
    await expect(page).toHaveTitle('Brand voice – Sprawnie');
    await expect(page.getByRole('heading', { level: 2, name: 'What a brand voice is' })).toBeVisible();
    // Sections from the doc itself.
    await expect(page.getByRole('heading', { level: 2, name: /Tone map/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /The assistant/ })).toBeVisible();
    await expect(page.locator('[data-disclaimer]')).toContainText('Nieoficjalny prototyp');
  });

  test('no horizontal page scroll on a phone (tables scroll on their own)', async ({ page }) => {
    await page.goto('/brand-voice');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('axe: no WCAG A/AA violations', async ({ page }) => {
    await page.goto('/brand-voice');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
