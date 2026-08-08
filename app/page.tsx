import Image from "next/image"

import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/layout/panel"
import { Separator } from "@/components/layout/separator"
import { SocialLinks } from "@/components/social-links"
import { GithubContributions } from "@/components/github-contributions"

type Experience = {
  company: string
  role: string
  period: string
  summary: string
  url?: string
}

const experience: Experience[] = [
  {
    company: "Croma",
    role: "Founder",
    period: "Jun 2026 – Present",
    summary: "API for government data.",
    url: "https://usecroma.com",
  },
  {
    company: "Kebo",
    role: "Founder",
    period: "Aug 2024 – May 2026",
    summary:
      "Open-source AI financial agent for personal finance, used by 100k+ people in LATAM.",
    url: "https://kebo.app",
  },
  {
    company: "Nubank",
    role: "Data & Software Engineer",
    period: "2024 · 7 mos",
    summary:
      "Data for cashback on premium products at LATAM's largest digital bank.",
    url: "https://www.nu.com",
  },
  {
    company: "Platzi",
    role: "Data & Software Engineer",
    period: "May 2022 – Apr 2023",
    summary:
      "Worked on dbt project structure and CI/CD, helped migrate the warehouse from Redshift to BigQuery, and built an offline feature store.",
    url: "https://platzi.com",
  },
  {
    company: "Rappi",
    role: "Data & Software Engineer",
    period: "May 2020 – May 2022",
    summary:
      "Helped build the data foundation for Rappi Ads, including the keyword recommendation system and the insights behind churn and revenue decisions.",
    url: "https://rappi.com",
  },
  {
    company: "Azzorti",
    role: "Data & Analytics, SAP BI",
    period: "Oct 2018 – Jun 2020",
    summary:
      "SAP BW and HANA implementations, BusinessObjects reporting, and a PHP–R integration over SOAP.",
  },
  {
    company: "Taller de Carpintería",
    role: "Carpenter",
    period: "Jan 2010 – Dec 2018",
    summary:
      "Furniture and finishes at a local workshop in Bogotá. I started building things as a carpenter — same instinct, different material.",
  },
]

type Project = {
  name: string
  url: string
  host: string
  logo: string
  summary: string
}

const projects: Project[] = [
  {
    name: "The Hackathon Company",
    url: "https://www.hackathon.lat",
    host: "hackathon.lat",
    logo: "/logos/hackathon.lat.png",
    summary: "Build amazing hackathons with friends and great sponsors.",
  },
  {
    name: "Maca",
    url: "https://maca.sh",
    host: "maca.sh",
    logo: "/logos/maca.sh.png",
    summary: "Blazing-fast voice-to-text. 5× productivity.",
  },
  {
    name: "C3",
    url: "https://c3.crafter.run",
    host: "c3.crafter.run",
    logo: "/logos/c3.crafter.run.png",
    summary:
      "Open-source multi-model AI chat. GPT-4o, Claude, Gemini, DeepSeek, Grok.",
  },
  {
    name: "LaTeX0",
    url: "https://latex0.crafter.run",
    host: "latex0.crafter.run",
    logo: "/logos/latex0.crafter.run.png",
    summary: "AI-native LaTeX editor.",
  },
  {
    name: "SQL4All",
    url: "https://sql4all.org",
    host: "sql4all.org",
    logo: "/logos/sql4all.org.png",
    summary:
      "Free interactive SQL learning for Spanish speakers. PGlite in the browser.",
  },
  {
    name: "DAG Sketch",
    url: "https://dag.cris.fast",
    host: "dag.cris.fast",
    logo: "/logos/dag.cris.fast.png",
    summary: "Design and visualize Airflow DAGs from YAML.",
  },
]

type Award = {
  title: string
  issuer: string
  date: string
}

