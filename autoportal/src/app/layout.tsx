import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://autofyon.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07090c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "أوتوفيون | AutoFyon — المنصة الأولى للسيارات ومعارض السيارات في مصر",
    template: "%s | أوتوفيون AutoFyon",
  },
  description:
    "البوابة المركزية الأولى لسوق ومعارض السيارات في مصر. استكشف أحدث السيارات، الوكلاء المعتمدين، أسعار ومواصفات السيارات، والحلول الرقمية المتطورة لإدارة المعارض.",
  keywords: [
    "AutoFyon",
    "أوتوفيون",
    "سيارات مصر",
    "معارض سيارات",
    "سوق السيارات مصر",
    "أسعار السيارات اليوم",
    "برنامج معارض السيارات",
    "شراء سيارة في مصر",
    "وكلاء السيارات المعتمدين",
    "سيارات للبيع مصر",
    "تقسيط سيارات مصر",
  ],
  authors: [{ name: "AutoFyon", url: BASE_URL }],
  creator: "AutoFyon",
  publisher: "AutoFyon",
  applicationName: "AutoFyon",
  category: "automotive",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-EG": "/",
      "en-US": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: BASE_URL,
    siteName: "AutoFyon — أوتوفيون",
    title: "أوتوفيون | AutoFyon — المنصة الأولى للسيارات ومعارض السيارات في مصر",
    description:
      "البوابة المركزية الأولى لسوق ومعارض السيارات في مصر: استكشاف السيارات، شبكة المعارض المعتمدة، وبرامج إدارة المعارض المتطورة.",
    images: [
      {
        url: "/brand/autofyon-logo-dark.png",
        width: 1200,
        height: 630,
        alt: "AutoFyon.com — منصة سوق ومعارض السيارات في مصر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أوتوفيون | AutoFyon — المنصة الأولى للسيارات في مصر",
    description:
      "البوابة المركزية الأولى لسوق ومعارض السيارات في مصر. استكشف السيارات والمعارض وحلول الإدارة المتكاملة.",
    images: ["/brand/autofyon-logo-dark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Passthrough root.
 *
 * `<html>` / `<body>` are rendered by the two locale root layouts --
 * `(ar)/layout.tsx` for the bare path and `en/layout.tsx` for `/en` -- because
 * `lang` and `dir` belong to the tree that answers the request. Keeping them here
 * instead could only ever describe one of the two languages correctly.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
