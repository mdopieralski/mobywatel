import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

// Bilet miejski: pick your town from a list that ships with the app (works offline, sends nothing).
test.describe('city picker', () => {
  test('search without Polish letters, choose a town, keep it after a reload, change it', async ({
    page,
  }) => {
    await page.goto('/prototype/kategorie/podroz/bilet-miejski');
    await expect(page.getByText('Największe miasta:')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Warszawa/ })).toBeVisible();

    await page.getByRole('searchbox', { name: 'Nazwa miasta' }).fill('lodz');
    await expect(page.getByRole('status').filter({ hasText: 'Pasuje' })).toBeVisible();
    await expect(page.getByRole('listitem').first()).toHaveText(/^Łódź/);
    await page.getByRole('button', { name: /^Łódź/ }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Łódź' })).toBeFocused();
    await expect(page.getByText('w mieście Łódź dodamy wkrótce')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { level: 2, name: 'Łódź' })).toBeVisible();

    await page.getByRole('button', { name: 'Zmień miasto' }).click();
    await expect(page.getByRole('searchbox', { name: 'Nazwa miasta' })).toBeFocused();
  });

  test('a town that is not on the list says so', async ({ page }) => {
    await page.goto('/prototype/kategorie/podroz/bilet-miejski');
    await page.getByRole('searchbox', { name: 'Nazwa miasta' }).fill('Atlantyda');
    await expect(page.getByText('Nie ma takiego miasta na liście')).toBeVisible();
  });

  test('works offline-first: searching sends no request', async ({ page }) => {
    await page.goto('/prototype/kategorie/podroz/bilet-miejski');
    await expect(page.getByRole('searchbox')).toBeVisible();
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.getByRole('searchbox').fill('krak');
    await expect(page.getByRole('button', { name: /^Kraków/ })).toBeVisible();
    expect(requests).toEqual([]);
  });

  for (const senior of [false, true]) {
    test(`axe: no WCAG A/AA violations while picking and after${senior ? ' (senior)' : ''}`, async ({
      page,
    }) => {
      // Never mid-intro: faded-in elements give false passes or contrast flakes.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(
        (s) => localStorage.setItem('settings:v1', JSON.stringify({ senior: s })),
        senior
      );
      await page.goto('/prototype/kategorie/podroz/bilet-miejski');
      await page.getByRole('searchbox').fill('gda');
      const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
      expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([]);
      await page.getByRole('button', { name: /^Gdańsk/ }).click();
      expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([]);
    });
  }
});
