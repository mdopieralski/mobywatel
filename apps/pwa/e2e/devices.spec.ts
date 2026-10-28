import { expect, test } from './fixtures.ts';

// Navigable on every device class: phones upright and on their side, tablets, 400% zoom. Each test sets
// its own window size, so it runs the same in every project.
const seed = (value: object) => localStorage.setItem('settings:v1', JSON.stringify(value));

async function inView(page: import('@playwright/test').Page, name: string) {
  const box = await page.getByRole('navigation', { name }).boundingBox();
  const height = page.viewportSize()?.height ?? 0;
  return !!box && box.y >= 0 && box.y + box.height <= height + 1;
}

test.describe('devices', () => {
  test('a tablet on its side shows the whole app, tab bar included', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/prototype');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // The project's pointer decides the layout: touch gets the full-height column, a mouse the phone
    // preview. Either way the tab bar is on screen and the page itself doesn't scroll.
    expect(await inView(page, 'Menu główne')).toBe(true);
    const overflow = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('a short laptop window keeps the tab bar on screen', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 650 });
    await page.goto('/prototype');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await inView(page, 'Menu główne')).toBe(true);
  });

  test('a phone on its side scrolls the page, so every category and the tab bar are reachable', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/prototype');
    const tiles = page.getByRole('main').getByRole('link');
    const last = tiles.last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport({ ratio: 0.95 });
    const nav = page.getByRole('navigation', { name: 'Menu główne' });
    await nav.scrollIntoViewIfNeeded();
    await expect(nav).toBeInViewport({ ratio: 0.95 });
    await nav.getByRole('link', { name: 'Ustawienia' }).click();
    await expect(page).toHaveURL(/\/prototype\/ustawienia$/);
  });

  test('at 400% zoom (320 × 180) the start screen shows content, not just bars', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 180 });
    await page.goto('/prototype');
    const firstTile = page.getByRole('main').getByRole('listitem').first();
    await firstTile.scrollIntoViewIfNeeded();
    await expect(firstTile).toBeInViewport();
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(sideways).toBeLessThanOrEqual(0);
  });

  for (const senior of [false, true]) {
    test(`the header is one row at 320 px${senior ? ' in senior mode' : ''}`, async ({ page }) => {
      await page.addInitScript(seed, { senior });
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/prototype');
      const banner = page.getByRole('banner');
      const home = banner.getByRole('link', { name: /Sprawnie/ });
      const language = banner.getByRole('button', { name: /PL/ });
      const [a, b] = [await home.boundingBox(), await language.boundingBox()];
      expect(Math.abs((a?.y ?? 0) - (b?.y ?? 100))).toBeLessThan(24);
    });
  }

  test('the language list fits a phone on its side and every language can be picked', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/prototype');
    await page.getByRole('banner').getByRole('button', { name: /PL/ }).click();
    const list = page.getByRole('banner').getByRole('list');
    const box = await list.boundingBox();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(390);
    const last = list.getByRole('button', { name: 'Беларуская' });
    await last.scrollIntoViewIfNeeded();
    await last.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'be');
  });

  test('a tablet gets three columns of categories (two in senior mode)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/prototype');
    const tops = async () => {
      const items = page.getByRole('main').getByRole('list').first().getByRole('listitem');
      const ys = await items.evaluateAll((els) => els.slice(0, 3).map((e) => e.getBoundingClientRect().y));
      return new Set(ys.map(Math.round)).size;
    };
    expect(await tops()).toBe(1);
    await page.evaluate(() => {
      localStorage.setItem('settings:v1', JSON.stringify({ senior: true }));
    });
    await page.reload();
    expect(await tops()).toBe(2);
  });

  test('no category list scrolls sideways at 320 px, senior, German', async ({ page }) => {
    await page.addInitScript(seed, { senior: true, locale: 'de' });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/prototype');
    const hrefs = await page
      .getByRole('main')
      .getByRole('link')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')).filter((h) => h?.includes('/kategorie/')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await page.goto(href as string);
      const extra = await page.getByRole('main').evaluate((main) => main.scrollWidth - main.clientWidth);
      expect(extra, href as string).toBeLessThanOrEqual(0);
    }
  });

  test('the tab bar always shows where you are', async ({ page }) => {
    await page.goto('/prototype/do-zalatwienia');
    const nav = page.getByRole('navigation', { name: 'Menu główne' });
    await expect(nav.getByRole('link', { name: 'Start' })).toHaveAttribute('aria-current', 'true');
    await nav.getByRole('link', { name: 'Ustawienia' }).click();
    await expect(nav.getByRole('link', { name: 'Ustawienia' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Start' })).not.toHaveAttribute('aria-current');
  });

  test('"Do załatwienia" has a way back that the keyboard reaches', async ({ page }) => {
    await page.goto('/prototype/do-zalatwienia');
    const back = page.getByRole('main').getByRole('link', { name: /Wróć na start/ });
    await back.focus();
    await expect(back).toBeFocused();
    await back.click();
    await expect(page).toHaveURL(/\/prototype$/);
  });
});
