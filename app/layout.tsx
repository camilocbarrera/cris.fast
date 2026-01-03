import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://cris.fast"),
  title: "Cris",
  description: "Developer portfolio",
  generator: "v0.app",
  openGraph: {
    title: "Cris - Software Engineer - Data",
    description: "Software Engineer - Data",
    images: [
      {
        url: "/og-cris.png",
        width: 1200,
        height: 630,
        alt: "Cris",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cris - Software Engineer - Data",
    description: "Software Engineer Data portfolio",
    images: ["/og-cris.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark overflow-hidden">
      <body className={`font-sans antialiased overflow-hidden fixed inset-0`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
