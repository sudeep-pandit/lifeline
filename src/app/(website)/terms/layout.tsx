import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Terms & Conditions for using the Lifeline Achham website, including website use, information, participation, donations, intellectual property and contact information.",

  keywords: [
    "Lifeline Achham terms",
    "Lifeline Achham terms and conditions",
    "Lifeline Achham website terms",
    "Lifeline Achham policies",
    "NGO website terms Nepal",
    "Lifeline Achham Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },

  openGraph: {
    title: "Terms & Conditions | Lifeline Achham",
    description:
      "Read the Terms & Conditions for using the Lifeline Achham website, including website use, information, participation, donations, intellectual property and contact information.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Terms and Conditions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Lifeline Achham",
    description:
      "Read the Terms & Conditions for using the Lifeline Achham website.",
    images: [siteConfig.seo.image],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
