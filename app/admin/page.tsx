import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAdminStatistics } from "@/features/admin/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const statistics = await getAdminStatistics();
  const cards = [
    { label: "Total users", value: statistics.totalUsers },
    { label: "Buyers", value: statistics.buyers },
    { label: "Sellers", value: statistics.sellers },
    { label: "Published assets", value: statistics.publishedAssets },
    { label: "Suspended users", value: statistics.suspendedUsers },
    { label: "Archived assets", value: statistics.suspendedAssets },
  ] as const;

  return (
    <>
      <SiteHeader />
      <main className="admin-dashboard container">
        <div className="admin-dashboard__heading">
          <div>
            <p className="eyebrow">Platform manager</p>
            <h1>Marketplace oversight.</h1>
            <p>Review participants and opportunities while keeping the demo marketplace healthy.</p>
          </div>
          <div className="admin-dashboard__actions">
            <Link className="link-button link-button--secondary" href="/admin/users">Manage users</Link>
            <Link className="link-button link-button--primary" href="/admin/assets">Review assets</Link>
          </div>
        </div>
        <section aria-label="Marketplace statistics" className="admin-stat-grid">
          {cards.map((card) => (
            <article key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
