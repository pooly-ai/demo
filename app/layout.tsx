import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pooly.AI — Payments built for agents, not humans.",
  description:
    "See how Pooly.AI gives AI agents managed wallets and gives merchants the tools to verify and accept agent payments.",
  openGraph: {
    title: "Pooly.AI Demo",
    description: "Payments built for agents, not humans.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
