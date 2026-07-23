/**
 * Adapted from ThemeToggleButton1 by @gurvinder-singh02 (Skiper UI),
 * originally inspired by https://toggles.dev/. Rebuilt with plain CSS
 * transitions to avoid the framer-motion dep.
 * Used under Skiper UI free-tier attribution terms.
 */
"use client"

import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, mounted } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center border border-line bg-background p-1.5 text-foreground transition-all duration-300 hover:bg-accent active:scale-95",
        !mounted && "pointer-events-none opacity-0",
        className,
      )}
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="size-full"
      >
        <g
          className="origin-center [transform-box:fill-box] transition-transform duration-300 ease-in-out"
          style={{ transform: `rotate(${isDark ? -180 : 0}deg)` }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            className="fill-foreground"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            className="fill-background"
          />
        </g>
        <path
          className="origin-center fill-foreground [transform-box:fill-box] transition-transform duration-300 ease-in-out"
          style={{ transform: `rotate(${isDark ? 180 : 0}deg)` }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
        />
      </svg>
    </button>
  )
}
