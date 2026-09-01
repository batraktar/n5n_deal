import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAdminStatistics } from "@/features/admin/admin-repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const statistics = await getAdminStatistics();
  const cards = [
    { label: t("totalUsers"), value: statistics.totalUsers },
    { label: t("buyers"), value: statistics.buyers },
    { label: t("sellers"), value: statistics.sellers },
    { label: t("publishedAssets"), value: statistics.publishedAssets },
    { label: t("suspendedUsers"), value: statistics.suspendedUsers },
    { label: t("archivedAssets"), value: statistics.suspendedAssets },
  ] as const;

  return (
    <>
      <SiteHeader />
      <main className="admin-dashboard container">
        <div className="admin-dashboard__heading">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1>{t("title")}</h1>
            <p>{t("description")}</p>
          </div>
          <div className="admin-dashboard__actions">
            <Link className="link-button link-button--secondary" href="/admin/users">{t("manageUsers")}</Link>
            <Link className="link-button link-button--primary" href="/admin/assets">{t("reviewAssets")}</Link>
          </div>
        </div>
        <section aria-label={t("statistics")} className="admin-stat-grid">
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
