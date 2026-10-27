import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

// A juror on a laptop: "/" is the landing page with the app in a phone frame; /prototype/* is the app in a
// phone mockup with an address per screen. Runs in the desktop-chrome and desktop-safari projects
// (playwright.config.ts).

test.describe('desktop showcase', () => {
  test('the landing page shows the app in a phone frame and the disclaimer, and keeps its address', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('ZUS i bilety miejskie w mObywatel');
    await expect(page.locator('[data-disclaimer]').first()).toContainText('fikcyjne');

    const app = page.frameLocator('iframe[name="phone"]');
    await expect(app.getByRole('heading', { level: 1 })).toHaveText('Twoje sprawy');
    await app
      .getByRole('navigation', { name: 'Menu główne' })
      .getByRole('link', { name: 'Ustawienia' })
      .click();
    await expect(app.getByRole('heading', { level: 1, name: 'Ustawienia' })).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test('/prototype shows the app in a phone mockup, and the address bar follows the app', async ({
    page,
  }) => {
    await page.goto('/prototype');
    await expect(page.getByRole('heading', { level: 1, name: 'Prototyp' })).toBeAttached();
    await expect(page.locator('[data-disclaimer]').first()).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Sekcje strony' });
    await expect(nav.getByRole('link', { name: 'Prototyp' })).toHaveAttribute('aria-current', 'page');
    const app = page.frameLocator('iframe[name="phone"]');
    await expect(app.getByRole('heading', { level: 1 })).toHaveText('Twoje sprawy');
    await app
      .getByRole('navigation', { name: 'Menu główne' })
      .getByRole('link', { name: 'Ustawienia' })
      .click();
    await expect(page).toHaveURL(/\/prototype\/ustawienia$/);
  });

  test('"Nowości" on /prototype goes back to that section of the landing page', async ({ page }) => {
    await page.goto('/prototype');
    await page.getByRole('link', { name: 'Nowości' }).click();
    await expect(page).toHaveURL(/\/#nowosci$/);
    await expect(page.getByRole('heading', { name: 'Co nowego w naszej wersji' })).toBeInViewport();
  });

  test('the hero leads with ZUS and city tickets', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'ZUS i bilety miejskie w mObywatel' });
    await expect(hero.getByRole('heading', { level: 2 })).toHaveText(['ZUS', 'Bilety miejskie']);
  });

  test('the "Zobacz prototyp" button in the hero brings the working phone into view and moves focus there', async ({
    page,
  }) => {
    await page.goto('/');
    const phone = page.locator('iframe[name="phone"]');
    await expect(phone).not.toBeInViewport();
    // Scoped to the hero: the header nav has a "Prototyp" link too.
    await page
      .getByRole('region', { name: /^ZUS i bilety/ })
      .getByRole('link', { name: 'Zobacz prototyp' })
      .click();
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

  test('the page and the app in the phone say it is an unofficial prototype', async ({ page }) => {
    await page.goto('/');
    // The page footer (the hero no longer carries it: user choice 2026-10-27).
    await expect(page.getByRole('contentinfo').locator('[data-disclaimer]')).toContainText('fikcyjne');
    // The app's own start screen inside the phone.
    await expect(page.frameLocator('iframe[name="phone"]').locator('[data-disclaimer]')).toBeAttached();
  });

  test('the app preview is not loaded where it is hidden (narrow window)', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.goto('/');
    await expect(page.locator('iframe[name="phone"]')).toHaveCount(1);
    await expect(page.locator('iframe')).toHaveCount(1);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('iframe')).toHaveCount(2);
  });

  test('skip link jumps past the header, and focus never hides under it', async ({ page, browserName }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Safari on a Mac moves to links with Option+Tab (plain Tab only visits form fields by default).
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    const skip = page.getByRole('link', { name: 'Przejdź do treści' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();

    // From the bottom of the page, focus a link further up: it must scroll in below the pinned header.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const link = page
      .getByRole('region', { name: /^ZUS i bilety/ })
      .getByRole('link', { name: 'Zobacz prototyp' });
    await link.focus();
    const header = await page.locator('header').first().boundingBox();
    // Wait out smooth scrolling.
    await expect
      .poll(async () => (await link.boundingBox())?.y ?? -1)
      .toBeGreaterThanOrEqual((header?.y ?? 0) + (header?.height ?? 0));
  });

  test('the phone section has a heading, so moving by headings finds it', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: 'Prototyp' });
    await expect(section.getByRole('heading', { level: 2, name: 'Prototyp' })).toBeAttached();
    await expect(section.locator('iframe[name="phone"]')).toBeAttached();
  });

  test('a deep link opens that screen inside the phone', async ({ page }) => {
    await page.goto('/prototype/ustawienia');
    await expect(
      page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1, name: 'Ustawienia' })
    ).toBeVisible();
  });

  test('an old link from before /prototype opens the same screen under it', async ({ page }) => {
    await page.goto('/ustawienia');
    await expect(page).toHaveURL(/\/prototype\/ustawienia$/);
    await expect(
      page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1, name: 'Ustawienia' })
    ).toBeVisible();
  });

  test('a language picked inside the phone also changes the page around it', async ({ page }) => {
    await page.goto('/prototype/ustawienia');
    await page.frameLocator('iframe[name="phone"]').getByRole('radio', { name: 'English' }).check();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prototype');
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

  for (const path of ['/', '/prototype']) {
    test(`axe: no WCAG A/AA violations on ${path}`, async ({ page }) => {
      // Never mid-intro: faded-in elements give false passes or contrast flakes.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1 }).waitFor();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

// A tablet is a big screen with touch: it gets the app full screen, like a phone.
test.describe('tablet', () => {
  test.use({ viewport: { width: 1180, height: 820 }, hasTouch: true });

  test('/prototype and "/" open the app itself, not the phone mockup', async ({ page }) => {
    await page.goto('/prototype');
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Twoje sprawy');
    await page.goto('/');
    await expect(page).toHaveURL(/\/prototype$/);
    await expect(page.locator('iframe')).toHaveCount(0);
  });
});
