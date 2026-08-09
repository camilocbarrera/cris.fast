"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Terminal, type TerminalHandle } from "@wterm/react"
import "@wterm/react/css"

import {
  contributionsUrl,
  isContributionsData,
  type ContributionsData,
} from "@/lib/github-contributions"
import { Shell, type ShellHost } from "./shell"

export function TerminalShell() {
  const handleRef = useRef<TerminalHandle | null>(null)
  const shellRef = useRef<Shell | null>(null)
  const readyRef = useRef(false)
  const [failed, setFailed] = useState(false)

  // One in-flight request per session, shared by repeated `contributions` runs.
  const contributionsRef = useRef<Promise<ContributionsData | null> | null>(null)

  const hostRef = useRef<ShellHost>({
    write: (data) => handleRef.current?.write(data),
    // Read live from the instance: autoResize keeps `cols` in sync with layout.
    cols: () => handleRef.current?.instance?.cols ?? 80,
    openUrl: (url) => window.open(url, "_blank", "noopener,noreferrer"),
    getTheme: () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    setTheme: (theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark")
      window.localStorage.setItem("theme", theme)
    },
    navigate: (path) => {
      window.location.href = path
    },
    scrollToBottom: () => {
      const el = handleRef.current?.instance?.element
      if (!el) return
      // wterm repaints on setTimeout(0) -> rAF, so queue behind that before
      // measuring scrollHeight; the second frame catches reflow from the
      // rows the repaint just added.
      const pin = () => {
        el.scrollTop = el.scrollHeight
      }
      setTimeout(() => {
        requestAnimationFrame(() => {
          pin()
          requestAnimationFrame(pin)
        })
      }, 0)
    },
    fetchContributions: () => {
      contributionsRef.current ??= fetch(contributionsUrl())
        .then((res) => (res.ok ? res.json() : null))
        .then((json: unknown) => (isContributionsData(json) ? json : null))
        .catch((error: unknown) => {
          console.error("[contributions] terminal fetch failed:", error)
          return null
        })
      return contributionsRef.current
    },
  })

  const boot = useCallback(() => {
    if (shellRef.current || !readyRef.current) return
    const shell = new Shell(hostRef.current)
    shellRef.current = shell
    shell.start()
    handleRef.current?.focus()
  }, [])

  const onReady = useCallback(() => {
    readyRef.current = true
    // Wait for the ResizeObserver's first measurement so the banner and the
    // line renderer see the real column count instead of the 80-col default.
    requestAnimationFrame(() => requestAnimationFrame(boot))
  }, [boot])

  const onData = useCallback((data: string) => {
    shellRef.current?.input(data)
  }, [])

  useEffect(() => {
    return () => {
      shellRef.current?.dispose()
      shellRef.current = null
      readyRef.current = false
    }
  }, [])

  if (failed) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center font-mono text-sm text-muted-foreground">
        <p>
          This browser could not start the terminal.{" "}
          <a href="/" className="underline underline-offset-4">
            Head back to the regular site
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <Terminal
      ref={handleRef}
      theme="cris"
      autoResize
      cursorBlink
      onReady={onReady}
      onData={onData}
      onError={(error) => {
        console.error("[wterm] failed to initialize", error)
        setFailed(true)
      }}
      className="h-full w-full"
      aria-label="Interactive terminal résumé for Cristian Correa"
    />
  )
}
