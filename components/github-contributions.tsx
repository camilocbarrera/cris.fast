import { addDays } from "date-fns"

import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/components/layout/panel"
import { Gitmap, type ContributionDay } from "@/components/ui/gitmap"
import { GitmapScroller } from "@/components/ui/gitmap-scroller"

const API_BASE = "https://github-contributions-api.jogruber.de/v4"
const USERNAME = "camilocbarrera"

type ApiResponse = {
  total: { lastYear: number }
  contributions: ContributionDay[]
}

async function getContributions(): Promise<ApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/${USERNAME}?y=last`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    if (!res.ok) return null
    return (await res.json()) as ApiResponse
  } catch {
    return null
  }
}

export async function GithubContributions() {
  const data = await getContributions()
  const today = new Date()

  return (
    <Panel>
      <PanelHeader className="flex items-baseline justify-between gap-4">
        <PanelTitle>Contributions</PanelTitle>
        {data ? (
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {data.total.lastYear.toLocaleString("en-US")} in the last year
          </span>
        ) : null}
      </PanelHeader>

      {data ? (
        <div className="p-4">
          <GitmapScroller
            data-gitmap-theme="mono"
            className="overflow-x-auto"
          >
            <Gitmap
              contributions={data.contributions}
              from={addDays(today, -365)}
              to={today}
              colors={{
                empty: "var(--gitmap-empty)",
                level1: "var(--gitmap-level-1)",
                level2: "var(--gitmap-level-2)",
                level3: "var(--gitmap-level-3)",
                level4: "var(--gitmap-level-4)",
              }}
              showCounts={true}
              cellSize={14}
              cellGap={3}
            />
          </GitmapScroller>
        </div>
      ) : (
        <div className="p-4">
          <p className="text-base text-muted-foreground">
            GitHub activity is unavailable right now.
          </p>
        </div>
      )}
    </Panel>
  )
}
