import Link from "next/link";

import type { AssetPreview } from "@/features/assets/asset-types";

type AssetCardProps = Readonly<{
  asset: AssetPreview;
}>;

function formatCurrency(value: string, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <article className="asset-card">
      <div className="asset-card__meta">
        <span>{asset.industry}</span>
        <span>{asset.location}</span>
      </div>
      <h2>{asset.title}</h2>
      <p>{asset.description}</p>
      <dl className="asset-card__facts">
        <div>
          <dt>Asking valuation</dt>
          <dd>{formatCurrency(asset.valuation, asset.currency)}</dd>
        </div>
        <div>
          <dt>Seller</dt>
          <dd>{asset.sellerName}</dd>
        </div>
      </dl>
      <Link className="asset-card__link" href={`/assets/${asset.id}`}>
        View opportunity
      </Link>
    </article>
  );
}
