import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = "https://sfgop-endorsement-lookup.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SFGOP Endorsement Lookup",
  description:
    "Find Republican-endorsed candidates in San Francisco for the June 2026 primary. Enter your address, ZIP code, or city.",
  openGraph: {
    type: "website",
    title: "SFGOP Endorsement Lookup",
    description:
      "Find Republican-endorsed candidates in San Francisco for the June 2026 primary. Enter your address, ZIP code, or city.",
    siteName: "San Francisco Republican Party",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SFGOP Endorsement Lookup",
    description:
      "Find Republican-endorsed candidates in San Francisco for the June 2026 primary.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
