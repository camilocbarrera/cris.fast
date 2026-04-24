import type * as React from "react"

import { cn } from "@/lib/utils"

export function Separator({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 -left-[100vw] -z-10 h-full w-[200vw] opacity-[0.56]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(315deg, var(--line) 0, var(--line) 1px, transparent 0, transparent 50%)",
          backgroundSize: "10px 10px",
        }}
      />
    </div>
  )
}
