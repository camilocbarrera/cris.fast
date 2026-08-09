"use client"

import { useEffect, useState } from "react"
import { parse } from "date-fns"

import { Panel, PanelHeader, PanelTitle } from "@/components/layout/panel"
import { Gitmap } from "@/components/ui/gitmap"
import { GitmapScroller } from "@/components/ui/gitmap-scroller"
import {
  contributionsUrl,
  isContributionsData,
  type ContributionsData,
} from "@/lib/github-contributions"

const CELL_SIZE = 14
const CELL_GAP = 3
/**
 * 7 rows of cells (no trailing gap) plus the month label strip. Matches the
 * rendered chart exactly so swapping the placeholder for real data does not
 * shift the rest of the page.
 */
const CHART_HEIGHT = 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP + 18

const COLORS = {
  empty: "var(--gitmap-empty)",
  level1: "var(--gitmap-level-1)",
  level2: "var(--gitmap-level-2)",
  level3: "var(--gitmap-level-3)",
  level4: "var(--gitmap-level-4)",
}

/** Parsed in local time, matching how Gitmap parses each day's key. */
const day = (date: string) => parse(date, "yyyy-MM-dd", new Date())

export function ContributionsPanel({
  initialData,
}: {
  initialData: ContributionsData | null
}) {
  const [data, setData] = useState(initialData)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (data) return

    // The server could not reach the API (its IP is rate-limited). The
    // visitor's own connection almost always can, and the API sends
    // `access-control-allow-origin: *`, so retry from the browser.
    const controller = new AbortController()

    fetch(contributionsUrl(), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json: unknown) => {
        if (!isContributionsData(json)) throw new Error("unexpected payload")
        setData(json)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error("[contributions] browser fetch failed:", error)
        setFailed(true)
      })

    return () => controller.abort()
  }, [data])

  const days = data?.contributions ?? []

  return (
    <Panel>
      <PanelHeader className="flex items-baseline justify-between gap-4">
        <PanelTitle>Contributions</PanelTitle>
        {/* Always rendered so the header keeps its height before data arrives. */}
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {data
            ? `${data.total.lastYear.toLocaleString("en-US")} in the last year`
            : " "}
        </span>
      </PanelHeader>

      <div className="p-4">
        {data && days.length > 0 ? (
          <GitmapScroller data-gitmap-theme="mono" className="overflow-x-auto">
            <Gitmap
              contributions={days}
              // Derived from the payload rather than `new Date()` so the server
              // and client agree on the range and hydration stays stable.
              from={day(days[0].date)}
              to={day(days[days.length - 1].date)}
              colors={COLORS}
              showCounts
              cellSize={CELL_SIZE}
              cellGap={CELL_GAP}
            />
          </GitmapScroller>
        ) : failed ? (
          <p className="text-base text-muted-foreground">
            GitHub activity is unavailable right now.
          </p>
        ) : (
          <div
            aria-hidden
            className="animate-pulse rounded-sm bg-muted"
            style={{ height: CHART_HEIGHT }}
          />
        )}
      </div>
    </Panel>
  )
}
