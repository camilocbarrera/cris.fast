import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/layout/panel"
import { Separator } from "@/components/layout/separator"
import { SocialLinks } from "@/components/social-links"

type Experience = {
  company: string
  role: string
  period: string
  summary: string
}

const experience: Experience[] = [
  {
    company: "Independent Consultant",
    role: "AI, Data & Product",
    period: "Nov 2023 – Present",
    summary:
      "AI products and data platforms. Some clients: El Tiempo, Spectrum Reach.",
  },
  {
    company: "Nubank",
    role: "Data & Software Engineer",
    period: "2024 · 7 mos",
    summary:
      "Data for cashback on premium products at LATAM's largest digital bank.",
  },
  {
    company: "Platzi",
    role: "Data & Software Engineer",
    period: "May 2022 – Apr 2023",
    summary:
      "Led dbt project structure and CI/CD, migrated Redshift → BigQuery, built an offline feature store that cut training time in half.",
  },
  {
    company: "Rappi",
    role: "Data & Software Engineer (Partner)",
    period: "May 2020 – May 2022",
    summary:
      "Built the data foundation for Rappi Ads. Insights drove −50% churn and 6× revenue growth in 1.2 years.",
  },
  {
    company: "Azzorti",
    role: "Data & Analytics, SAP BI",
    period: "Oct 2018 – Jun 2020",
    summary:
      "SAP BW / HANA implementations, BusinessObjects reporting, and a PHP–R integration over SOAP.",
  },
]

type Project = {
  name: string
  url: string
  host: string
  summary: string
}

const projects: Project[] = [
  {
    name: "Kebo",
    url: "https://kebo.app",
    host: "kebo.app",
    summary:
      "Open-source AI agent for personal finance. 100k+ users in LATAM · 30k MAU.",
  },
  {
    name: "Maca",
    url: "https://maca.sh",
    host: "maca.sh",
    summary: "Blazing-fast voice-to-text. 5× productivity.",
  },
  {
    name: "C3",
    url: "https://c3.crafter.run",
    host: "c3.crafter.run",
    summary:
      "Open-source multi-model AI chat. GPT-4o, Claude, Gemini, DeepSeek, Grok.",
  },
  {
    name: "LaTeX0",
    url: "https://latex0.crafter.run",
    host: "latex0.crafter.run",
    summary: "AI-native LaTeX editor.",
  },
  {
    name: "SQL4All",
    url: "https://sql4all.org",
    host: "sql4all.org",
    summary:
      "Free interactive SQL learning for Spanish speakers. PGlite in the browser.",
  },
  {
    name: "DAG Sketch",
    url: "https://dag.cris.fast",
    host: "dag.cris.fast",
    summary: "Design and visualize Airflow DAGs from YAML.",
  },
]

export default function Page() {
  return (
    <main className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto flex min-h-dvh flex-col md:max-w-3xl">
        <section className="screen-line-top screen-line-bottom border-x border-line px-4 py-10 md:py-14">
          <h1 className="text-5xl italic text-balance md:text-7xl">
            Cristian Correa
          </h1>
          <p className="mt-4 text-base text-muted-foreground text-pretty md:text-lg">
            Data Engineer shipping production AI systems and data platforms.
          </p>
          <div className="mt-6">
            <SocialLinks />
          </div>
        </section>

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Overview</PanelTitle>
          </PanelHeader>
          <PanelContent className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Software Engineer and statistician. I build AI products and data
              platforms, with 8+ years across fintech, ed-tech, ad-tech, and
              journalism.
            </p>
            <p>
              Creator of Kebo, an open-source personal finance app with 100k+
              users in LATAM. The last two years I&apos;ve been shipping
              production AI/ML systems with LLMs, RAG, and agentic workflows.
            </p>
          </PanelContent>
        </Panel>

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Experience</PanelTitle>
          </PanelHeader>
          <div className="divide-y divide-line">
            {experience.map((job) => (
              <article key={job.company} className="space-y-1 px-4 py-4">
                <header className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-medium">{job.company}</h3>
                  <span className="shrink-0 text-xs italic text-muted-foreground">
                    {job.period}
                  </span>
                </header>
                <p className="text-sm italic text-muted-foreground">
                  {job.role}
                </p>
                <p className="text-sm text-muted-foreground">{job.summary}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Selected Projects</PanelTitle>
          </PanelHeader>
          <div className="divide-y divide-line">
            {projects.map((project) => (
              <article key={project.name} className="space-y-1 px-4 py-4">
                <header className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-medium">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {project.name}
                    </a>
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {project.host}
                  </span>
                </header>
                <p className="text-sm text-muted-foreground">
                  {project.summary}
                </p>
              </article>
            ))}
          </div>
        </Panel>

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Contact</PanelTitle>
          </PanelHeader>
          <PanelContent className="space-y-4">
            <dl className="grid grid-cols-[88px_1fr] gap-y-1 text-sm">
              <dt className="italic text-muted-foreground">Location</dt>
              <dd>Bogotá, Colombia</dd>
              <dt className="italic text-muted-foreground">Email</dt>
              <dd>
                <a
                  href="mailto:cristian.correa.cs@gmail.com"
                  className="underline-offset-4 hover:underline"
                >
                  cristian.correa.cs@gmail.com
                </a>
              </dd>
            </dl>
            <div className="pt-2">
              <SocialLinks />
            </div>
          </PanelContent>
        </Panel>

        <Separator />

        <div className="screen-line-bottom relative flex-1 border-x border-line">
          <span
            aria-hidden
            className="absolute -bottom-[4.5px] -left-[4.5px] z-20 block size-2 border border-line bg-background"
          />
          <span
            aria-hidden
            className="absolute -bottom-[4.5px] -right-[4.5px] z-20 block size-2 border border-line bg-background"
          />
        </div>
      </div>
    </main>
  )
}
