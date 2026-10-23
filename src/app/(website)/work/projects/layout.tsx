import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Discover Lifeline Achham's community projects focused on engagement, youth learning, health awareness, participation and sustainable social impact in Achham, Nepal.",

  keywords: [
    "Lifeline Achham projects",
    "Achham NGO projects",
    "community projects Achham",
    "community development projects Nepal",
    "youth learning Achham",
    "health awareness projects Achham",
    "community engagement Nepal",
    "social impact projects Nepal",
  ],

  alternates: {
    canonical: `${siteConfig.url}/work/projects`,
  },

  openGraph: {
    title: "Projects | Lifeline Achham",
    description:
      "Discover Lifeline Achham's community projects focused on engagement, youth learning, health awareness, participation and sustainable social impact in Achham, Nepal.",
    url: `${siteConfig.url}/work/projects`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: "Lifeline Achham Community Projects",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Projects | Lifeline Achham",
    description:
      "Discover Lifeline Achham's community projects and initiatives supporting meaningful social impact in Achham, Nepal.",
    images: [siteConfig.seo.image],
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
