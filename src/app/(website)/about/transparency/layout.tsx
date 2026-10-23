
import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Learn about Lifeline Achham's commitment to accountability, responsible governance, clear documentation, financial responsibility and community trust.",

  keywords: [
    "Lifeline Achham transparency",
    "Lifeline Achham accountability",
    "Lifeline Achham reports",
    "NGO transparency Nepal",
    "NGO accountability Achham",
    "community organization Achham",
    "responsible governance Nepal",
    "financial accountability NGO",
  ],

  alternates: {
    canonical: `${siteConfig.url}/about/transparency`,
  },

  openGraph: {
    title: "Transparency | Lifeline Achham",
    description:
      "Learn about Lifeline Achham's commitment to accountability, responsible governance, clear documentation, financial responsibility and community trust.",
    url: `${siteConfig.url}/about/transparency`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Transparency",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Transparency | Lifeline Achham",
    description:
      "Learn about Lifeline Achham's commitment to accountability, responsible governance and community trust.",
    images: [siteConfig.seo.image],
  },
};

export default function TransparencyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
