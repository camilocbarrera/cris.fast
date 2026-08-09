import type { ContributionDay } from "@/components/ui/gitmap"

const API_BASE = "https://github-contributions-api.jogruber.de/v4"
const USERNAME = "camilocbarrera"

export type ContributionsData = {
  total: { lastYear: number }
  contributions: ContributionDay[]
}

export function contributionsUrl(username = USERNAME): string {
  return `${API_BASE}/${username}?y=last`
}

export function isContributionsData(value: unknown): value is ContributionsData {
  if (typeof value !== "object" || value === null) return false
  const data = value as Partial<ContributionsData>
  return (
    typeof data.total?.lastYear === "number" &&
    Array.isArray(data.contributions) &&
    data.contributions.length > 0
  )
}

/**
 * Server-side fetch of the contribution calendar.
 *
 * The upstream is a free community API that rate-limits by IP, and Vercel's
 * shared egress addresses are heavily used by other sites hitting the same
 * endpoint — so this can fail in production while working everywhere else.
 * Failures are logged (never swallowed) and the panel falls back to fetching
 * from the visitor's own browser instead.
 */
export async function fetchContributions(): Promise<ContributionsData | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(contributionsUrl(), {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

      const json: unknown = await res.json()
      if (!isContributionsData(json)) throw new Error("unexpected payload shape")

      return json
    } catch (error) {
      console.error(
        `[contributions] server fetch attempt ${attempt}/2 failed:`,
        error instanceof Error ? error.message : error,
      )
    }
  }

  return null
}
