import type { Metadata } from "next";

import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import ScrollToTop from "@/components/website/ScrollToTop";

import { siteConfig } from "@/config/site";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.seo.description,

keywords: [...siteConfig.keywords],
  authors: [
    {
      name: siteConfig.name,
    },
  ],

  creator: siteConfig.name,

  publisher: siteConfig.name,

  applicationName: siteConfig.name,

  category: "Nonprofit Organization",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_NP",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: siteConfig.seo.image,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Community Development & Social Impact`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.image],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    description: siteConfig.seo.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Achham",
      addressCountry: "NP",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.seo.description,
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <Navbar />

      <main>{children}</main>

      <Footer />

      <ScrollToTop />
    </div>
  );
}
