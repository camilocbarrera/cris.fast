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
import { awards, experience, projects } from "@/lib/profile"

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
