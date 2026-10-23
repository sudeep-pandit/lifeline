import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photos from Lifeline Achham's community activities, awareness campaigns, programs, volunteer activities and events across Achham, Nepal.",

  keywords: [
    "Lifeline Achham gallery",
    "Lifeline Achham photos",
    "Achham NGO photos",
    "Achham community activities",
    "community events Achham",
    "health awareness Achham",
    "youth participation Achham",
    "NGO activities Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/resources/gallery`,
  },

  openGraph: {
    title: "Gallery | Lifeline Achham",
    description:
      "Explore photos from Lifeline Achham's community activities, awareness campaigns, programs, volunteer activities and events across Achham, Nepal.",
    url: `${siteConfig.url}/resources/gallery`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Gallery",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gallery | Lifeline Achham",
    description:
      "Explore photos from Lifeline Achham's community activities, programs, campaigns and events.",
    images: [siteConfig.seo.image],
  },
};

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
