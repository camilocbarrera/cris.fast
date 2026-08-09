export type Experience = {
  company: string
  role: string
  period: string
  summary: string
  url?: string
}

export type Project = {
  name: string
  url: string
  host: string
  logo: string
  summary: string
}

export type Award = {
  title: string
  issuer: string
  date: string
}

export type Social = {
  name: string
  handle: string
  url: string
}

export const profile = {
  name: "Cristian Correa",
  handle: "cris",
  tagline:
    "Software engineer and statistician with deep roots in big data engineering.",
  location: "Bogotá, Colombia",
  email: "cristian.correa.cs@gmail.com",
  site: "cris.fast",
  bio: "I like building products, and I'm comfortable working with large amounts of data for ML and AI. I love real-time products, and taking things from zero to one. Eight years in tech.",
} as const

export const experience: Experience[] = [
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
    period: "2014 – 2018",
    summary:
      "Furniture and finishes at a local workshop in Bogotá. I started building things as a carpenter — same instinct, different material.",
  },
]

export const projects: Project[] = [
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

export const awards: Award[] = [
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

export const socials: Social[] = [
  {
    name: "GitHub",
    handle: "@camilocbarrera",
    url: "https://github.com/camilocbarrera",
  },
  {
    name: "LinkedIn",
    handle: "in/cristiancamilocorrea",
    url: "https://www.linkedin.com/in/cristiancamilocorrea/",
  },
  { name: "X", handle: "@camilocbarrera", url: "https://x.com/camilocbarrera" },
  {
    name: "Instagram",
    handle: "@cristiancorrea.xyz",
    url: "https://www.instagram.com/cristiancorrea.xyz/",
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["TypeScript", "Python", "SQL", "R", "Go"],
  },
  {
    group: "Data",
    items: ["dbt", "BigQuery", "Snowflake", "Redshift", "Airflow", "Spark"],
  },
  {
    group: "AI / ML",
    items: [
      "LLMs",
      "Agents",
      "RAG",
      "Vercel AI SDK",
      "Feature stores",
      "Realtime inference",
    ],
  },
  {
    group: "Product",
    items: ["Next.js", "React", "Expo", "Postgres", "Supabase", "Vercel"],
  },
]
