import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Lifeline Achham, our community-focused approach, values and commitment to creating meaningful social impact in Achham, Nepal.",

  keywords: [
    "Lifeline Achham",
    "about Lifeline Achham",
    "Achham NGO",
    "community organization Achham",
    "social organization Nepal",
    "community development Achham",
  ],

  alternates: {
    canonical: `${siteConfig.url}/about`,
  },

  openGraph: {
    title: "About Us | Lifeline Achham",
    description:
      "Learn about Lifeline Achham, our community-focused approach, values and commitment to creating meaningful social impact in Achham, Nepal.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "About Lifeline Achham",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us | Lifeline Achham",
    description:
      "Learn about Lifeline Achham, our community-focused approach, values and commitment to creating meaningful social impact in Achham, Nepal.",
    images: [siteConfig.seo.image],
  },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
