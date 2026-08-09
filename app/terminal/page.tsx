import type { Metadata } from "next"

import { TerminalShell } from "@/components/terminal/terminal-shell"

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "The résumé of Cristian Correa as an interactive terminal. Run `help`, `experience`, `projects` and `awards` in a real VT-compatible shell running on WebAssembly.",
  alternates: { canonical: "https://cris.fast/terminal" },
  openGraph: {
    title: "Terminal, Cristian Correa",
    description:
      "The résumé of Cristian Correa as an interactive terminal. Type `help` to start.",
    url: "https://cris.fast/terminal",
    siteName: "cris.fast",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terminal, Cristian Correa",
    description: "My résumé as an interactive terminal. Type `help` to start.",
  },
}

export default function TerminalPage() {
  return (
    <main className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto md:max-w-3xl">
        {/* The banner introduces the page — the heading stays for a11y and SEO. */}
        <h1 className="sr-only">Terminal — Cristian Correa</h1>

        <div className="screen-line-bottom relative border-x border-line p-2">
          <div className="h-[calc(100dvh-5rem)] min-h-[320px]">
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
