import type * as React from "react"

import { cn } from "@/lib/utils"

export function CornerMarkers({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative", className)}
      {...props}
    >
      <span className="absolute -top-[4.5px] -left-[4.5px] z-20 size-2 border border-line bg-background" />
      <span className="absolute -top-[4.5px] -right-[4.5px] z-20 size-2 border border-line bg-background" />
      <span className="absolute -bottom-[4.5px] -left-[4.5px] z-20 size-2 border border-line bg-background" />
      <span className="absolute -bottom-[4.5px] -right-[4.5px] z-20 size-2 border border-line bg-background" />
    </div>
  )
}
