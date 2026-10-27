import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// A juror's first 30 seconds: open the link, no login, see what this is, find settings.
test.describe('smoke', () => {
  test('start screen shows the name and the unofficial-prototype disclaimer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('banner')).toContainText('Sprawnie');
    await expect(page.locator('[data-disclaimer]')).toContainText('Nieoficjalny prototyp');
    await expect(page.locator('[data-disclaimer]')).toContainText('fikcyjne');
    await expect(page).toHaveTitle('Twoje sprawy – Sprawnie');
  });

  // Only the content area scrolls; the page itself never does, so the tab bar stays at the bottom.
  // (A visually hidden label once escaped the scroll area and stretched the page.)
  for (const path of ['/', '/kategorie/bezpieczenstwo', '/dokumenty/dowod', '/do-zalatwienia']) {
    test(`the page itself does not scroll on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const { scroll, viewport } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
      }));
      expect(scroll).toBeLessThanOrEqual(viewport);
    });
  }

  test('no login wall: settings reachable from the bottom navigation', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Menu główne' })
      .getByRole('link', { name: 'Ustawienia' })
      .click();
    await expect(page).toHaveURL(/\/ustawienia$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Ustawienia' })).toBeFocused();
  });

  test('senior mode persists across reloads and enlarges the base text', async ({ page }) => {
    await page.goto('/ustawienia');
    const before = await page.evaluate(() => getComputedStyle(document.body).fontSize);
    await page.getByRole('switch', { name: 'Tryb dla seniora' }).check();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-senior', 'true');
    const after = await page.evaluate(() => getComputedStyle(document.body).fontSize);
    expect(parseFloat(after)).toBeGreaterThan(parseFloat(before));
  });

  test('reset demo: confirm, keep focus, return to a fresh start screen', async ({ page }) => {
    await page.goto('/ustawienia');
    await page.getByRole('button', { name: 'Zresetuj demo' }).click();
    await expect(page.locator('p', { hasText: 'Na pewno zacząć od nowa?' })).toBeFocused();
    await page.getByRole('button', { name: 'Anuluj' }).click();
    await expect(page.getByRole('button', { name: 'Zresetuj demo' })).toBeFocused();
    await page.getByRole('button', { name: 'Zresetuj demo' }).click();
    await page.getByRole('button', { name: 'Tak, zresetuj' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('status').filter({ hasText: 'od nowa' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });

  test('each screen has its own document title', async ({ page }) => {
    await page.goto('/ustawienia');
    await expect(page).toHaveTitle('Ustawienia – Sprawnie');
  });

  test('unknown paths show a friendly page, not a server error', async ({ page }) => {
    await page.goto('/nie-ma-takiej');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nie ma takiej strony');
  });

  for (const path of ['/', '/ustawienia']) {
    for (const senior of [false, true]) {
      test(`axe: no WCAG A/AA violations on ${path}${senior ? ' (senior)' : ''}`, async ({ page }) => {
        await page.addInitScript(
          (s) => localStorage.setItem('settings:v1', JSON.stringify({ senior: s })),
          senior
        );
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    }
  }
});
