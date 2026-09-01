import { describe, expect, it } from "vitest";

import {
  mergeAssetTranslation,
  mergeBuyerProfileTranslation,
  selectPreferredTranslation,
} from "@/features/i18n/content-utils";

describe("localized marketplace content", () => {
  it("keeps proper asset names while replacing descriptive fields", () => {
    const localized = mergeAssetTranslation(
      {
        description: "A profitable workflow platform.",
        industry: "Software",
        location: "London, United Kingdom",
        title: "Ledgerline — workflow software for finance teams",
      },
      {
        description: "Прибуткова workflow-платформа для фінансових команд.",
        industry: "Програмне забезпечення",
        location: "Лондон, Велика Британія",
        title: "Ledgerline — workflow software for finance teams",
      },
    );

    expect(localized).toEqual({
      description: "Прибуткова workflow-платформа для фінансових команд.",
      industry: "Програмне забезпечення",
      location: "Лондон, Велика Британія",
      title: "Ledgerline — workflow software for finance teams",
    });
  });

  it("falls back to the core buyer preferences when no translation exists", () => {
    const profile = {
      industries: ["Software"],
      interests: "Recurring-revenue businesses.",
      preferredLocations: ["Germany"],
    } as const;

    expect(mergeBuyerProfileTranslation(profile, null)).toBe(profile);
  });

  it("prefers the requested locale and falls back to English", () => {
    const translations = [
      { locale: "en", value: "English" },
      { locale: "de", value: "Deutsch" },
    ] as const;

    expect(selectPreferredTranslation(translations, "de")?.value).toBe("Deutsch");
    expect(selectPreferredTranslation(translations, "fr")?.value).toBe("English");
  });
});
