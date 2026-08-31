import type { ReactNode } from "react";

type LinkButtonProps = Readonly<{
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}>;

export function LinkButton({ children, href, variant = "primary" }: LinkButtonProps) {
  return (
    <a className={`link-button link-button--${variant}`} href={href}>
      {children}
    </a>
  );
}
