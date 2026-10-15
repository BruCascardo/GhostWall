import { defineConfig, devices } from '@playwright/test';

// Pruebas end-to-end sobre el build de producción de web (docs/testing.md).
// `npm run test:e2e` compila la aplicación y Playwright la levanta con `next start`.
const PUERTO = 3100;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PUERTO}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx next start --port ${PUERTO}`,
    url: `http://127.0.0.1:${PUERTO}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