const awards: Award[] = [
  {
    title: "ElevenLabs Prize · Agents Hackathon Brazil",
    issuer: "i18n",
    date: "2026",
  },
  {
    title: "Online Winner · Platanus Hack '25",
    issuer: "Scrapi",
    date: "2025",
  },
  {
    title: "1st Place · Vercel AI Gateway Hackathon",
    issuer: "Chess Battle",
    date: "2025",
  },
  {
    title: "1st Place · Llama Impact Hackathon",
    issuer: "Meta",
    date: "Nov 2024",
  },
  {
    title: "1st Place · University Project Fair",
    issuer: "El Bosque University",
    date: "Apr 2024",
  },
  {
    title: "1st Place · Web3 Startup World Cup Hackathon",
    issuer: "Lumo & Pegasus Ventures",
    date: "Nov 2023",
  },
  {
    title: "1st Place · University Project Fair",
    issuer: "El Bosque University",
    date: "Nov 2023",
  },
  {
    title: "2nd Place · Best Entrepreneurship Project",
    issuer: "El Bosque University",
    date: "Nov 2023",
  },
  {
    title: "1st Place · AI Fest Hackathon",
    issuer: "Globant",
    date: "Jun 2023",
  },
  {
    title: "1st Place · CTF Cybersecurity Competition",
    issuer: "El Bosque University",
    date: "Jun 2023",
  },
]

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://cris.fast/#projects",
  name: "Selected Projects by Cristian Correa",
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.name,
      url: project.url,
      description: project.summary,
      creator: { "@id": "https://cris.fast/#person" },
    },
  })),
}

export default function Page() {
  return (
    <main className="max-w-screen overflow-x-clip px-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <div className="mx-auto flex min-h-dvh flex-col md:max-w-3xl">
        <section className="screen-line-top screen-line-bottom border-x border-line px-4 py-10 md:py-14">
          <h1 className="text-5xl italic text-balance md:text-7xl">
            Cristian Correa
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty md:text-xl">
            Software engineer and statistician with deep roots in big data
            engineering.
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
          <PanelContent className="space-y-3 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              I like building products, and I&apos;m comfortable working with
              large amounts of data for ML and AI. I love real-time products,
              and taking things from zero to one. Eight years in tech.
            </p>
          </PanelContent>
        </Panel>

        <Separator />

        <GithubContributions />

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Experience</PanelTitle>
          </PanelHeader>
          <div className="divide-y divide-line">
            {experience.map((job) => (
              <article key={job.company} className="space-y-1 px-4 py-3">
                <header className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-medium">
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-4 hover:underline"
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                    <span className="text-sm font-normal italic text-muted-foreground">
                      {" "}
                      · {job.role}
                    </span>
                  </h3>
                  <span className="shrink-0 text-xs italic text-muted-foreground">
                    {job.period}
                  </span>
                </header>
                <p className="text-base text-muted-foreground">{job.summary}</p>
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
              <article key={project.name} className="space-y-1 px-4 py-3">
                <header className="flex items-center justify-between gap-4">
                  <h3 className="flex items-center gap-2.5 text-lg font-medium">
                    <Image
                      src={project.logo}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0 rounded-[5px]"
                    />
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {project.name}
                    </a>
                  </h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {project.host}
                  </a>
                </header>
                <p className="text-base text-muted-foreground">
                  {project.summary}
                </p>
              </article>
            ))}
          </div>
        </Panel>

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Honors &amp; Awards</PanelTitle>
          </PanelHeader>
          <div className="divide-y divide-line">
            {awards.map((award) => (
              <div
                key={`${award.title}-${award.date}`}
                className="flex items-baseline justify-between gap-4 px-4 py-2"
              >
                <p className="text-base">
                  {award.title}
                  <span className="text-sm italic text-muted-foreground">
                    {" "}
                    · {award.issuer}
                  </span>
                </p>
                <span className="shrink-0 text-xs italic text-muted-foreground">
                  {award.date}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Separator />

        <Panel>
          <PanelHeader>
            <PanelTitle>Contact</PanelTitle>
          </PanelHeader>
          <PanelContent className="space-y-4">
            <dl className="grid grid-cols-[96px_1fr] gap-y-1 text-base">
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
