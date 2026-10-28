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

  test('the hero leads with ZUS, city tickets and neighbouring languages', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'ZUS i bilety miejskie w mObywatel' });
    await expect(hero.getByText('Nieoficjalny prototyp', { exact: true })).toBeVisible();
    await expect(hero.getByRole('heading', { level: 2 })).toHaveText([
      'Mobilny ZUS',
      'Bilety miejskie',
      'Języki sąsiedzkie',
    ]);
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

  test('the header links jump to the start, the prototype and what is new', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sekcje strony' });
    await expect(nav.getByRole('link').first()).toHaveText('Start');
    await expect(nav.getByRole('link', { name: 'Start' })).toHaveAttribute('aria-current', 'location');
    await nav.getByRole('link', { name: 'Nowości' }).click();
    await expect(nav.getByRole('link', { name: 'Nowości' })).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('#nowosci')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Co nowego w naszej wersji' })).toBeInViewport();
    await nav.getByRole('link', { name: 'Prototyp' }).click();
    await expect(page.locator('#wyprobuj')).toBeFocused();
    await expect(page.locator('iframe[name="phone"]')).toBeInViewport({ ratio: 0.5 });
    await expect(nav.getByRole('link', { name: 'Prototyp' })).toHaveAttribute('aria-current', 'location');
    await expect(nav.getByRole('link', { name: 'Nowości' })).not.toHaveAttribute('aria-current');
    await nav.getByRole('link', { name: 'Start' }).click();
    await expect(page.locator('#section-hero')).toBeFocused();
    await expect(nav.getByRole('link', { name: 'Start' })).toHaveAttribute('aria-current', 'location');
  });

  test('"Start" on /prototype goes back to the hero of the landing page', async ({ page }) => {
    await page.goto('/prototype');
    await page
      .getByRole('navigation', { name: 'Sekcje strony' })
      .getByRole('link', { name: 'Start' })
      .click();
    await expect(page).toHaveURL(/\/#section-hero$/);
    await expect(page.getByRole('heading', { level: 1, name: /^ZUS i bilety/ })).toBeInViewport();
  });

  test('the header lists Start, Prototyp, Demo, Dla kogo, Nowości and Technologia, in that order', async ({
    page,
  }) => {
    for (const path of ['/', '/prototype']) {
      await page.goto(path);
      await expect(page.getByRole('navigation', { name: 'Sekcje strony' }).getByRole('link')).toHaveText([
        'Start',
        'Prototyp',
        'Demo',
        'Dla kogo',
        'Nowości',
        'Technologia',
      ]);
    }
  });

  test('the Technologia section comes last and shows its points as one list', async ({ page }) => {
    await page.goto('/');
    const tech = page.getByRole('region', { name: 'Technologia' });
    await expect(page.locator('main > *').last()).toHaveAttribute('id', 'technologia');
    await expect(tech.getByRole('list')).toHaveCount(1);
    await expect(tech.getByRole('listitem')).toHaveCount(18);
    await expect(tech.getByRole('listitem').first()).toContainText('PWA');
  });

  test('"Technologia" in the header jumps to the last section and marks it as current', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sekcje strony' });
    await nav.getByRole('link', { name: 'Technologia' }).click();
    await expect(page.locator('#technologia')).toBeFocused();
    await expect(page.getByRole('heading', { level: 2, name: 'Technologia' })).toBeInViewport();
    await expect(nav.getByRole('link', { name: 'Technologia' })).toHaveAttribute('aria-current', 'location');
    await expect(nav.getByRole('link', { name: 'Nowości' })).not.toHaveAttribute('aria-current');
  });

  test('"Technologia" on /prototype, and a direct #technologia link, open that section', async ({ page }) => {
    await page.goto('/prototype');
    await page
      .getByRole('navigation', { name: 'Sekcje strony' })
      .getByRole('link', { name: 'Technologia' })
      .click();
    await expect(page).toHaveURL(/\/#technologia$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Technologia' })).toBeInViewport();
    await page.goto('/');
    await page.goto('/#technologia');
    await expect(page.getByRole('heading', { level: 2, name: 'Technologia' })).toBeInViewport();
  });

  test('the six header links fit on one row in a narrow desktop window', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 640 });
    await page.goto('/');
    const links = page.getByRole('navigation', { name: 'Sekcje strony' }).getByRole('link');
    await expect(links).toHaveCount(6);
    const tops = await links.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().top))
    );
    expect(new Set(tops).size).toBe(1);
  });

  test('"Demo" comes right after the phone: a silent video with a poster, three chapters and a text version', async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on('request', (r) => requests.push(new URL(r.url()).pathname));
    await page.goto('/');
    await expect(page.locator('#wyprobuj + #demo')).toHaveCount(1);
    const demo = page.getByRole('region', { name: 'Demo' });
    await expect(demo.getByRole('group', { name: 'Rozdziały filmu' }).getByRole('button')).toHaveText([
      /Mobilny ZUS/,
      /Bilety miejskie/,
      /Języki sąsiedzkie/,
    ]);
    const video = demo.locator('video');
    await expect(video).toHaveAttribute('poster', /\/video\/demo-v\d+-poster\.jpg$/);
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).toHaveAttribute('controls', '');
    // Planned screens are labelled as proposals, on the page as in the video.
    await expect(demo).toContainText('Propozycja');
    // It never starts on its own, and the file isn't fetched until someone plays it.
    await demo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    expect(requests.some((p) => p.endsWith('.mp4'))).toBe(false);
    // The text version tells the whole story, captions included.
    await demo.getByText('Opis filmu').click();
    await expect(demo.getByRole('heading', { level: 3 })).toHaveText([
      'Mobilny ZUS',
      'Bilety miejskie',
      'Języki sąsiedzkie',
    ]);
    await expect(demo.locator('details')).toContainText('969 miast do wyboru');
    await expect(demo.locator('details')).toContainText('W prototypie nic nie zapłacono.');
  });

  test('"Demo" in the header jumps to the video, and /prototype and #demo open it too', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sekcje strony' });
    await nav.getByRole('link', { name: 'Demo' }).click();
    await expect(page.locator('#demo')).toBeFocused();
    await expect(page.getByRole('heading', { level: 2, name: 'Demo' })).toBeInViewport();
    await expect(nav.getByRole('link', { name: 'Demo' })).toHaveAttribute('aria-current', 'location');
    await page.goto('/prototype');
    await nav.getByRole('link', { name: 'Demo' }).click();
    await expect(page).toHaveURL(/\/#demo$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Demo' })).toBeInViewport();
  });

  test('a chapter button jumps the video to that chapter and shows its text', async ({ page }) => {
    await page.goto('/#demo');
    const demo = page.getByRole('region', { name: 'Demo' });
    const tickets = demo.getByRole('button', { name: /Bilety miejskie/ });
    await expect(tickets).toHaveAttribute('aria-pressed', 'false');
    await tickets.click();
    await expect(tickets).toHaveAttribute('aria-pressed', 'true');
    expect(await demo.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeCloseTo(30, 0);
    await expect(demo.getByRole('link', { name: 'Pokaż wybór miasta' })).toBeVisible();
  });

  test('once played, the demo video is stored and plays offline', async ({ page, context }) => {
    await page.goto('/#demo');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    // The first load is not controlled by the service worker yet; a reload is.
    await page.reload();
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    const demo = page.getByRole('region', { name: 'Demo' });
    await demo.getByRole('button', { name: /Mobilny ZUS/ }).click();
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const cache = await caches.open('demo-video');
          return (await cache.keys()).some((r) => new URL(r.url).pathname.endsWith('.mp4'));
        })
      )
      .toBe(true);
    await context.setOffline(true);
    await page.reload();
    const video = page.locator('#demo video');
    await video.evaluate(async (v: HTMLVideoElement) => {
      v.currentTime = 40;
      await v.play();
    });
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(40.5);
    await expect(page.getByRole('status').filter({ hasText: 'połączeniu' })).toHaveCount(0);
    await context.setOffline(false);
  });

  test('the captions are in the page language and change with it', async ({ page }) => {
    const showing = () =>
      page.locator('#demo video').evaluate((v: HTMLVideoElement) => {
        const track = [...v.textTracks].find((t) => t.mode === 'showing');
        return {
          lang: track?.language,
          count: track?.cues?.length,
          first: (track?.cues?.[0] as VTTCue)?.text,
        };
      });
    await page.goto('/');
    await expect.poll(showing).toEqual({
      lang: 'pl',
      count: 18,
      first: 'Jeden dzień z aplikacją. To nieoficjalny prototyp.',
    });
    await page.goto('/?lang=uk');
    await expect.poll(async () => (await showing()).lang).toBe('uk');
    expect((await showing()).first).toMatch(/[а-яіїє]/i);
  });

  for (const [chapter, button, heading] of [
    [null, 'Pokaż ZUS w prototypie', 'ZUS'],
    [/Bilety miejskie/, 'Pokaż wybór miasta', 'Bilet miejski'],
  ] as const) {
    test(`Demo: "${button}" opens ${heading} in the phone and pauses the video`, async ({ page }) => {
      await page.goto('/#demo');
      const phone = page.frameLocator('iframe[name="phone"]');
      await phone.getByRole('heading', { level: 1 }).waitFor();
      const demo = page.getByRole('region', { name: 'Demo' });
      if (chapter) {
        await demo.getByRole('button', { name: chapter }).click();
      }
      await demo.getByRole('link', { name: button }).click();
      await expect(phone.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(page.locator('iframe[name="phone"]')).toBeInViewport({ ratio: 0.5 });
      expect(await demo.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    });
  }

  test('"Dla kogo" shows seven fictional example people, each with something to try', async ({ page }) => {
    await page.goto('/');
    const audience = page.getByRole('region', { name: 'Dla kogo?' });
    await expect(page.locator('#wyprobuj + #demo + #dla-kogo')).toHaveCount(1);
    await expect(audience.getByRole('listitem')).toHaveCount(7);
    await expect(audience.getByRole('heading', { level: 3 })).toHaveText([
      'Teresa',
      'Marek',
      'Oksana',
      'Krzysztof',
      'Ewa',
      'Kuba',
      'Zbigniew',
    ]);
    await expect(audience).toContainText('To postacie fikcyjne');
    // Every card describes something that works now: none says "Wkrótce".
    await expect(audience).not.toContainText('Wkrótce');
    await expect(audience.getByRole('link')).toHaveCount(6);
  });

  test('"Dla kogo" in the header jumps to that section and marks it as current', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sekcje strony' });
    await nav.getByRole('link', { name: 'Dla kogo' }).click();
    await expect(page.locator('#dla-kogo')).toBeFocused();
    await expect(page.getByRole('heading', { level: 2, name: 'Dla kogo?' })).toBeInViewport();
    await expect(nav.getByRole('link', { name: 'Dla kogo' })).toHaveAttribute('aria-current', 'location');
  });

  test('"Dla kogo" on /prototype, and a direct #dla-kogo link, open that section', async ({ page }) => {
    await page.goto('/prototype');
    await page
      .getByRole('navigation', { name: 'Sekcje strony' })
      .getByRole('link', { name: 'Dla kogo' })
      .click();
    await expect(page).toHaveURL(/\/#dla-kogo$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Dla kogo?' })).toBeInViewport();
    await page.goto('/');
    await page.goto('/#dla-kogo');
    await expect(page.getByRole('heading', { level: 2, name: 'Dla kogo?' })).toBeInViewport();
  });

  for (const [button, heading] of [
    ['Pokaż tryb dla seniora', 'Ustawienia'],
    ['Pokaż wybór miasta', 'Bilet miejski'],
  ] as const) {
    test(`"${button}" opens ${heading} in the phone and brings the phone into view`, async ({ page }) => {
      await page.goto('/#dla-kogo');
      const phone = page.frameLocator('iframe[name="phone"]');
      await phone.getByRole('heading', { level: 1 }).waitFor();
      await page.getByRole('region', { name: 'Dla kogo?' }).getByRole('link', { name: button }).click();
      await expect(phone.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(page.locator('iframe[name="phone"]')).toBeInViewport({ ratio: 0.5 });
      // The page stays the landing page; only the phone changed screen.
      await expect(page).toHaveURL(/\/(#dla-kogo)?$/);
    });
  }

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

  test('the page header switch changes the page and the phone, and both persist after a reload', async ({
    page,
  }) => {
    await page.goto('/');
    const app = page.frameLocator('iframe[name="phone"]');
    await expect(app.getByRole('heading', { level: 1 })).toHaveText('Twoje sprawy');
    await expect(page).toHaveTitle('Sprawnie – Sprawy urzędowe prościej (prototyp)');

    await page
      .getByRole('banner')
      .getByRole('button', { name: /Zmień język/ })
      .click();
    await page.getByRole('banner').getByRole('button', { name: 'Українська' }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.getByRole('navigation', { name: 'Розділи сторінки' })).toBeVisible();
    await expect(page).toHaveTitle('Sprawnie – Офіційні справи – простіше (прототип)');
    await expect(app.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(app.getByRole('heading', { level: 1 })).toHaveText('Твої справи');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(app.getByRole('heading', { level: 1 })).toHaveText('Твої справи');
  });

  test('from the header, the keyboard reaches Ukrainian in 3 key presses', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('banner')
      .getByRole('button', { name: /Zmień język/ })
      .focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('u');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.frameLocator('iframe[name="phone"]').locator('html')).toHaveAttribute('lang', 'uk');
  });

  test('/?lang=be opens the landing page and the phone in Belarusian', async ({ page }) => {
    await page.goto('/?lang=be');
    await expect(page.locator('html')).toHaveAttribute('lang', 'be');
    await expect(page).toHaveTitle('Sprawnie – Афіцыйныя справы – прасцей (прататып)');
    await expect(page.frameLocator('iframe[name="phone"]').locator('html')).toHaveAttribute('lang', 'be');
  });

  for (const locale of ['de', 'lt']) {
    test(`${locale}: the header and the page fit a 1024 px window without sideways scrolling`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1024, height: 640 });
      await page.addInitScript(
        (l) => localStorage.setItem('settings:v1', JSON.stringify({ locale: l })),
        locale
      );
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
      const header = await page.getByRole('banner').boundingBox();
      expect(header?.height).toBeLessThan(120);
    });
  }

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

  for (const locale of ['en', 'uk', 'de', 'cs', 'sk', 'lt', 'be']) {
    test(`axe: no WCAG A/AA violations on the landing page in ${locale}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(
        (l) => localStorage.setItem('settings:v1', JSON.stringify({ locale: l })),
        locale
      );
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await page.frameLocator('iframe[name="phone"]').getByRole('heading', { level: 1 }).waitFor();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }

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
