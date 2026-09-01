"use client";

import { useTranslations } from "next-intl";

type DataErrorStateProps = Readonly<{
  reset: () => void;
}>;

export function DataErrorState({ reset }: DataErrorStateProps) {
  const t = useTranslations("errors");

  return (
    <main className="data-error container">
      <p className="eyebrow">{t("dataUnavailableEyebrow")}</p>
      <h1>{t("dataUnavailableTitle")}</h1>
      <p>{t("dataUnavailableDescription")}</p>
      <button onClick={reset} type="button">
        {t("tryAgain")}
      </button>
    </main>
  );
}
