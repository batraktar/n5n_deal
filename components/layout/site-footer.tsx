import { getTranslations } from "next-intl/server";

import { N5DealMark } from "@/components/ui/n5deal-mark";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="site-footer">
      <div className="container site-footer__content">
        <N5DealMark />
        <p>{t("description")}</p>
        <span>{t("prototype")}</span>
      </div>
    </footer>
  );
}
