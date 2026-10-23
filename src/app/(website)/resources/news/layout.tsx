import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "News & Notices",
  description:
    "Read the latest news, notices, community updates, activities and announcements from Lifeline Achham in Achham, Nepal.",

  keywords: [
    "Lifeline Achham news",
    "Lifeline Achham notices",
    "Achham NGO news",
    "Achham community news",
    "Lifeline Achham updates",
    "community development Achham",
    "NGO activities Achham",
    "social organization Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/resources/news`,
  },

  openGraph: {
    title: "News & Notices | Lifeline Achham",
    description:
      "Read the latest news, notices, community updates, activities and announcements from Lifeline Achham in Achham, Nepal.",
    url: `${siteConfig.url}/resources/news`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham News and Notices",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "News & Notices | Lifeline Achham",
    description:
      "Read the latest news, notices, community updates and announcements from Lifeline Achham.",
    images: [siteConfig.seo.image],
  },
};

export default function NewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
