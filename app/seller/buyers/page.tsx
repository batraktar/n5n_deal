import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SellerBuyerCard } from "@/components/seller/seller-buyer-card";
import {
  parseSellerBuyerSearchParameters,
  sellerBuyerBudgetOptions,
} from "@/features/seller/buyer-search";
import { getSellerBuyerFilterOptions, getSellerBuyers } from "@/features/seller/buyer-repository";

export const dynamic = "force-dynamic";

type SellerBuyersPageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

function budgetLabel(option: (typeof sellerBuyerBudgetOptions)[number]): string {
  switch (option) {
    case "ALL":
      return "Any budget compatibility";
    case "COMPATIBLE":
      return "Budget compatible";
    case "INCOMPATIBLE":
      return "Budget not compatible";
  }
}

export default async function SellerBuyersPage({ searchParams }: SellerBuyersPageProps) {
  const parameters = await searchParams;
  const search = parseSellerBuyerSearchParameters(parameters);
  const [buyers, filters] = await Promise.all([getSellerBuyers(search), getSellerBuyerFilterOptions()]);

  return (
    <>
      <SiteHeader />
      <main className="seller-buyers container">
        <Link className="back-link" href="/seller/dashboard">← Seller dashboard</Link>
        <div className="seller-buyers__heading">
          <div>
            <p className="eyebrow">Buyer directory</p>
            <h1>Find aligned buyers.</h1>
            <p>Browse active investor profiles, compare their preferences, and start a focused conversation.</p>
          </div>
          <Link className="link-button link-button--secondary" href="/seller/assets/new">Create asset</Link>
        </div>
        <form className="seller-buyers__filters" method="get">
          <label>
            <span>Search</span>
            <input defaultValue={search.query} name="query" placeholder="Name, interest, industry, or location" />
          </label>
          <label>
            <span>Industry</span>
            <select defaultValue={search.industry} name="industry">
              <option value="">All industries</option>
              {filters.industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>
          </label>
          <label>
            <span>Location</span>
            <select defaultValue={search.location} name="location">
              <option value="">All locations</option>
              {filters.locations.map((location) => <option key={location} value={location}>{location}</option>)}
            </select>
          </label>
          <label>
            <span>Budget</span>
            <select defaultValue={search.budget} name="budget">
              {sellerBuyerBudgetOptions.map((option) => <option key={option} value={option}>{budgetLabel(option)}</option>)}
            </select>
          </label>
          <button type="submit">Apply filters</button>
        </form>
        <section aria-live="polite" className="seller-buyers__results">
          <div className="seller-buyers__result-summary">
            <p>{buyers.length} active buyer profile{buyers.length === 1 ? "" : "s"}</p>
            <Link href="/seller/buyers">Clear filters</Link>
          </div>
          {buyers.length > 0 ? (
            <div className="seller-buyer-grid">
              {buyers.map((buyer) => <SellerBuyerCard buyer={buyer} key={buyer.id} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No buyers match these filters.</h2>
              <p>Try a broader search or publish an asset to enable budget matching.</p>
              <Link href="/seller/buyers">Reset buyer filters</Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
