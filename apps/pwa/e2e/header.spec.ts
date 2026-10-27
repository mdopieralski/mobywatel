import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The header, modelled on the reference prototype's: home, shortcuts, language. No dead buttons.
test.describe('header', () => {
  const shortcuts = [
    { name: 'Skrzynka', url: /\/skrzynka$/ },
    { name: 'Powiadomienia', url: /\/powiadomienia$/ },
  ];

  for (const { name, url } of shortcuts) {
    test(`"${name}" opens its screen with a heading and a way back`, async ({ page }) => {
      await page.goto('/');
      const nav = page.getByRole('navigation', { name: 'Na skróty' });
      await nav.getByRole('link', { name }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1, name })).toBeFocused();
      await expect(page).toHaveTitle(`${name} – Sprawnie`);
      await expect(nav.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
      await page.getByRole('link', { name: 'Wróć na start' }).click();
      await expect(page).toHaveURL(/\/$/);
    });
  }

  test('the name links home', async ({ page }) => {
    await page.goto('/skrzynka');
    await page.getByRole('link', { name: /Sprawnie/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('fits on one row on a 390 px phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const box = await page.getByRole('banner').boundingBox();
    expect(box?.height).toBeLessThan(80);
  });

  for (const path of ['/skrzynka', '/powiadomienia']) {
    test(`axe: no WCAG A/AA violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
