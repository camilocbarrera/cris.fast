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
    default: "Cristian Correa, Software Engineer",
    template: "%s, Cristian Correa",
  },
  description:
    "Cristian Correa (Cris), software engineer and statistician from Bogotá, Colombia. Founder of Croma and Kebo. Builds products with data, ML, and AI.",
  keywords: [
    "Cristian Correa",
    "Cris Correa",
    "Cristian Camilo Correa",
    "Software Engineer",
    "Statistician",
    "Data Engineer",
    "Machine Learning",
    "Kebo",
    "Croma",
    "Crafter Station",
    "Bogotá",
    "Colombia",
    "LLM",
    "dbt",
    "BigQuery",
  ],
  authors: [{ name: "Cristian Correa", url: "https://cris.fast" }],
  creator: "Cristian Correa",
  alternates: {
    canonical: "https://cris.fast",
  },
  openGraph: {
    title: "Cristian Correa, Software Engineer",
    description:
      "Software engineer and statistician from Bogotá, Colombia. Founder of Croma and Kebo. Builds products with data, ML, and AI.",
    url: "https://cris.fast",
    siteName: "cris.fast",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cristian Correa" }],
    type: "profile",
    locale: "en_US",
    firstName: "Cristian",
    lastName: "Correa",
    username: "camilocbarrera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristian Correa, Software Engineer",
    description:
      "Software Engineer and Statistician from Bogotá, Colombia.",
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
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://cris.fast/#person",
      name: "Cristian Correa",
      alternateName: ["Cris Correa", "Cris", "Cristian Camilo Correa"],
      url: "https://cris.fast",
      mainEntityOfPage: { "@id": "https://cris.fast/#profilepage" },
      image: "https://cris.fast/og.png",
      email: "mailto:cristian.correa.cs@gmail.com",
      jobTitle: "Software Engineer",
      description:
        "Software engineer and statistician with deep roots in big data engineering. Builds products with data, ML, and AI.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bogotá",
        addressCountry: "CO",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universidad El Bosque",
      },
      worksFor: [
        {
          "@type": "Organization",
          name: "Croma",
          url: "https://usecroma.com",
        },
        {
          "@type": "Organization",
          name: "Kebo",
          url: "https://kebo.app",
        },
        {
          "@type": "Organization",
          name: "Crafter Station",
          url: "https://crafterstation.com",
        },
      ],
      knowsLanguage: ["es", "en"],
      knowsAbout: [
        "Software Engineering",
        "Statistics",
        "Data Engineering",
        "Machine Learning",
        "Artificial Intelligence",
        "Large Language Models",
        "Real-time Data Systems",
        "dbt",
        "Snowflake",
        "BigQuery",
        "TypeScript",
        "Python",
        "SQL",
      ],
      award: [
        "ElevenLabs Prize, Agents Hackathon Brazil (2026)",
        "Online Winner, Platanus Hack (2025)",
        "1st Place, Vercel AI Gateway Hackathon (2025)",
        "1st Place, Llama Impact Hackathon by Meta (2024)",
        "1st Place, University Project Fair, El Bosque University (2024)",
        "1st Place, Web3 Startup World Cup Hackathon (2023)",
        "1st Place, University Project Fair, El Bosque University (2023)",
        "2nd Place, Best Entrepreneurship Project, El Bosque University (2023)",
        "1st Place, AI Fest Hackathon by Globant (2023)",
        "1st Place, CTF Cybersecurity Competition, El Bosque University (2023)",
      ],
      sameAs: [
        "https://github.com/camilocbarrera",
        "https://www.linkedin.com/in/cristiancamilocorrea/",
        "https://x.com/camilocbarrera",
        "https://www.instagram.com/cristiancorrea.xyz/",
        "https://kebo.app",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": "https://cris.fast/#profilepage",
      url: "https://cris.fast",
      name: "Cristian Correa, Software Engineer",
      mainEntity: { "@id": "https://cris.fast/#person" },
      dateCreated: "2026-01-03",
      dateModified: "2026-08-03",
      inLanguage: "en",
      isPartOf: { "@id": "https://cris.fast/#website" },
    },
    {
      "@type": "WebSite",
      "@id": "https://cris.fast/#website",
      name: "cris.fast",
      url: "https://cris.fast",
      description:
        "Personal site of Cristian Correa — software engineer and statistician from Bogotá, Colombia.",
      author: { "@id": "https://cris.fast/#person" },
      inLanguage: "en",
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="overflow-x-clip">
          <SiteHeader />
          {children}
        </div>
        <ProgressiveBlur position="bottom" />
        <Analytics />
      </body>
    </html>
  )
}
