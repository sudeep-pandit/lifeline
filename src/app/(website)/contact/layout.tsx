import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Lifeline Achham to learn more about our work, community activities, volunteering, blood donation support and opportunities to work together in Achham, Nepal.",

  keywords: [
    "Lifeline Achham contact",
    "contact Lifeline Achham",
    "Lifeline Achham email",
    "Achham NGO contact",
    "NGO Achham Nepal",
    "community organization Achham",
    "volunteer Achham",
    "blood donation Achham",
  ],

  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },

  openGraph: {
    title: "Contact Us | Lifeline Achham",
    description:
      "Contact Lifeline Achham to learn more about our work, community activities, volunteering, blood donation support and opportunities to work together in Achham, Nepal.",
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Contact Lifeline Achham",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Lifeline Achham",
    description:
      "Get in touch with Lifeline Achham about our community work, volunteering, blood donation support and collaboration opportunities.",
    images: [siteConfig.seo.image],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
