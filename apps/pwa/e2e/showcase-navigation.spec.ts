import { expect, test } from './fixtures.ts';

// Desktop page navigation across window sizes and history (desktop-chrome and desktop-safari projects).
test.describe('desktop page navigation', () => {
  test('Back to "/" after resizing across the breakpoint shows the landing page again', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('iframe[name="phone"]')).toBeAttached();
    // Narrow: the one-column landing page; its button opens the app full screen, then a category there.
    await page.setViewportSize({ width: 700, height: 900 });
    await expect(page.locator('iframe[name="phone"]')).toHaveCount(0);
    await page.locator('#wyprobuj').getByRole('link', { name: 'Zobacz prototyp' }).click();
    await expect(page).toHaveURL(/\/prototype$/);
    await page.getByRole('main').getByRole('link').first().click();
    await expect(page).toHaveURL(/\/prototype\/kategorie\//);
    // Wide again: the mockup for that screen. Back to "/" must be the landing page, not the mockup.
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole('heading', { level: 1, name: 'Prototyp' })).toBeAttached();
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Prototyp' })).not.toBeAttached();
    await expect(page.locator('#section-hero')).toBeVisible();
  });

  test('a tap inside the landing page phone does not scroll the page to the phone', async ({ page }) => {
    await page.goto('/');
    const app = page.frameLocator('iframe[name="phone"]');
    await app
      .getByRole('navigation', { name: 'Menu główne' })
      .getByRole('link', { name: 'Ustawienia' })
      .click();
    await expect(app.getByRole('heading', { level: 1, name: 'Ustawienia' })).toBeVisible();
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    const before = await page.evaluate(() => scrollY);
    // Back steps the phone's own history; the outer page never loads, so don't wait for a load event.
    await page.evaluate(() => history.back());
    await expect(app.getByRole('heading', { level: 1, name: 'Twoje sprawy' })).toBeVisible();
    expect(await page.evaluate(() => scrollY)).toBe(before);
  });
});
