import { LinkedInLogo } from "@/components/logos/linkedin-logo"
import { GitHubLogo } from "@/components/logos/github-logo"
import { XLogo } from "@/components/logos/x-logo"
import { InstagramLogo } from "@/components/logos/instagram-logo"

const links = [
  {
    name: "GitHub",
    url: "https://github.com/camilocbarrera",
    icon: GitHubLogo,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/cristiancamilocorrea/",
    icon: LinkedInLogo,
  },
  {
    name: "X",
    url: "https://x.com/camilocbarrera",
    icon: XLogo,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/cristiancorrea.xyz/",
    icon: InstagramLogo,
  },
]

export function SocialLinks() {
  return (
    <div className="flex gap-3 md:gap-4">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label={link.name}
          >
            <Icon className="w-4 h-4" />
            <span className="sr-only">{link.name}</span>
          </a>
        )
      })}
    </div>
  )
}
