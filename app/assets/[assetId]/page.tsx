import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactSellerForm } from "@/components/buyer/contact-seller-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedAssetById } from "@/features/assets/asset-repository";

export const dynamic = "force-dynamic";

type AssetDetailsPageProps = Readonly<{
  params: Promise<Readonly<{ assetId: string }>>;
}>;

function formatCurrency(value: string, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export default async function AssetDetailsPage({ params }: AssetDetailsPageProps) {
  const { assetId } = await params;
  const asset = await getPublishedAssetById(assetId);

  if (asset === null) {
    notFound();
  }

  return (
    <div>
      <SiteHeader />
      <main className="asset-details container">
        <Link className="back-link" href="/marketplace">
          Back to marketplace
        </Link>
        <div className="asset-details__layout">
          <article className="asset-details__content">
            <p className="eyebrow">{asset.industry}</p>
            <h1>{asset.title}</h1>
            <p className="asset-details__location">{asset.location}</p>
            <div className="asset-details__description">
              <h2>Company overview</h2>
              <p>{asset.description}</p>
            </div>
          </article>
          <aside className="asset-details__panel">
            <dl>
              <div>
                <dt>Asking valuation</dt>
                <dd>{formatCurrency(asset.valuation, asset.currency)}</dd>
              </div>
              <div>
                <dt>Annual revenue</dt>
                <dd>{asset.revenue === null ? "Not disclosed" : formatCurrency(asset.revenue, asset.currency)}</dd>
              </div>
              <div>
                <dt>Listed by</dt>
                <dd>{asset.sellerName}</dd>
              </div>
            </dl>
            <ContactSellerForm assetId={asset.id} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
