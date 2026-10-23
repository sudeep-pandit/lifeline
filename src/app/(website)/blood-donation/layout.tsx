
import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blood Donation",
  description:
    "Learn about blood donation, donor eligibility, the donation process and how you can support blood-related community needs through Lifeline Achham.",

  keywords: [
    "Lifeline Achham blood donation",
    "blood donation Achham",
    "blood donor Achham",
    "blood donation Nepal",
    "blood support Achham",
    "blood donor registration Achham",
    "community blood donation Nepal",
    "Lifeline Achham donor",
  ],

  alternates: {
    canonical: `${siteConfig.url}/blood-donation`,
  },

  openGraph: {
    title: "Blood Donation | Lifeline Achham",
    description:
      "Learn about blood donation, donor eligibility, the donation process and how you can support blood-related community needs through Lifeline Achham.",
    url: `${siteConfig.url}/blood-donation`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Blood Donation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Blood Donation | Lifeline Achham",
    description:
      "Learn about blood donation and how you can support blood-related community needs through Lifeline Achham.",
    images: [siteConfig.seo.image],
  },
};

export default function BloodDonationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
