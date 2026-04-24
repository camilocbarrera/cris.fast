/**
 * Based on ProgressiveBlur by @gurvinder-singh02 (Skiper UI).
 * Used under Skiper UI free-tier attribution terms.
 * https://skiper-ui.com
 */
"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type ProgressiveBlurProps = {
  className?: string
  backgroundColor?: string
  position?: "top" | "bottom"
  height?: string
  blurAmount?: string
  threshold?: number
}

export function ProgressiveBlur({
  className,
  backgroundColor = "var(--background)",
  position = "top",
  height = "90px",
  blurAmount = "3px",
  threshold = 4,
}: ProgressiveBlurProps) {
  const isTop = position === "top"
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY
      const vv = window.visualViewport
      const viewport = vv ? vv.height : window.innerHeight
      const doc = document.documentElement.scrollHeight

      if (isTop) {
        setVisible(scrollY > threshold)
      } else {
        setVisible(scrollY + viewport < doc - threshold)
      }
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    window.visualViewport?.addEventListener("resize", update)
    window.visualViewport?.addEventListener("scroll", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.visualViewport?.removeEventListener("resize", update)
      window.visualViewport?.removeEventListener("scroll", update)
    }
  }, [isTop, threshold])

  const maskGradient = isTop
    ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
    : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 select-none transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        top: isTop ? 0 : `calc(100dvh - ${height})`,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
      }}
    />
  )
}
