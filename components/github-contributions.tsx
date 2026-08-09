import { ContributionsPanel } from "@/components/contributions-panel"
import { fetchContributions } from "@/lib/github-contributions"

export async function GithubContributions() {
  // Renders server-side when the API is reachable; otherwise the panel
  // re-fetches from the visitor's browser.
  const data = await fetchContributions()

  return <ContributionsPanel initialData={data} />
}
