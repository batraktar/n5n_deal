"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { setLocaleAction } from "@/features/i18n/actions";
import { isLocale, locales } from "@/i18n/config";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const t = useTranslations("navigation");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  function handleChange(value: string): void {
    if (!isLocale(value) || value === currentLocale) {
      return;
    }

    setIsPending(true);
    startTransition(() => {
      void setLocaleAction(value).then(() => {
        router.refresh();
        setIsPending(false);
      });
    });
  }

  return (
    <label className="language-switcher">
      <span className="sr-only">{t("language")}</span>
      <select
        aria-label={t("language")}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value)}
        value={currentLocale}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
