import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";

const marketplaceSignalKeys = ["value", "roles", "conversations"] as const;

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section className="hero container" id="opportunities">
          <div className="hero__copy">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1>{t("title")}</h1>
            <p className="hero__summary">{t("summary")}</p>
            <div className="hero__actions" id="contact">
              <LinkButton href="#how-it-works">{t("explore")}</LinkButton>
              <LinkButton href="#quality" variant="secondary">
                {t("listBusiness")}
              </LinkButton>
            </div>
          </div>
          <aside aria-label={t("snapshotLabel")} className="signal-card">
            <div className="signal-card__heading">
              <span className="status-dot" />
              {t("curated")}
            </div>
            <p className="signal-card__title">{t("snapshotTitle")}</p>
            <dl className="signal-list">
              {marketplaceSignalKeys.map((labelKey) => (
                <div key={labelKey}>
                  <dt>{t(`signals.${labelKey}`)}</dt>
                  <dd>{t(`signals.${labelKey}Display`)}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section className="principles" id="how-it-works">
          <div className="container principles__grid">
            <p className="eyebrow">{t("principlesEyebrow")}</p>
            <h2>{t("principlesTitle")}</h2>
            <div className="principles__copy">
              <p>{t("principlesCopy")}</p>
              <a className="text-link" href="#quality">
                {t("standardLink")}
              </a>
            </div>
          </div>
        </section>

        <section className="quality container" id="quality">
          <div>
            <p className="eyebrow">{t("standardEyebrow")}</p>
            <h2>{t("standardTitle")}</h2>
          </div>
          <div className="quality__cards">
            <article>
              <span>01</span>
              <h3>{t("cards.dataTitle")}</h3>
              <p>{t("cards.dataCopy")}</p>
            </article>
            <article>
              <span>02</span>
              <h3>{t("cards.counterpartiesTitle")}</h3>
              <p>{t("cards.counterpartiesCopy")}</p>
            </article>
            <article>
              <span>03</span>
              <h3>{t("cards.oversightTitle")}</h3>
              <p>{t("cards.oversightCopy")}</p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
