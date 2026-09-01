import Link from "next/link";

import { SellerStatusForm } from "./seller-status-form";

import type { SellerAsset } from "@/features/seller/seller-types";

type SellerAssetCardProps = Readonly<{
  asset: SellerAsset;
}>;

function formatMoney(value: string, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export function SellerAssetCard({ asset }: SellerAssetCardProps) {
  return (
    <article className="seller-asset-card">
      <div className="seller-asset-card__heading">
        <div>
          <p>{asset.industry} · {asset.location}</p>
          <h2>{asset.title}</h2>
        </div>
        <span className={`asset-status asset-status--${asset.status.toLowerCase()}`}>{asset.status}</span>
      </div>
      <dl className="seller-asset-card__facts">
        <div><dt>Valuation</dt><dd>{formatMoney(asset.valuation, asset.currency)}</dd></div>
        <div><dt>Last updated</dt><dd>{asset.updatedAt.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}</dd></div>
      </dl>
      <div className="seller-asset-card__footer">
        <Link className="text-link" href={`/seller/assets/${asset.id}/edit`}>Edit asset</Link>
        <SellerStatusForm assetId={asset.id} status={asset.status} />
      </div>
    </article>
  );
}
