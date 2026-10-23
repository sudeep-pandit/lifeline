import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the people behind Lifeline Achham and learn about the team working to support community wellbeing, participation, awareness and meaningful social impact in Achham, Nepal.",

  keywords: [
    "Lifeline Achham team",
    "Lifeline Achham members",
    "Lifeline Achham leadership",
    "Achham NGO team",
    "social organization Achham",
    "community development Nepal",
    "volunteer organization Achham",
  ],

  alternates: {
    canonical: `${siteConfig.url}/about/team`,
  },

  openGraph: {
    title: "Our Team | Lifeline Achham",
    description:
      "Meet the people behind Lifeline Achham and learn about the team working to support community wellbeing, participation, awareness and meaningful social impact in Achham, Nepal.",
    url: `${siteConfig.url}/about/team`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Team",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Our Team | Lifeline Achham",
    description:
      "Meet the people behind Lifeline Achham and learn about our community-focused work in Achham, Nepal.",
    images: [siteConfig.seo.image],
  },
};

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
