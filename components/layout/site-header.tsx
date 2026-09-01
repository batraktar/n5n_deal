import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { N5DealMark } from "@/components/ui/n5deal-mark";

const navigationItems = [
  ["/marketplace", "opportunities"],
  ["/admin", "platformManager"],
  ["/buyer/dashboard", "buyerWorkspace"],
  ["/seller/dashboard", "sellerWorkspace"],
  ["/seller/buyers", "findBuyers"],
  ["/#how-it-works", "howItWorks"],
  ["/#quality", "ourStandard"],
] as const;

export async function SiteHeader() {
  const t = await getTranslations("navigation");
  const renderNavigationLinks = (variant: "desktop" | "mobile") => (
    <div className={`site-nav__links site-nav__links--${variant}`}>
      {navigationItems.map(([href, key]) => (
        <Link href={href} key={href}>
          {t(key)}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="site-header">
      <nav aria-label={t("primary")} className="site-nav container">
        <Link aria-label={t("home")} className="brand-link" href="/">
          <N5DealMark />
        </Link>
        {renderNavigationLinks("desktop")}
        <details className="site-nav__menu">
          <summary>{t("menu")}</summary>
          {renderNavigationLinks("mobile")}
        </details>
        <div className="site-nav__actions">
          <LanguageSwitcher />
          <Link className="site-nav__cta" href="/#contact">
            {t("join")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
