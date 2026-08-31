import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "N5Deal Marketplace",
  description: "M&A opportunities and financial assets marketplace prototype",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
