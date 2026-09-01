import { describe, expect, it } from "vitest";

import de from "@/messages/de.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import fr from "@/messages/fr.json";
import pl from "@/messages/pl.json";
import uk from "@/messages/uk.json";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

const messages = { de, en, es, fr, pl, uk } as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function leafKeys(value: Readonly<Record<string, unknown>>, prefix = ""): readonly string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix.length === 0 ? key : `${prefix}.${key}`;
    return isRecord(child)
      ? leafKeys(child, path)
      : [path];
  });
}

describe("internationalization", () => {
  it("defines the requested European locales with English as default", () => {
    expect(locales).toEqual(["en", "uk", "pl", "de", "fr", "es"]);
    expect(defaultLocale).toBe("en");
    expect(isLocale("uk")).toBe(true);
    expect(isLocale("ja")).toBe(false);
  });

  it("keeps every locale catalog structurally complete", () => {
    const englishKeys = [...leafKeys(en)].sort();

    for (const locale of locales) {
      expect([...leafKeys(messages[locale])].sort(), `${locale} catalog`).toEqual(englishKeys);
    }
  });
});
