import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

// The header, modelled on the reference prototype's: home, shortcuts, language. No dead buttons.
test.describe('header', () => {
  const shortcuts = [
    { name: 'Skrzynka', url: /\/prototype\/skrzynka$/ },
    { name: 'Powiadomienia', url: /\/prototype\/powiadomienia$/ },
  ];

  for (const { name, url } of shortcuts) {
    test(`"${name}" opens its screen with a heading and a way back`, async ({ page }) => {
      await page.goto('/prototype');
      const nav = page.getByRole('navigation', { name: 'Na skróty' });
      await nav.getByRole('link', { name }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1, name })).toBeFocused();
      await expect(page).toHaveTitle(`${name} – Sprawnie`);
      await expect(nav.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
      await page.getByRole('link', { name: 'Wróć na start' }).click();
      await expect(page).toHaveURL(/\/prototype$/);
    });
  }

  test('the name links home', async ({ page }) => {
    await page.goto('/prototype/skrzynka');
    await page.getByRole('link', { name: /Sprawnie/ }).click();
    await expect(page).toHaveURL(/\/prototype$/);
  });

  test('fits on one row on a 390 px phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/prototype');
    const box = await page.getByRole('banner').boundingBox();
    expect(box?.height).toBeLessThan(80);
  });

  for (const path of ['/prototype/skrzynka', '/prototype/powiadomienia']) {
    test(`axe: no WCAG A/AA violations on ${path}`, async ({ page }) => {
      // Never mid-intro: faded-in elements give false passes or contrast flakes.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
