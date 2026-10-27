import { expect, test } from '@playwright/test';

// After the first visit the prototype must work without network (pwa-platform skill).
test('works offline after the first load, including deep links', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // The first load is not controlled by the SW yet; a reload is.
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('[data-disclaimer]')).toBeVisible();
  await page.goto('/ustawienia');
  await expect(page.getByRole('heading', { level: 1, name: 'Ustawienia' })).toBeVisible();
  // The city list for Bilet miejski loads on its own, never opened before: it is in the cache too.
  await page.goto('/kategorie/podroz/bilet-miejski');
  await page.getByRole('searchbox', { name: 'Nazwa miasta' }).fill('gdyn');
  await expect(page.getByRole('button', { name: /^Gdynia/ })).toBeVisible();
});

test('the web app manifest is valid for install', async ({ request }) => {
  const res = await request.get('/manifest.webmanifest');
  expect(res.ok()).toBe(true);
  const manifest = await res.json();
  expect(manifest.lang).toBe('pl');
  expect(manifest.display).toBe('standalone');
  expect(manifest.name).not.toMatch(/^mObywatel$/i);
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true);
});
