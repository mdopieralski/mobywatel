import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

// Someone who doesn't read Polish: find the language switch, pick theirs, and the whole app follows.
test.describe('languages', () => {
  test('the header switch lists every language; Ukrainian applies everywhere and persists', async ({
    page,
  }) => {
    await page.goto('/prototype');
    const button = page.getByRole('button', { name: /Zmień język/ });
    await expect(button).toHaveAccessibleName(/^PL/);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const list = page.getByRole('list').filter({ has: page.getByRole('button', { name: 'Polski' }) });
    await expect(list.getByRole('button')).toHaveCount(8);
    await expect(list.getByRole('button', { name: 'Polski' })).toHaveAttribute('aria-current', 'true');
    await expect(list.getByRole('button', { name: 'Polski' })).toBeFocused();

    await list.getByRole('button', { name: 'Українська' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.getByRole('button', { name: /Змінити мову/ })).toBeFocused();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Твої справи');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.locator('[data-disclaimer]')).toContainText('Неофіційний прототип');
    await expect(page.locator('[data-disclaimer]')).toContainText('вигадані');
  });

  test('the switch works from the keyboard: Enter, a letter of the code, Enter; Escape closes', async ({
    page,
  }) => {
    await page.goto('/prototype');
    const button = page.getByRole('button', { name: /Zmień język/ });
    await button.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();

    await page.keyboard.press('Enter');
    await page.keyboard.press('d');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  });

  test('the full picker is still in Settings', async ({ page }) => {
    await page.goto('/prototype/ustawienia');
    await page.getByRole('radio', { name: 'Українська' }).check();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Налаштування');
    await expect(page).toHaveTitle('Налаштування – Sprawnie');
  });

  test('a shared link with ?lang= opens in that language', async ({ page }) => {
    await page.goto('/prototype?lang=de');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('[data-disclaimer]')).toContainText('Inoffizieller Prototyp');
    await expect(page).toHaveTitle('Deine Anliegen – Sprawnie');
  });

  for (const locale of ['en', 'uk', 'de', 'cs', 'sk', 'lt', 'be']) {
    test(`axe: no WCAG A/AA violations in ${locale}`, async ({ page }) => {
      // Never mid-intro: faded-in elements give false passes or contrast flakes.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(
        (l) => localStorage.setItem('settings:v1', JSON.stringify({ locale: l })),
        locale
      );
      for (const path of ['/prototype', '/prototype/ustawienia']) {
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
    await page.goto('/prototype/ustawienia');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('320 px wide, senior mode: the open language list stays on screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.addInitScript(() =>
      localStorage.setItem('settings:v1', JSON.stringify({ locale: 'lt', senior: true }))
    );
    await page.goto('/prototype');
    await page.getByRole('button', { name: /Keisti kalbą/ }).click();
    const box = await page.getByRole('button', { name: 'Беларуская' }).boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
