import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Someone who doesn't read Polish: find the language switch, pick theirs, and the whole app follows.
test.describe('languages', () => {
  test('the header switch leads to the picker; Ukrainian applies everywhere and persists', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Zmień język/ }).click();
    await expect(page).toHaveURL(/\/ustawienia$/);

    await page.getByRole('radio', { name: 'Українська' }).check();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Налаштування');
    await expect(page).toHaveTitle('Налаштування – Sprawnie');

    await page.reload();
    await page
      .getByRole('navigation', { name: 'Головне меню' })
      .getByRole('link', { name: 'Початок' })
      .click();
    await expect(page.locator('[data-disclaimer]')).toContainText('Неофіційний прототип');
    await expect(page.locator('[data-disclaimer]')).toContainText('вигадані');
  });

  test('a shared link with ?lang= opens in that language', async ({ page }) => {
    await page.goto('/?lang=de');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('[data-disclaimer]')).toContainText('Inoffizieller Prototyp');
    await expect(page).toHaveTitle('Deine Anliegen – Sprawnie');
  });

  for (const locale of ['en', 'uk', 'de', 'cs', 'sk', 'lt', 'be']) {
    test(`axe: no WCAG A/AA violations in ${locale}`, async ({ page }) => {
      await page.addInitScript(
        (l) => localStorage.setItem('settings:v1', JSON.stringify({ locale: l })),
        locale
      );
      for (const path of ['/', '/ustawienia']) {
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(results.violations).toEqual([]);
      }
    });
  }

  test('320 px wide: the header and the picker fit without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.addInitScript(() =>
      localStorage.setItem('settings:v1', JSON.stringify({ locale: 'lt', senior: true }))
    );
    await page.goto('/ustawienia');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
