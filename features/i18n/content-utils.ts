import { defaultLocale, type Locale } from "@/i18n/config";

export type AssetTranslationContent = Readonly<{
  description: string;
  industry: string;
  location: string;
  title: string;
}>;

export type BuyerProfileTranslationContent = Readonly<{
  industries: readonly string[];
  interests: string;
  preferredLocations: readonly string[];
}>;

export function mergeAssetTranslation(
  asset: AssetTranslationContent,
  translation: Partial<AssetTranslationContent> | null,
): AssetTranslationContent {
  return translation === null ? asset : { ...asset, ...translation };
}

export function mergeBuyerProfileTranslation(
  profile: BuyerProfileTranslationContent,
  translation: Partial<BuyerProfileTranslationContent> | null,
): BuyerProfileTranslationContent {
  return translation === null ? profile : { ...profile, ...translation };
}

export function localeCandidates(locale: Locale): readonly string[] {
  return locale === defaultLocale ? [defaultLocale] : [locale, defaultLocale];
}

export function selectPreferredTranslation<T extends { readonly locale: string }>(
  translations: readonly T[],
  locale: Locale,
): T | null {
  const requested = translations.find((translation) => translation.locale === locale);
  return requested ?? translations.find((translation) => translation.locale === defaultLocale) ?? null;
}
