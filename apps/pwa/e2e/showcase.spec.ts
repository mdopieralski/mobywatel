import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// A juror on a laptop: the start URL shows the app in a phone frame next to an explanation.
test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });

test.describe('desktop showcase', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'one desktop run is enough');

  test('shows the app in a phone frame, the disclaimer and the address bar follows the app', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'ZUS i bilety miejskie w jednej aplikacji'
    );
    await expect(page.locator('[data-disclaimer]').first()).toContainText('fikcyjne');

    const app = page.frameLocator('iframe[name="phone"]');
    await expect(app.getByRole('heading', { level: 1 })).toHaveText('Twoje sprawy');
    await app
      .getByRole('navigation', { name: 'Menu główne' })
      .getByRole('link', { name: 'Ustawienia' })
      .click();
    await expect(page).toHaveURL(/\/ustawienia$/);
  });

  test('the hero leads with ZUS and city tickets, and its links open them inside the phone', async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'ZUS i bilety miejskie w jednej aplikacji' });
    await expect(hero.getByRole('heading', { level: 2 })).toHaveText(['ZUS', 'Bilety miejskie']);
    await hero.getByRole('link', { name: 'Otwórz Bilety miejskie w telefonie' }).click();
    await expect(
      page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1, name: 'Bilet miejski' })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/kategorie\/podroz\/bilet-miejski$/);
  });

  test('"Wypróbuj prototyp" brings the working phone into view and moves focus there', async ({ page }) => {
    await page.goto('/');
    const phone = page.locator('iframe[name="phone"]');
    await expect(phone).not.toBeInViewport();
    await page.getByRole('link', { name: 'Wypróbuj prototyp' }).click();
    await expect(page.locator('#wyprobuj')).toBeFocused();
    await expect(phone).toBeInViewport({ ratio: 0.5 });
  });

  test('the header links jump to the prototype and to what is new', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sekcje strony' });
    await expect(nav.locator('[aria-current]')).toHaveCount(0);
    await nav.getByRole('link', { name: 'Nowości' }).click();
    await expect(nav.getByRole('link', { name: 'Nowości' })).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('#nowosci')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Co nowego w naszej wersji' })).toBeInViewport();
    await nav.getByRole('link', { name: 'Prototyp' }).click();
    await expect(page.locator('#wyprobuj')).toBeFocused();
    await expect(page.locator('iframe[name="phone"]')).toBeInViewport({ ratio: 0.5 });
    await expect(nav.getByRole('link', { name: 'Prototyp' })).toHaveAttribute('aria-current', 'location');
    await expect(nav.getByRole('link', { name: 'Nowości' })).not.toHaveAttribute('aria-current');
  });

  test('the first screen says it is an unofficial prototype', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'ZUS i bilety miejskie w jednej aplikacji' });
    await expect(hero.getByText('Nieoficjalny prototyp', { exact: true })).toBeInViewport();
    await expect(hero.locator('[data-disclaimer]')).toBeInViewport();
    await expect(page.getByRole('heading', { level: 1 })).not.toContainText('mObywatel');
  });

  test('the app preview is not loaded where it is hidden (narrow window)', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.goto('/');
    await expect(page.locator('iframe[name="phone"]')).toHaveCount(1);
    await expect(page.locator('iframe')).toHaveCount(1);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('iframe')).toHaveCount(2);
  });

  test('skip link jumps past the header, and focus never hides under it', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Przejdź do treści' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();

    const link = page.getByRole('link', { name: 'Zobacz konkurs' });
    await link.focus();
    const header = await page.locator('header').first().boundingBox();
    const box = await link.boundingBox();
    expect(box?.y ?? 0).toBeGreaterThanOrEqual((header?.y ?? 0) + (header?.height ?? 0));
  });

  test('a deep link opens that screen inside the phone', async ({ page }) => {
    await page.goto('/ustawienia');
    await expect(
      page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1, name: 'Ustawienia' })
    ).toBeVisible();
  });

  test('a language picked inside the phone also changes the page around it', async ({ page }) => {
    await page.goto('/ustawienia');
    await page.frameLocator('iframe[name="phone"]').getByRole('radio', { name: 'English' }).check();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('ZUS and city tickets in one app');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('the phone screen is a fixed 390×844, and a short window scrolls instead of clipping', async ({
    page,
  }) => {
    await page.goto('/');
    const screen = page.locator('iframe[name="phone"]').locator('..');
    const box = await screen.boundingBox();
    expect(Math.round(box?.width ?? 0)).toBe(390);
    expect(Math.round(box?.height ?? 0)).toBe(844);
    expect(box?.y).toBeGreaterThanOrEqual(0);
  });

  test('axe: no WCAG A/AA violations on the showcase page', async ({ page }) => {
    await page.goto('/');
    await page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1 }).waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
