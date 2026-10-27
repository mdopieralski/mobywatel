import { expect, test } from './fixtures.ts';

// The boot loader in index.html covers the first paint, then clears itself after 1500 ms.
test('the boot loader shows on load and is gone soon after', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' });
  const loader = page.locator('#boot-loader');
  await expect(loader).toBeAttached();
  await expect(loader).toHaveAttribute('aria-hidden', 'true');
  await expect(loader).toHaveCount(0, { timeout: 4000 });
  await expect(page.locator('[data-disclaimer]').first()).toBeVisible();
});
