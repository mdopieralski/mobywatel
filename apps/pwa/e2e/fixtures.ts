import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

/**
 * Every spec imports `test` from here, not from @playwright/test.
 *
 * Why: the first page a freshly launched browser lays out can block its main thread for 5–10 s (seen in
 * Chromium traces on macOS as one `Layout` task before first paint: cold system-font lookups for the
 * `system-ui, -apple-system, 'Segoe UI', Roboto, …` stack while other browsers in the run are busy). Nothing
 * renders and no locator resolves during that time, so whichever test opens that page first hits the 5 s
 * expect timeout. Real visitors' browsers are warm; the run's new browsers are not. So each worker opens
 * the app once, in a throwaway context, before its first test (QA, 2026-10-27).
 */
export const test = base.extend<object, { warmBrowser: void }>({
  warmBrowser: [
    async ({ browser }, use, workerInfo) => {
      const baseURL = workerInfo.project.use.baseURL ?? 'http://localhost:4173';
      const context = await browser.newContext({ baseURL, reducedMotion: 'reduce' });
      const page = await context.newPage();
      // "/" on this default (desktop-sized, mouse) context is the landing page: text in the page and in
      // the phone frame, so both get laid out once.
      await page.goto('/');
      await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 60_000 });
      await page
        .frameLocator('iframe[name="phone"]')
        .getByRole('heading', { level: 1 })
        .waitFor({ timeout: 60_000 })
        .catch(() => {
          // A narrow default window has no phone frame; the page itself is warm enough.
        });
      await context.close();
      await use();
    },
    { scope: 'worker', auto: true, timeout: 90_000 },
  ],
});
