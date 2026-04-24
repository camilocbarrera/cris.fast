import type * as React from "react"
import { useId } from "react"

import { cn } from "@/lib/utils"

export function Separator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const patternId = useId()

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "screen-line-top screen-line-bottom relative flex h-8 w-full border-x border-line",
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute top-0 -left-[100vw] -z-10 h-full w-[200vw]"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <g
              stroke="var(--line)"
              strokeWidth="0.5"
              strokeLinecap="round"
              fill="none"
            >
              <line x1="1" y1="1" x2="4" y2="4" />
              <line x1="4" y1="1" x2="1" y2="4" />
              <line x1="6" y1="6" x2="9" y2="9" />
              <line x1="9" y1="6" x2="6" y2="9" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
