import Link from "next/link";

import { N5DealMark } from "@/components/ui/n5deal-mark";

const navigationItems = [
  { href: "/marketplace", label: "Opportunities" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#quality", label: "Our standard" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav aria-label="Primary navigation" className="site-nav container">
        <Link aria-label="N5Deal home" className="brand-link" href="/">
          <N5DealMark />
        </Link>
        <div className="site-nav__links">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <Link className="site-nav__cta" href="/#contact">
          Join N5Deal
        </Link>
      </nav>
    </header>
  );
}
