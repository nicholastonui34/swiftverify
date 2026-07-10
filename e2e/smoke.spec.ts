import { test, expect } from "@playwright/test";

/**
 * Public-page smoke tests. No database is configured (see playwright.config.ts),
 * so these assert the DB-independent surface: pages render, key forms are
 * present, navigation works, and SEO endpoints respond.
 */

test("landing page renders with hero, CTA and FAQ", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/SwiftVerify/i);
  await expect(page.getByRole("heading", { name: /Payoneer/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Place Order", exact: true })).toBeVisible();
  await expect(page.getByText(/Questions, answered/i)).toBeVisible();
});

test("order page renders", async ({ page }) => {
  // The order heading is "Place your order" (with DB) or "Start your order with
  // our team" (DB-less fallback used in CI) — both contain "order".
  await page.goto("/order");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/order/i);
});

test("track page shows the lookup form", async ({ page }) => {
  await page.goto("/track");
  await expect(page.getByRole("heading", { name: /Track your order/i })).toBeVisible();
  await expect(page.getByLabel(/Order ID/i)).toBeVisible();
  await expect(page.getByLabel(/Email/i)).toBeVisible();
});

test("FAQ page renders questions", async ({ page }) => {
  await page.goto("/faq");
  await expect(
    page.getByRole("heading", { name: /Frequently asked questions/i })
  ).toBeVisible();
  await expect(page.getByText(/affiliated with Payoneer/i)).toBeVisible();
});

test("navbar links to the order flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Place Order" }).first().click();
  await expect(page).toHaveURL(/\/order$/);
});

test("unknown route returns 404", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
});

test("SEO endpoints respond", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<urlset");
});

test("Open Graph image is served", async ({ request }) => {
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});
