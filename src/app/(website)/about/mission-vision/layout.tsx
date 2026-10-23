import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mission & Vision",
  description:
    "Explore Lifeline Achham's mission, vision, objectives and principles for building healthier, more aware, empowered and engaged communities in Achham, Nepal.",

  keywords: [
    "Lifeline Achham mission",
    "Lifeline Achham vision",
    "Lifeline Achham objectives",
    "Achham community development",
    "community empowerment Nepal",
    "health awareness Achham",
    "youth participation Achham",
    "social impact Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/about/mission-vision`,
  },

  openGraph: {
    title: "Mission & Vision | Lifeline Achham",
    description:
      "Explore Lifeline Achham's mission, vision, objectives and principles for building healthier, more aware, empowered and engaged communities in Achham, Nepal.",
    url: `${siteConfig.url}/about/mission-vision`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Mission and Vision",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mission & Vision | Lifeline Achham",
    description:
      "Explore Lifeline Achham's mission, vision, objectives and principles for meaningful community development in Achham, Nepal.",
    images: [siteConfig.seo.image],
  },
};

export default function MissionVisionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
