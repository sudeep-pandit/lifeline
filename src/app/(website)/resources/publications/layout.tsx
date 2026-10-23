import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Explore guides, awareness materials, handbooks, learning resources and publications from Lifeline Achham supporting community participation, health awareness and development.",

  keywords: [
    "Lifeline Achham publications",
    "Lifeline Achham resources",
    "Achham NGO publications",
    "community development resources Nepal",
    "community awareness materials",
    "youth participation handbook",
    "health awareness materials Achham",
    "community engagement guide Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/resources/publications`,
  },

  openGraph: {
    title: "Publications | Lifeline Achham",
    description:
      "Explore guides, awareness materials, handbooks, learning resources and publications from Lifeline Achham supporting community participation, health awareness and development.",
    url: `${siteConfig.url}/resources/publications`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Publications",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Publications | Lifeline Achham",
    description:
      "Explore guides, awareness materials, handbooks and learning resources from Lifeline Achham.",
    images: [siteConfig.seo.image],
  },
};

export default function PublicationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
