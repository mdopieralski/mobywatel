import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

// The start screen modelled on the reference: wallet, the most urgent matter, "what do you need?".
test.describe('categories and documents', () => {
  test('shows the 14 category cards in order, names only', async ({ page }) => {
    await page.goto('/prototype');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Twoje sprawy');
    const stack = page.getByRole('list', { name: 'Twoje sprawy' });
    const cards = stack.getByRole('link');
    await expect(cards).toHaveCount(14);
    await expect(cards.first()).toHaveAccessibleName('Bezpieczeństwo');
    await expect(cards.last()).toHaveAccessibleName('Reszta');
    await expect(stack.getByRole('link', { name: 'Pojazdy', exact: true })).toBeVisible();
    await expect(page.locator('[data-disclaimer]')).toContainText('fikcyjne');
  });

  test('Bezpieczeństwo lists its 7 matters; each opens a "Wkrótce" screen with a way back', async ({
    page,
  }) => {
    await page.goto('/prototype/kategorie/bezpieczenstwo');
    const menu = page.getByRole('navigation', { name: 'Co możesz załatwić' });
    await expect(menu.getByRole('link')).toHaveText([
      'Zastrzeż PESEL',
      'Zastrzeż dokument',
      'Bezpiecznie w sieci',
      'Sprawdź dowód',
      'Sprawdź PESEL',
      'Szkolenia obronne',
      'Poradnik bezpieczeństwa',
    ]);
    await menu.getByRole('link', { name: 'Sprawdź dowód' }).click();
    await expect(page).toHaveURL(/\/prototype\/kategorie\/bezpieczenstwo\/sprawdz-dowod$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Sprawdź dowód' })).toBeFocused();
    await expect(page.getByText('Wkrótce', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Bezpieczeństwo' }).click();
    await expect(page).toHaveURL(/\/prototype\/kategorie\/bezpieczenstwo$/);
  });

  test('Pojazdy lists its 6 matters in order, and mStłuczka opens its own screen', async ({ page }) => {
    await page.goto('/prototype/kategorie/pojazdy');
    const menu = page.getByRole('navigation', { name: 'Co możesz załatwić' });
    await expect(menu.getByRole('link')).toHaveText([
      'mStłuczka',
      'Sprawdź OC',
      'Punkty karne',
      'Uprawnienia kierowcy',
      'Historia pojazdu',
      'Mandaty',
    ]);
    await menu.getByRole('link', { name: 'mStłuczka' }).click();
    await expect(page).toHaveURL(/\/prototype\/kategorie\/pojazdy\/mstluczka$/);
    await expect(page.getByRole('heading', { level: 1, name: 'mStłuczka' })).toBeFocused();
  });

  test('ZUS lists its 5 matters in order', async ({ page }) => {
    await page.goto('/prototype/kategorie/zus');
    await expect(page.getByRole('navigation', { name: 'Co możesz załatwić' }).getByRole('link')).toHaveText([
      'Składki',
      'Emerytura',
      'Zwolnienie lekarskie',
      '800 plus',
      'Wizyta w ZUS',
    ]);
  });

  test('an unknown matter is a not-found page', async ({ page }) => {
    await page.goto('/prototype/kategorie/pojazdy/zastrzez-pesel');
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Zastrzeż PESEL');
  });

  test('category → document → back to the category', async ({ page }) => {
    await page.goto('/prototype');
    await page.getByRole('link', { name: /^Bezpieczeństwo/ }).click();
    await expect(page).toHaveURL(/\/prototype\/kategorie\/bezpieczenstwo$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Bezpieczeństwo' })).toBeFocused();
    await page.getByRole('link', { name: /Dowód osobisty.*Ważny do/ }).click();
    await expect(page).toHaveURL(/\/prototype\/dokumenty\/dowod$/);
    await expect(page.getByText('PRO 123456')).toBeVisible();
    await expect(page.locator('[data-watermark="PROTOTYP – nie jest dokumentem"]')).toBeVisible();
    await expect(page.locator('[data-disclaimer]')).toContainText('Nieoficjalny prototyp');
    await page.getByRole('link', { name: 'Wróć' }).click();
    await expect(page).toHaveURL(/\/prototype\/kategorie\/bezpieczenstwo$/);
  });

  test('a category without documents or matters still explains itself', async ({ page }) => {
    await page.goto('/prototype/kategorie/zdrowie');
    await expect(page.getByRole('heading', { level: 1, name: 'Zdrowie' })).toBeVisible();
    await expect(page.getByText('Recepty, skierowania')).toBeVisible();
    await expect(page.getByText('Wkrótce załatwisz tu sprawy')).toBeVisible();
  });

  test('Podróż (formerly Bilety) lists its 5 matters in order', async ({ page }) => {
    await page.goto('/prototype/kategorie/podroz');
    await expect(page.getByRole('heading', { level: 1, name: 'Podróż' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Co możesz załatwić' }).getByRole('link')).toHaveText([
      'Odyseusz',
      'Bezpieczny autobus',
      'Bilkom',
      'Karta MKA',
      'Bilet miejski',
    ]);
  });

  test('the reminder tile names the deadline and opens the list', async ({ page }) => {
    await page.goto('/prototype');
    const tile = page.getByRole('link', { name: /Do załatwienia: Pismo z urzędu skarbowego Odpowiedź do/ });
    await expect(tile).toContainText('i 2 inne sprawy');
    await tile.click();
    await expect(page).toHaveURL(/\/prototype\/do-zalatwienia$/);
    await expect(page.getByRole('listitem')).toHaveCount(3);
    await expect(page.getByText('Pilne')).toBeVisible();
  });

  test('"Co chcesz załatwić?" is a link to the assistant placeholder, not a text field', async ({ page }) => {
    await page.goto('/prototype');
    await expect(page.getByRole('textbox')).toHaveCount(0);
    await page.getByRole('link', { name: 'Co chcesz załatwić?' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Asystent' })).toBeVisible();
  });

  test('an unknown document or category shows the not-found page', async ({ page }) => {
    await page.goto('/prototype/kategorie/nie-ma');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nie ma takiej strony');
    await page.goto('/prototype/dokumenty/paszport');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nie ma takiej strony');
  });

  for (const [label, settings] of [
    ['320 px, senior, German', { senior: true, locale: 'de' }],
    ['320 px, Lithuanian', { locale: 'lt' }],
  ] as const) {
    test(`${label}: no sideways scrolling and every card title is readable`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.addInitScript((s) => localStorage.setItem('settings:v1', JSON.stringify(s)), settings);
      await page.goto('/prototype');
      const overflow = await page.evaluate(() => {
        const main = document.querySelector('main');
        return main ? main.scrollWidth - main.clientWidth : 0;
      });
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  for (const path of [
    '/prototype',
    '/prototype/kategorie/pojazdy',
    '/prototype/kategorie/podroz',
    '/prototype/kategorie/zus',
    '/prototype/kategorie/bezpieczenstwo/zastrzez-pesel',
    '/prototype/dokumenty/dowod',
    '/prototype/do-zalatwienia',
    '/prototype/asystent',
  ]) {
    for (const senior of [false, true]) {
      test(`axe: no WCAG A/AA violations on ${path}${senior ? ' (senior)' : ''}`, async ({ page }) => {
        // Never mid-intro: faded-in elements give false passes or contrast flakes.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(
          (s) => localStorage.setItem('settings:v1', JSON.stringify({ senior: s })),
          senior
        );
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    }
  }
});
