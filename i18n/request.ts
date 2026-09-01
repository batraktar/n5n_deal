import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { defaultLocale, isLocale } from "./config";

const messageLoaders = {
  de: () => import("../messages/de.json"),
  en: () => import("../messages/en.json"),
  es: () => import("../messages/es.json"),
  fr: () => import("../messages/fr.json"),
  pl: () => import("../messages/pl.json"),
  uk: () => import("../messages/uk.json"),
} as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("N5DEAL_LOCALE")?.value;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = (await messageLoaders[locale]()).default;

  return { locale, messages };
});
