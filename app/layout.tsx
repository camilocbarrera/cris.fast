import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { ProgressiveBlur } from "@/components/layout/progressive-blur"
import { SiteHeader } from "@/components/layout/site-header"
import "./globals.css"

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var c=document.documentElement.classList;if(t==='dark')c.add('dark');else c.remove('dark');}catch(e){}})();`

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cris.fast"),
  title: {
    default: "Cristian Correa — Data & AI Engineer",
    template: "%s — Cristian Correa",
  },
  description:
    "Cristian Correa (Cris) — Data & AI Engineer from Bogotá, Colombia. Creator of Kebo. Building production AI systems and data platforms.",
  keywords: [
    "Cristian Correa",
    "Cris Correa",
    "Data Engineer",
    "AI Engineer",
    "Kebo",
    "Crafter Station",
    "Bogotá",
    "Colombia",
    "LLM",
    "RAG",
    "dbt",
    "Snowflake",
  ],
  authors: [{ name: "Cristian Correa", url: "https://cris.fast" }],
  creator: "Cristian Correa",
  alternates: {
    canonical: "https://cris.fast",
  },
  openGraph: {
    title: "Cristian Correa — Data & AI Engineer",
    description:
      "Data & AI Engineer from Bogotá, Colombia. Creator of Kebo. Building production AI systems and data platforms.",
    url: "https://cris.fast",
    siteName: "cris.fast",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cristian Correa" }],
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristian Correa — Data & AI Engineer",
    description:
      "Data & AI Engineer from Bogotá, Colombia. Creator of Kebo.",
    images: ["/og-twitter.png"],
    creator: "@camilocbarrera",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Cristian Correa",
  alternateName: ["Cris Correa", "Cris"],
  url: "https://cris.fast",
  image: "https://cris.fast/og.png",
  jobTitle: "Data & AI Engineer",
  description:
    "Statistician and software engineer building production AI systems and data platforms. Creator of Kebo.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bogotá",
    addressCountry: "CO",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidad El Bosque",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Large Language Models",
    "Retrieval Augmented Generation",
    "Data Engineering",
    "dbt",
    "Snowflake",
    "BigQuery",
    "TypeScript",
    "Python",
    "SQL",
  ],
  sameAs: [
    "https://github.com/camilocbarrera",
    "https://www.linkedin.com/in/cristiancamilocorrea/",
    "https://x.com/camilocbarrera",
    "https://www.instagram.com/cristiancorrea.xyz/",
    "https://kebo.app",
  ],
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "cris.fast",
  url: "https://cris.fast",
  author: { "@type": "Person", name: "Cristian Correa" },
  inLanguage: "en",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <body className="font-serif">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <SiteHeader />
        {children}
        <ProgressiveBlur position="top" />
        <ProgressiveBlur position="bottom" />
        <Analytics />
      </body>
    </html>
  )
}
