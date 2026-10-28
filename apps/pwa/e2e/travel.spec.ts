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
    await expect(page.getByRole('heading', { level: 2, name: 'Wybierz bilet' })).toBeVisible();

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

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

/** A town already chosen, so each test starts at the ticket list. */
async function atTicketList(page: import('@playwright/test').Page, lang = '') {
  await page.addInitScript(() => localStorage.setItem('demo:city', 'Łódź|łódzkie'));
  await page.goto(`/prototype/kategorie/podroz/bilet-miejski${lang}`);
}

// Bilet miejski end to end: choose a ticket, confirm, see it, keep it after a reload.
test.describe('city ticket', () => {
  test('buy a ticket, see it, and keep it after a reload', async ({ page }) => {
    await atTicketList(page);
    await page.getByRole('button', { name: /^Bilet 20-minutowy/ }).click();

    const confirm = page.getByRole('region', { name: 'Kupujesz bilet w mieście Łódź' });
    await expect(confirm.getByRole('heading', { level: 2 })).toBeFocused();
    await expect(confirm.getByText('Stan na')).toBeVisible();
    await expect(confirm.getByText('2,22 zł')).toBeVisible();
    await confirm.getByRole('button', { name: 'Kup bilet' }).click();

    const ticket = page.getByRole('region', { name: 'Twój bilet' });
    await expect(ticket.getByRole('heading', { level: 2 })).toBeFocused();
    await expect(ticket.getByText('Bilet 20-minutowy')).toBeVisible();
    await expect(page.locator('[data-watermark]')).toBeVisible();
    await expect(page.locator('[data-disclaimer]')).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole('region', { name: 'Twój bilet' }).getByText('Bilet 20-minutowy')
    ).toBeVisible();
  });

  test('cancel says nothing was sent and saves nothing', async ({ page }) => {
    await atTicketList(page);
    await page.getByRole('button', { name: /^Bilet dobowy/ }).click();
    await page.getByRole('button', { name: 'Anuluj' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'Nic nie zostało wysłane' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Bilet dobowy/ })).toBeFocused();
    expect(await page.evaluate(() => localStorage.getItem('demo:ticket'))).toBeNull();

    await page.reload();
    await expect(page.getByRole('heading', { level: 2, name: 'Wybierz bilet' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Twój bilet' })).toHaveCount(0);
  });

  test('Escape on the confirm card cancels', async ({ page }) => {
    await atTicketList(page);
    await page.getByRole('button', { name: /^Bilet jednorazowy/ }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('status').filter({ hasText: 'Nic nie zostało wysłane' })).toBeVisible();
  });

  test('senior mode: the confirm button is at least 56 px tall', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('settings:v1', JSON.stringify({ senior: true })));
    await atTicketList(page);
    await page.getByRole('button', { name: /^Bilet 75-minutowy/ }).click();
    const box = await page.getByRole('button', { name: 'Kup bilet' }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(56);
  });

  for (const lang of ['', '?lang=uk']) {
    test(`axe: no WCAG A/AA violations on the confirm card and the ticket${lang ? ` (${lang})` : ''}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await atTicketList(page, lang);
      await page.locator('[data-confirm-card]').or(page.getByRole('list')).first().waitFor();
      await page.getByRole('listitem').first().getByRole('button').click();
      await expect(page.locator('[data-confirm-card]')).toBeVisible();
      expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations).toEqual([]);
      await page.locator('[data-confirm-card]').getByRole('button').first().click();
      await expect(page.locator('[data-watermark]')).toBeVisible();
      expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations).toEqual([]);
    });
  }
});
