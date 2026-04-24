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
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <g
              stroke="var(--line)"
              strokeWidth="0.6"
              strokeLinecap="round"
              fill="none"
            >
              <line x1="1.5" y1="1.5" x2="5.5" y2="5.5" />
              <line x1="5.5" y1="1.5" x2="1.5" y2="5.5" />
              <line x1="8.5" y1="8.5" x2="12.5" y2="12.5" />
              <line x1="12.5" y1="8.5" x2="8.5" y2="12.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
