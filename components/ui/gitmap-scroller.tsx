"use client"

import { useCallback, type ComponentProps } from "react"

// Horizontal scroll container that starts scrolled fully to the right, so the
// most recent weeks are what you see first. Uses a ref callback (runs during
// commit, before paint) to avoid a left-then-jump flash.
export function GitmapScroller(props: ComponentProps<"div">) {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollLeft = node.scrollWidth
  }, [])

  return <div ref={ref} {...props} />
}
