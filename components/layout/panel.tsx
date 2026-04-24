import type * as React from "react"

import { cn } from "@/lib/utils"

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "screen-line-top screen-line-bottom border-x border-line",
        className,
      )}
      {...props}
    />
  )
}

function PanelHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn("screen-line-bottom space-y-1 px-4 py-4", className)}
      {...props}
    />
  )
}

type PanelTitleProps = React.ComponentProps<"h2"> & { as?: "h1" | "h2" | "h3" }

function PanelTitle({ className, as: Tag = "h2", ...props }: PanelTitleProps) {
  return (
    <Tag
      data-slot="panel-title"
      className={cn("text-2xl text-balance md:text-3xl", className)}
      {...props}
    />
  )
}

function PanelDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-description"
      className={cn("text-sm text-muted-foreground text-pretty", className)}
      {...props}
    />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-content"
      className={cn("p-4", className)}
      {...props}
    />
  )
}

export { Panel, PanelHeader, PanelTitle, PanelDescription, PanelContent }
