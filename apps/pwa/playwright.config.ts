import { defineConfig, devices } from '@playwright/test';

// Phone and tablet viewports, plus desktop Chrome and Safari for the showcase page, against the production build
// (the service worker only exists there).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    locale: 'pl-PL',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 13'] }, testIgnore: /showcase[\w-]*\.spec/ },
    { name: 'android', use: { ...devices['Pixel 7'] }, testIgnore: /showcase[\w-]*\.spec/ },
    // A juror may open the link on an iPad: touch, so the app full screen, not the desktop page.
    { name: 'tablet', use: { ...devices['iPad (gen 7) landscape'] }, testIgnore: /showcase[\w-]*\.spec/ },
    // Jurors on a laptop see the showcase; many will use Safari on a Mac.
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      testMatch: /showcase[\w-]*\.spec/,
    },
    {
      name: 'desktop-safari',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
      testMatch: /showcase[\w-]*\.spec/,
    },
  ],
  webServer: {
    command: 'pnpm run build && pnpm run preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
