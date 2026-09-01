import Link from "next/link";

import type { BuyerRecommendation } from "@/features/buyer/buyer-types";

type RecommendationCardProps = Readonly<{
  recommendation: BuyerRecommendation;
}>;

function formatCurrency(value: string, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { asset, reasons, score } = recommendation;

  return (
    <article className="recommendation-card">
      <div className="recommendation-card__header">
        <p>{asset.industry} · {asset.location}</p>
        <strong>{score}% match</strong>
      </div>
      <h2>{asset.title}</h2>
      <p className="recommendation-card__copy">{asset.description}</p>
      <dl>
        <div><dt>Indicative valuation</dt><dd>{formatCurrency(asset.valuation, asset.currency)}</dd></div>
      </dl>
      <div className="recommendation-card__footer">
        <ul aria-label="Match reasons">{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <Link className="text-link" href={`/assets/${asset.id}`}>View opportunity</Link>
      </div>
    </article>
  );
}
