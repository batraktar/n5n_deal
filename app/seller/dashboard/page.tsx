import Link from "next/link";

import { SellerAssetCard } from "@/components/seller/seller-asset-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSellerAssets } from "@/features/seller/seller-repository";

type SellerDashboardPageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

const notices = {
  created: "Asset created. You can publish it when the listing is ready.",
  updated: "Asset changes saved.",
  "status-updated": "Listing status updated.",
} as const;

function getNotice(value: string | readonly string[] | undefined): string | null {
  switch (value) {
    case "created":
      return notices.created;
    case "updated":
      return notices.updated;
    case "status-updated":
      return notices["status-updated"];
    default:
      return null;
  }
}

export default async function SellerDashboardPage({ searchParams }: SellerDashboardPageProps) {
  const [assets, parameters] = await Promise.all([getSellerAssets(), searchParams]);
  const notice = getNotice(parameters["notice"]);

  return (
    <>
      <SiteHeader />
      <main className="seller-dashboard container">
        <div className="seller-dashboard__heading">
          <div>
            <p className="eyebrow">Seller workspace</p>
            <h1>Your opportunities</h1>
            <p>Prepare, publish, and maintain the opportunities represented by your company.</p>
          </div>
          <Link className="link-button link-button--primary" href="/seller/assets/new">Create asset</Link>
        </div>
        {notice !== null ? <p className="seller-notice" role="status">{notice}</p> : null}
        {assets.length === 0 ? (
          <section className="empty-state">
            <h2>Create your first opportunity</h2>
            <p>Start with a clear summary, indicative valuation, and the market context buyers need.</p>
            <Link href="/seller/assets/new">Create asset</Link>
          </section>
        ) : <div className="seller-asset-list">{assets.map((asset) => <SellerAssetCard asset={asset} key={asset.id} />)}</div>}
      </main>
      <SiteFooter />
    </>
  );
}
