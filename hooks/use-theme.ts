"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const stored = window.localStorage.getItem("theme")
  if (stored === "light" || stored === "dark") return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(readTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("theme", theme)
  }, [theme, mounted])

  return {
    theme,
    mounted,
    toggle: () =>
      setTheme((t) => (t === "dark" ? "light" : "dark")),
  }
}
