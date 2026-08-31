import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";

const marketplaceSignals = [
  ["€1M–€25M", "Typical opportunity value"],
  ["3 roles", "Buyer, seller, and manager"],
  ["One place", "For high-intent conversations"],
] as const;

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section className="hero container" id="opportunities">
          <div className="hero__copy">
            <p className="eyebrow">Private market, clearly connected</p>
            <h1>More signal. Better conversations. Stronger deals.</h1>
            <p className="hero__summary">
              N5Deal brings focused investors and credible business opportunities into one deliberate
              marketplace.
            </p>
            <div className="hero__actions" id="contact">
              <LinkButton href="#how-it-works">Explore opportunities</LinkButton>
              <LinkButton href="#quality" variant="secondary">
                List a business
              </LinkButton>
            </div>
          </div>
          <aside aria-label="Marketplace snapshot" className="signal-card">
            <div className="signal-card__heading">
              <span className="status-dot" />
              Curated marketplace
            </div>
            <p className="signal-card__title">A cleaner starting point for every transaction.</p>
            <dl className="signal-list">
              {marketplaceSignals.map(([value, label]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section className="principles" id="how-it-works">
          <div className="container principles__grid">
            <p className="eyebrow">Built for intent</p>
            <h2>Private-market discovery without the usual noise.</h2>
            <div className="principles__copy">
              <p>
                Sellers present the fundamentals. Buyers articulate what they are looking for. Platform
                managers keep the marketplace credible.
              </p>
              <a className="text-link" href="#quality">
                See the marketplace standard
              </a>
            </div>
          </div>
        </section>

        <section className="quality container" id="quality">
          <div>
            <p className="eyebrow">The N5Deal standard</p>
            <h2>Designed for the decisions behind the headline number.</h2>
          </div>
          <div className="quality__cards">
            <article>
              <span>01</span>
              <h3>Structured opportunity data</h3>
              <p>Clear context makes the first conversation worth having.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Relevant counterparties</h3>
              <p>Profiles make fit visible before time is spent.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Human marketplace oversight</h3>
              <p>Quality management keeps the product useful as it grows.</p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
