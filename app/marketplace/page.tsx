import Link from "next/link";

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
          <p className="eyebrow">Marketplace</p>
          <h1>Explore acquisition opportunities with more context.</h1>
          <p>Search the current published marketplace by business profile, industry, and location.</p>
        </header>
        <AssetFilterForm filters={filters} search={search} />
        <section aria-live="polite" className="marketplace__results">
          <div className="marketplace__result-summary">
            <p>{listing.total} published opportunities</p>
            <Link href="/marketplace">Clear filters</Link>
          </div>
          {listing.assets.length > 0 ? (
            <div className="asset-grid">
              {listing.assets.map((asset) => (
                <AssetCard asset={asset} key={asset.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No opportunities match these filters.</h2>
              <p>Try a broader industry, location, or keyword search.</p>
              <Link href="/marketplace">Reset marketplace filters</Link>
            </div>
          )}
          {listing.pageCount > 1 ? (
            <nav aria-label="Marketplace pages" className="pagination">
              {listing.page > 1 ? <Link href={createMarketplaceHref(search, listing.page - 1)}>Previous</Link> : null}
              <span>
                Page {listing.page} of {listing.pageCount}
              </span>
              {listing.page < listing.pageCount ? (
                <Link href={createMarketplaceHref(search, listing.page + 1)}>Next</Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
