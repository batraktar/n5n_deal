import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SellerBuyerCard } from "@/components/seller/seller-buyer-card";
import {
  parseSellerBuyerSearchParameters,
  sellerBuyerBudgetOptions,
} from "@/features/seller/buyer-search";
import { getSellerBuyerFilterOptions, getSellerBuyers } from "@/features/seller/buyer-repository";
import { resolveLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

type SellerBuyersPageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

function budgetLabel(
  option: (typeof sellerBuyerBudgetOptions)[number],
  translate: (key: "allBudgets" | "compatible" | "incompatible") => string,
): string {
  switch (option) {
    case "ALL":
      return translate("allBudgets");
    case "COMPATIBLE":
      return translate("compatible");
    case "INCOMPATIBLE":
      return translate("incompatible");
  }
}

export default async function SellerBuyersPage({ searchParams }: SellerBuyersPageProps) {
  const t = await getTranslations("seller");
  const filterT = await getTranslations("filters");
  const locale = resolveLocale(await getLocale());
  const parameters = await searchParams;
  const search = parseSellerBuyerSearchParameters(parameters);
  const [buyers, filters] = await Promise.all([getSellerBuyers(search, locale), getSellerBuyerFilterOptions(locale)]);

  return (
    <>
      <SiteHeader />
      <main className="seller-buyers container">
        <Link className="back-link" href="/seller/dashboard">← {t("assetBack")}</Link>
        <div className="seller-buyers__heading">
          <div>
            <p className="eyebrow">{t("buyerDirectory")}</p>
            <h1>{t("buyers")}</h1>
            <p>{t("buyersDescription")}</p>
          </div>
          <Link className="link-button link-button--secondary" href="/seller/assets/new">{t("createAsset")}</Link>
        </div>
        <form className="seller-buyers__filters" method="get">
          <label>
            <span>{filterT("search")}</span>
            <input defaultValue={search.query} name="query" placeholder={filterT("buyerPlaceholder")} />
          </label>
          <label>
            <span>{filterT("industry")}</span>
            <select defaultValue={search.industry} name="industry">
              <option value="">{filterT("allIndustries")}</option>
              {filters.industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>
          </label>
          <label>
            <span>{filterT("location")}</span>
            <select defaultValue={search.location} name="location">
              <option value="">{filterT("allLocations")}</option>
              {filters.locations.map((location) => <option key={location} value={location}>{location}</option>)}
            </select>
          </label>
          <label>
            <span>{filterT("budget")}</span>
            <select defaultValue={search.budget} name="budget">
              {sellerBuyerBudgetOptions.map((option) => <option key={option} value={option}>{budgetLabel(option, filterT)}</option>)}
            </select>
          </label>
          <button type="submit">{filterT("apply")}</button>
        </form>
        <section aria-live="polite" className="seller-buyers__results">
          <div className="seller-buyers__result-summary">
            <p>{t("buyerCount", { count: buyers.length })}</p>
            <Link href="/seller/buyers">{t("clearBuyerFilters")}</Link>
          </div>
          {buyers.length > 0 ? (
            <div className="seller-buyer-grid">
              {buyers.map((buyer) => <SellerBuyerCard buyer={buyer} key={buyer.id} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{t("emptyBuyersTitle")}</h2>
              <p>{t("emptyBuyersDescription")}</p>
              <Link href="/seller/buyers">{t("resetBuyerFilters")}</Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
