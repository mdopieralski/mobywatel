import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

const URL = '/prototype/kategorie/zus/wizyta-w-zus';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

// Wizyta w ZUS end to end: office → time → confirm → booked, and it survives a reload.
test.describe('ZUS visit', () => {
  test('book a visit, see it, and keep it after a reload', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByText('Wkrótce')).toHaveCount(0);
    await page.getByRole('button', { name: /Pod Zegarem/ }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Wybierz termin' })).toBeFocused();
    await page.getByRole('listitem').getByRole('button').first().click();

    const confirm = page.getByRole('region', { name: 'Umawiasz wizytę w ZUS' });
    await expect(confirm.getByRole('heading', { level: 2 })).toBeFocused();
    await expect(confirm.getByText('Kalisz')).toBeVisible();
    await expect(confirm.getByText('Stan na')).toBeVisible();
    await confirm.getByRole('button', { name: 'Umów wizytę' }).click();

    const booked = page.getByRole('region', { name: 'Wizyta umówiona' });
    await expect(booked.getByRole('heading', { level: 2 })).toBeFocused();
    await expect(booked.getByText(/^PROTO-ZUS-\d{4}$/)).toBeVisible();

    await page.reload();
    await expect(page.getByRole('region', { name: 'Wizyta umówiona' }).getByText('Kalisz')).toBeVisible();

    // "Umów inną wizytę" drops the old one, also after a reload.
    await page.getByRole('button', { name: 'Umów inną wizytę' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Wybierz placówkę' })).toBeFocused();
    await page.reload();
    await expect(page.getByRole('heading', { level: 2, name: 'Wybierz placówkę' })).toBeVisible();
  });

  test('cancel says nothing was sent and saves nothing', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: /Przy Porcie/ }).click();
    const slot = page.getByRole('listitem').getByRole('button').nth(2);
    const name = await slot.getAttribute('aria-label');
    await slot.click();
    await page.getByRole('button', { name: 'Anuluj' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'Nic nie zostało wysłane' })).toBeVisible();
    await expect(page.getByRole('button', { name: name ?? '' })).toBeFocused();
    expect(await page.evaluate(() => localStorage.getItem('demo:zus-visit'))).toBeNull();
  });

  test('senior mode: the confirm button is at least 56 px tall', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('settings:v1', JSON.stringify({ senior: true })));
    await page.goto(URL);
    await page.getByRole('button', { name: /Przy Parku/ }).click();
    await page.getByRole('listitem').getByRole('button').first().click();
    const box = await page.getByRole('button', { name: 'Umów wizytę' }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(56);
  });

  for (const lang of ['', '?lang=de']) {
    test(`axe: no WCAG A/AA violations on each step${lang ? ` (${lang})` : ''}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${URL}${lang}`);
      const check = async () =>
        expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations).toEqual([]);
      await page.getByRole('listitem').first().getByRole('button').click();
      await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
      await check();
      await page.getByRole('listitem').getByRole('button').first().click();
      await expect(page.locator('[data-confirm-card]')).toBeVisible();
      await check();
      await page.locator('[data-confirm-card]').getByRole('button').first().click();
      await expect(page.getByText(/^PROTO-ZUS-/)).toBeVisible();
      await check();
    });
  }
});

// A phone set east of Warsaw: the days offered are still Monday to Friday (dates are shown in Warsaw time).
test.describe('ZUS visit on a phone in another time zone', () => {
  test.use({ timezoneId: 'Asia/Tokyo' });

  test('never offers a Saturday or a Sunday', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: /Pod Zegarem/ }).click();
    const days = await page.getByRole('heading', { level: 3 }).allTextContents();
    expect(days).toHaveLength(8);
    for (const day of days) {
      expect(day).not.toMatch(/sobota|niedziela/);
    }
  });
});
