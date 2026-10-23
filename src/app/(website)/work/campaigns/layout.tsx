import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Campaigns",
  description:
    "Explore Lifeline Achham's community campaigns focused on awareness, health, youth participation, community action and positive social impact in Achham, Nepal.",

  keywords: [
    "Lifeline Achham campaigns",
    "Achham community campaigns",
    "NGO campaigns Achham",
    "health awareness campaigns Achham",
    "community awareness Nepal",
    "youth participation campaigns Nepal",
    "community action Achham",
    "social awareness campaigns Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/work/campaigns`,
  },

  openGraph: {
    title: "Campaigns | Lifeline Achham",
    description:
      "Explore Lifeline Achham's community campaigns focused on awareness, health, youth participation, community action and positive social impact in Achham, Nepal.",
    url: `${siteConfig.url}/work/campaigns`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Community Campaigns",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Campaigns | Lifeline Achham",
    description:
      "Explore Lifeline Achham's community campaigns supporting awareness, health, youth participation and community action in Achham, Nepal.",
    images: [siteConfig.seo.image],
  },
};

export default function CampaignsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
