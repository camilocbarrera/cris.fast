import type { Metadata } from "next"

import { TerminalShell } from "@/components/terminal/terminal-shell"

export const metadata: Metadata = {
  // `absolute` skips the site-wide ", Cristian Correa" title template.
  title: { absolute: "cris cli" },
  description:
    "Cristian Correa's profile as a terminal. Type `help` to look around — experience, projects, awards, neofetch.",
  alternates: { canonical: "https://cris.fast/cli" },
  openGraph: {
    title: "cris cli",
    description:
      "Cristian Correa's profile as a terminal. Type `help` to look around.",
    url: "https://cris.fast/cli",
    siteName: "cris.fast",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "cris cli",
    description: "My profile as a terminal. Type `help` to look around.",
  },
}

export default function CliPage() {
  return (
    <main className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto md:max-w-3xl">
        {/* The banner introduces the page — the heading stays for a11y and SEO. */}
        <h1 className="sr-only">
          cris cli — the profile of Cristian Correa as a terminal
        </h1>

        <div className="screen-line-bottom relative border-x border-line p-2">
          {/* Fills the viewport, but capped so it stops growing on tall displays. */}
          <div className="h-[calc(100dvh-5rem)] max-h-[720px] min-h-[320px]">
            {/* Static fallback for no-JS clients; wterm replaces it on boot. */}
            <noscript>
              <div className="flex h-full items-center justify-center p-6 text-center font-mono text-sm text-muted-foreground">
                This terminal needs JavaScript.{" "}
                <a href="/" className="underline underline-offset-4">
                  The regular site
                </a>{" "}
                has everything too.
              </div>
            </noscript>
            <TerminalShell />
          </div>

          <span
            aria-hidden
            className="absolute -bottom-[4.5px] -left-[4.5px] z-20 block size-2 border border-line bg-background"
          />
          <span
            aria-hidden
            className="absolute -bottom-[4.5px] -right-[4.5px] z-20 block size-2 border border-line bg-background"
          />
        </div>
      </div>
    </main>
  )
}
