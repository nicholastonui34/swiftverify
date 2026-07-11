import "server-only";
import { db, isDbConfigured } from "./db";
import { siteConfig } from "./config";

/**
 * Runtime settings. Backed by the `Setting` table (key → JSON value) with the
 * static `siteConfig` as the fallback so the site renders even before an admin
 * has touched anything, or when the DB is unreachable.
 *
 * Admins edit these in /admin/settings. The payment page and announcement
 * banner read them instead of the hardcoded config values.
 */
export type SiteSettings = {
  mpesaTill: string;
  mpesaMerchantName: string;
  usdtTrc20Address: string;
  binancePayId: string;
  adminEmail: string;
  tagline: string;
  currentTip: string;
  promoActive: boolean;
  // Phase 4 — notifications
  emailNotifications: boolean;
  telegramNotifications: boolean;
  telegramChatId: string;
};

export const SETTING_KEYS: (keyof SiteSettings)[] = [
  "mpesaTill",
  "mpesaMerchantName",
  "usdtTrc20Address",
  "binancePayId",
  "adminEmail",
  "tagline",
  "currentTip",
  "promoActive",
  "emailNotifications",
  "telegramNotifications",
  "telegramChatId",
];

function defaults(): SiteSettings {
  return {
    mpesaTill: siteConfig.mpesaTill,
    mpesaMerchantName: siteConfig.mpesaMerchantName,
    usdtTrc20Address: siteConfig.usdtTrc20Address,
    binancePayId: siteConfig.binancePayId,
    adminEmail: siteConfig.supportEmail,
    tagline: siteConfig.tagline,
    currentTip: "",
    promoActive: true,
    emailNotifications: true,
    telegramNotifications: true,
    telegramChatId: "",
  };
}

export async function getSettings(): Promise<SiteSettings> {
  const base = defaults();
  if (!isDbConfigured) return base;
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: SETTING_KEYS as string[] } },
    });
    const result = { ...base };
    for (const row of rows) {
      const key = row.key as keyof SiteSettings;
      try {
        const parsed = JSON.parse(row.value);
        // Only accept values whose type matches the default (guards bad rows).
        if (typeof parsed === typeof base[key]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[key] = parsed;
        }
      } catch {
        /* skip malformed row */
      }
    }
    return result;
  } catch {
    return base;
  }
}

export async function updateSettings(patch: Partial<SiteSettings>): Promise<void> {
  const entries = Object.entries(patch).filter(([k]) =>
    (SETTING_KEYS as string[]).includes(k)
  );
  await Promise.all(
    entries.map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      })
    )
  );
}
