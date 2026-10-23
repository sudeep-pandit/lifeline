import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lifeline Achham",
    template: "%s | Lifeline Achham",
  },

  description:
    "Lifeline Achham is a community-focused organization working to promote health, awareness, empowerment and meaningful social impact across Achham, Nepal.",

  keywords: [
    "Lifeline Achham",
    "Lifeline Achham Nepal",
    "Achham NGO",
    "NGO in Achham",
    "social organization Achham",
    "community development Achham",
    "health awareness Achham",
    "blood donation Achham",
    "community empowerment Nepal",
    "social impact Nepal",
  ],

  authors: [
    {
      name: "Lifeline Achham",
    },
  ],

  creator: "Lifeline Achham",
  publisher: "Lifeline Achham",

  metadataBase: new URL("https://lifelineachham.org.np"),

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_NP",
    siteName: "Lifeline Achham",
    title: "Lifeline Achham | Community Development & Social Impact",
    description:
      "Lifeline Achham is a community-focused organization working to promote health, awareness, empowerment and meaningful social impact across Achham, Nepal.",
    url: "https://lifelineachham.org.np",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lifeline Achham",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lifeline Achham | Community Development & Social Impact",
    description:
      "Lifeline Achham is a community-focused organization working to promote health, awareness, empowerment and meaningful social impact across Achham, Nepal.",
    images: ["/images/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
