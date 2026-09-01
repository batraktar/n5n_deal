import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AssetCard } from "@/components/assets/asset-card";
import { AssetFilterForm } from "@/components/assets/asset-filter-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAssetFilterOptions, getPublishedAssetListing } from "@/features/assets/asset-repository";
import { createMarketplaceHref, parseAssetSearchParameters } from "@/features/assets/asset-search";

export const dynamic = "force-dynamic";

type MarketplacePageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const t = await getTranslations("marketplace");
  const search = parseAssetSearchParameters(await searchParams);
  const [listing, filters] = await Promise.all([
    getPublishedAssetListing(search),
    getAssetFilterOptions(),
  ]);

  return (
    <div>
      <SiteHeader />
      <main className="marketplace container">
        <header className="marketplace__heading">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </header>
        <AssetFilterForm filters={filters} search={search} />
        <section aria-live="polite" className="marketplace__results">
          <div className="marketplace__result-summary">
            <p>{t("results", { count: listing.total })}</p>
            <Link href="/marketplace">{t("clearFilters")}</Link>
          </div>
          {listing.assets.length > 0 ? (
            <div className="asset-grid">
              {listing.assets.map((asset) => (
                <AssetCard asset={asset} key={asset.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{t("emptyTitle")}</h2>
              <p>{t("emptyDescription")}</p>
              <Link href="/marketplace">{t("resetFilters")}</Link>
            </div>
          )}
          {listing.pageCount > 1 ? (
            <nav aria-label={t("pages")} className="pagination">
              {listing.page > 1 ? <Link href={createMarketplaceHref(search, listing.page - 1)}>{t("previous")}</Link> : null}
              <span>
                {t("pageOf", { page: listing.page, pageCount: listing.pageCount })}
              </span>
              {listing.page < listing.pageCount ? (
                <Link href={createMarketplaceHref(search, listing.page + 1)}>{t("next")}</Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
