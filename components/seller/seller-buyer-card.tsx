import { ContactBuyerForm } from "./contact-buyer-form";

import type { SellerBuyer } from "@/features/seller/seller-types";

type SellerBuyerCardProps = Readonly<{
  buyer: SellerBuyer;
}>;

function formatBudget(value: string | null, currency: string): string {
  if (value === null) {
    return "Flexible";
  }

  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

function budgetLabel(buyer: SellerBuyer): string {
  const minimum = formatBudget(buyer.budgetMin, buyer.currency);
  const maximum = formatBudget(buyer.budgetMax, buyer.currency);

  if (buyer.budgetMin === null && buyer.budgetMax === null) {
    return "Flexible budget";
  }

  if (buyer.budgetMin === null) {
    return `Up to ${maximum}`;
  }

  if (buyer.budgetMax === null) {
    return `${minimum}+`;
  }

  return `${minimum} – ${maximum}`;
}

export function SellerBuyerCard({ buyer }: SellerBuyerCardProps) {
  return (
    <article className="seller-buyer-card">
      <header className="seller-buyer-card__header">
        <div>
          <p>Buyer profile</p>
          <h2>{buyer.companyName ?? buyer.name}</h2>
          {buyer.companyName !== null && buyer.companyName !== buyer.name ? <span>{buyer.name}</span> : null}
        </div>
        {buyer.matchScore === null ? <span className="seller-buyer-card__score">Publish an asset to match</span> : (
          <strong className="seller-buyer-card__score">{buyer.matchScore}% match</strong>
        )}
      </header>
      <p className="seller-buyer-card__interests">{buyer.interests}</p>
      <dl className="seller-buyer-card__facts">
        <div><dt>Budget</dt><dd>{budgetLabel(buyer)}</dd></div>
        <div><dt>Industries</dt><dd>{buyer.industries.join(", ")}</dd></div>
        <div><dt>Locations</dt><dd>{buyer.preferredLocations.join(", ")}</dd></div>
      </dl>
      {buyer.matchReasons.length > 0 ? (
        <ul aria-label="Match reasons" className="seller-buyer-card__reasons">
          {buyer.matchReasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      ) : null}
      <ContactBuyerForm buyerId={buyer.id} />
    </article>
  );
}
