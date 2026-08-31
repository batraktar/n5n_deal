import { N5DealMark } from "@/components/ui/n5deal-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__content">
        <N5DealMark />
        <p>Marketplace infrastructure for thoughtful M&A conversations.</p>
        <span>Prototype · 2026</span>
      </div>
    </footer>
  );
}
