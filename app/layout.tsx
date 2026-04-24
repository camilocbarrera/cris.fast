import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

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
  title: "Cris",
  description: "Cristian Correa — Software Engineer building data-intensive applications.",
  openGraph: {
    title: "Cris — Software Engineer",
    description: "Cristian Correa — Software Engineer building data-intensive applications.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cristian Correa" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cris — Software Engineer",
    description: "Cristian Correa — Software Engineer building data-intensive applications.",
    images: ["/og-twitter.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
