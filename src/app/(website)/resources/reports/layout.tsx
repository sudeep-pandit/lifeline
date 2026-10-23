import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Access reports and documentation from Lifeline Achham, including organizational, financial, program and community-focused reports.",

  keywords: [
    "Lifeline Achham reports",
    "Lifeline Achham annual report",
    "Lifeline Achham financial report",
    "Achham NGO reports",
    "NGO reports Nepal",
    "community development reports Achham",
    "social organization reports Nepal",
    "program reports Achham",
  ],

  alternates: {
    canonical: `${siteConfig.url}/resources/reports`,
  },

  openGraph: {
    title: "Reports | Lifeline Achham",
    description:
      "Access reports and documentation from Lifeline Achham, including organizational, financial, program and community-focused reports.",
    url: `${siteConfig.url}/resources/reports`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Reports",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Reports | Lifeline Achham",
    description:
      "Access organizational, financial, program and community-focused reports from Lifeline Achham.",
    images: [siteConfig.seo.image],
  },
};

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
