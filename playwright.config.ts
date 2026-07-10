import { defineConfig, devices } from "@playwright/test";

const PORT = 3111;
const baseURL = `http://localhost:${PORT}`;

/**
 * Playwright smoke tests. They exercise the public pages against a production
 * build (`next start`) with NO database configured, so they run in CI without
 * any secrets and rely on the static content fallback. DB-dependent flows
 * (order submission, admin) are covered by server-side verification instead.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : "line",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Force the DB-less static fallback so the smoke run needs no secrets.
    env: { DATABASE_URL: "", AUTH_SECRET: "smoke-test-secret" },
  },
});
