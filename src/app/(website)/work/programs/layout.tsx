import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Lifeline Achham's community-focused programs supporting wellbeing, youth participation, education, health awareness and meaningful community engagement in Achham, Nepal.",

  keywords: [
    "Lifeline Achham programs",
    "NGO programs Achham",
    "community programs Achham",
    "community development programs Nepal",
    "health awareness programs Achham",
    "youth education Achham",
    "youth participation Nepal",
    "community wellbeing Achham",
  ],

  alternates: {
    canonical: `${siteConfig.url}/work/programs`,
  },

  openGraph: {
    title: "Programs | Lifeline Achham",
    description:
      "Explore Lifeline Achham's community-focused programs supporting wellbeing, youth participation, education, health awareness and meaningful community engagement in Achham, Nepal.",
    url: `${siteConfig.url}/work/programs`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Programs",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Programs | Lifeline Achham",
    description:
      "Explore Lifeline Achham's community-focused programs supporting wellbeing, youth participation, education and health awareness.",
    images: [siteConfig.seo.image],
  },
};

export default function ProgramsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
