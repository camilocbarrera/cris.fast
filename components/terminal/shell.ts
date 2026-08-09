import {
  CLEAR_SCREEN,
  ERASE_TO_END,
  bold,
  brightCyan,
  brightWhite,
  cyan,
  dim,
  gray,
  green,
  italic,
  magenta,
  padEnd,
  red,
  right,
  underline,
  visibleLength,
  wrapAnsi,
  yellow,
} from "./ansi"
import {
  awards,
  experience,
  profile,
  projects,
  skills,
  socials,
} from "@/lib/profile"

export type Theme = "light" | "dark"

export interface ShellHost {
  write(data: string): void
  cols(): number
  openUrl(url: string): void
  getTheme(): Theme
  setTheme(theme: Theme): void
  navigate(path: string): void
}

type Command = {
  name: string
  aliases?: string[]
  usage?: string
  summary: string
  hidden?: boolean
  run(args: string[], shell: Shell): string[]
}

const FILES = [
  "about.txt",
  "experience.txt",
  "projects.txt",
  "awards.txt",
  "skills.txt",
  "contact.txt",
  "social.txt",
  ".secret",
]

const BANNER_WIDE = [
  " ██████╗██████╗ ██╗███████╗   ███████╗ █████╗ ███████╗████████╗",
  "██╔════╝██╔══██╗██║██╔════╝   ██╔════╝██╔══██╗██╔════╝╚══██╔══╝",
  "██║     ██████╔╝██║███████╗   █████╗  ███████║███████╗   ██║   ",
  "██║     ██╔══██╗██║╚════██║   ██╔══╝  ██╔══██║╚════██║   ██║   ",
  "╚██████╗██║  ██║██║███████║██╗██║     ██║  ██║███████║   ██║   ",
  " ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝   ",
]

const BANNER_NARROW = [
  "┌───────────────────────────┐",
  "│  c r i s . f a s t        │",
  "└───────────────────────────┘",
]

const LOGO = [
  "     ▄▄▄▄▄▄▄     ",
  "   ▄█████████▄   ",
  "  ███▀     ▀███  ",
  " ███   ▄▄▄   ███ ",
  " ███  █████  ███ ",
  " ███   ▀▀▀   ███ ",
  "  ███▄     ▄███  ",
  "   ▀█████████▀   ",
  "     ▀▀▀▀▀▀▀     ",
]

export class Shell {
  private host: ShellHost
  private commands = new Map<string, Command>()
  private registry: Command[] = []

  private buffer = ""
  private cursor = 0
  private history: string[] = []
  private historyIndex = -1
  private draft = ""
  private lastChar = ""

  private booting = true
  private bootTimer: ReturnType<typeof setTimeout> | null = null
  private bootQueue: string[] = []
  private disposed = false

  constructor(host: ShellHost) {
    this.host = host
    for (const command of this.buildCommands()) {
      this.registry.push(command)
      this.commands.set(command.name, command)
      for (const alias of command.aliases ?? []) this.commands.set(alias, command)
    }
  }

  // ---------------------------------------------------------------- lifecycle

  /** Play the boot sequence, then hand control to the prompt. */
  start() {
    const lines = this.bootLines()
    let i = 0

    const step = () => {
      if (this.disposed) return
      if (i >= lines.length) {
        this.finishBoot()
        return
      }
      this.println(lines[i])
      i++
      this.bootTimer = setTimeout(step, i < 3 ? 90 : 45)
    }

    step()
  }

  dispose() {
    this.disposed = true
    if (this.bootTimer) clearTimeout(this.bootTimer)
  }

  private finishBoot(remaining: string[] = []) {
    if (this.bootTimer) clearTimeout(this.bootTimer)
    this.bootTimer = null
    for (const line of remaining) this.println(line)
    this.booting = false
    this.println("")
    this.renderPrompt()

    const queued = this.bootQueue.join("")
    this.bootQueue = []
    if (queued) this.input(queued)
  }

  private skipBoot() {
    if (!this.booting) return
    // Flush the rest of the banner instantly rather than dropping it.
    const lines = this.bootLines()
    this.host.write(CLEAR_SCREEN)
    for (const line of lines) this.println(line)
    this.finishBoot()
  }

  // -------------------------------------------------------------------- input

  input(data: string) {
    if (this.disposed) return

    if (this.booting) {
      // Any keypress skips the animation; real characters are replayed after.
      if (/[^\r\n\t\x1b]/.test(data)) this.bootQueue.push(data)
      this.skipBoot()
      return
    }

    let i = 0
    while (i < data.length) {
      const ch = data[i]

      if (ch === "\x1b") {
        const rest = data.slice(i)
        const seq = /^\x1b\[[0-9;]*[~A-Za-z]/.exec(rest)
        if (seq) {
          this.handleEscape(seq[0])
          i += seq[0].length
          continue
        }
        i++ // bare ESC
        continue
      }

      this.handleChar(ch)
      this.lastChar = ch
      i++
    }
  }

  private handleEscape(seq: string) {
    switch (seq) {
      case "\x1b[A":
      case "\x1bOA":
        this.recallHistory(-1)
        break
      case "\x1b[B":
      case "\x1bOB":
        this.recallHistory(1)
        break
      case "\x1b[C":
      case "\x1bOC":
        this.moveCursor(1)
        break
      case "\x1b[D":
      case "\x1bOD":
        this.moveCursor(-1)
        break
      case "\x1b[H":
      case "\x1bOH":
        this.setCursor(0)
        break
      case "\x1b[F":
      case "\x1bOF":
        this.setCursor(this.buffer.length)
        break
      case "\x1b[3~":
        if (this.cursor < this.buffer.length) {
          this.buffer =
            this.buffer.slice(0, this.cursor) + this.buffer.slice(this.cursor + 1)
          this.renderLine()
        }
        break
      // Bracketed paste markers — the payload arrives as plain text between them.
      case "\x1b[200~":
      case "\x1b[201~":
        break
      default:
        break
    }
  }

  private handleChar(ch: string) {
    switch (ch) {
      case "\r":
        this.submit()
        return
      case "\n":
        if (this.lastChar !== "\r") this.submit()
        return
      case "\x7f": // backspace
      case "\b":
        if (this.cursor > 0) {
          this.buffer =
            this.buffer.slice(0, this.cursor - 1) + this.buffer.slice(this.cursor)
          this.cursor--
          this.renderLine()
        }
        return
      case "\t":
        this.complete()
        return
      case "\x03": // ctrl-c
        this.host.write(gray("^C") + "\r\n")
        this.resetLine()
        this.renderPrompt()
        return
      case "\x04": // ctrl-d
        if (this.buffer.length === 0) {
          this.println("")
          this.printLines(this.runCommand("exit", []))
          this.println("")
          this.renderPrompt()
        }
        return
      case "\x0c": // ctrl-l
        this.host.write(CLEAR_SCREEN)
        this.renderPrompt()
        return
      case "\x01": // ctrl-a
        this.setCursor(0)
        return
      case "\x05": // ctrl-e
        this.setCursor(this.buffer.length)
        return
      case "\x0b": // ctrl-k
        this.buffer = this.buffer.slice(0, this.cursor)
        this.renderLine()
        return
      case "\x15": // ctrl-u
        this.buffer = this.buffer.slice(this.cursor)
        this.cursor = 0
        this.renderLine()
        return
      case "\x17": { // ctrl-w
        const head = this.buffer.slice(0, this.cursor).replace(/\s*\S+\s*$/, "")
        this.cursor = head.length
        this.buffer = head + this.buffer.slice(this.cursor)
        this.renderLine()
        return
      }
      default:
        if (ch < " ") return // ignore remaining control bytes
        this.buffer =
          this.buffer.slice(0, this.cursor) + ch + this.buffer.slice(this.cursor)
        this.cursor++
        this.renderLine()
    }
  }

  // ------------------------------------------------------------ line renderer

  /**
   * The input stays on a single row and scrolls horizontally when it outgrows
   * the terminal — that keeps cursor math exact regardless of wrap behaviour.
   */
  private renderLine() {
    const prompt = this.promptText()
    const promptLen = visibleLength(prompt)
    const width = Math.max(8, this.host.cols() - promptLen - 1)

    let offset = 0
    if (this.buffer.length > width) {
      if (this.cursor > width) offset = this.cursor - width
      const maxOffset = Math.max(0, this.buffer.length - width)
      offset = Math.min(offset, maxOffset)
    }

    const visible = this.buffer.slice(offset, offset + width)
    this.host.write("\r" + ERASE_TO_END + prompt + visible)
    this.host.write("\r" + right(promptLen + (this.cursor - offset)))
  }

  private renderPrompt() {
    this.buffer = ""
    this.cursor = 0
    this.renderLine()
  }

  private resetLine() {
    this.buffer = ""
    this.cursor = 0
    this.historyIndex = -1
    this.draft = ""
  }

  private promptText(): string {
    return `${cyan("~")}${gray("$")} `
  }

  private moveCursor(delta: number) {
    this.setCursor(this.cursor + delta)
  }

  private setCursor(next: number) {
    const clamped = Math.max(0, Math.min(this.buffer.length, next))
    if (clamped === this.cursor) return
    this.cursor = clamped
    this.renderLine()
  }

  // ---------------------------------------------------------------- execution

  private submit() {
    const line = this.buffer
    this.host.write("\r\n")
    this.resetLine()

    const trimmed = line.trim()
    if (trimmed) {
      if (this.history[this.history.length - 1] !== trimmed) {
        this.history.push(trimmed)
      }
      const [name, ...args] = tokenize(trimmed)
      const output = this.runCommand(name, args)
      if (output.length) {
        this.println("")
        this.printLines(output)
      }
      this.println("")
    }

    this.renderPrompt()
  }

  private runCommand(name: string, args: string[]): string[] {
    if (name === "clear" || name === "cls") {
      this.host.write(CLEAR_SCREEN)
      return []
    }

    const command = this.commands.get(name.toLowerCase())
    if (!command) {
      const hint = this.closestCommand(name)
      return [
        `${yellow("command not found:")} ${name}`,
        hint
          ? dim(`did you mean ${bold(hint)}? · type ${bold("help")} for the list`)
          : dim(`type ${bold("help")} to see everything available`),
      ]
    }

    return command.run(args, this)
  }

  private closestCommand(input: string): string | null {
    const target = input.toLowerCase()
    let best: string | null = null
    let bestScore = Infinity

    for (const command of this.registry) {
      if (command.hidden) continue
      const score = distance(target, command.name)
      if (score < bestScore) {
        bestScore = score
        best = command.name
      }
    }

    return bestScore <= 2 ? best : null
  }

  // --------------------------------------------------------------- completion

  private complete() {
    const tokens = this.buffer.slice(0, this.cursor).split(/\s+/)
    const isFirst = tokens.length <= 1
    const partial = tokens[tokens.length - 1] ?? ""

    const pool = isFirst
      ? this.registry.filter((c) => !c.hidden).map((c) => c.name)
      : this.argumentsFor(tokens[0])

    const matches = pool.filter((item) => item.startsWith(partial))
    if (matches.length === 0) return

    if (matches.length === 1) {
      const completion = matches[0].slice(partial.length) + " "
      this.buffer =
        this.buffer.slice(0, this.cursor) +
        completion +
        this.buffer.slice(this.cursor)
      this.cursor += completion.length
      this.renderLine()
      return
    }

    const shared = commonPrefix(matches)
    if (shared.length > partial.length) {
      const completion = shared.slice(partial.length)
      this.buffer =
        this.buffer.slice(0, this.cursor) +
        completion +
        this.buffer.slice(this.cursor)
      this.cursor += completion.length
    }

    this.host.write("\r\n")
    this.printLines([matches.map((m) => cyan(m)).join("  ")])
    this.renderLine()
  }

  private argumentsFor(command: string): string[] {
    switch (command) {
      case "cat":
      case "less":
      case "head":
        return FILES
      case "open":
      case "go":
        return [
          ...projects.map((p) => slug(p.name)),
          ...socials.map((s) => s.name.toLowerCase()),
          "email",
          "site",
        ]
      case "theme":
        return ["dark", "light", "toggle"]
      case "help":
        return this.registry.filter((c) => !c.hidden).map((c) => c.name)
      default:
        return []
    }
  }

  private recallHistory(direction: -1 | 1) {
    if (this.history.length === 0) return

    if (this.historyIndex === -1) {
      if (direction === 1) return
      this.draft = this.buffer
      this.historyIndex = this.history.length - 1
    } else {
      const next = this.historyIndex + direction
      if (next >= this.history.length) {
        this.historyIndex = -1
        this.buffer = this.draft
        this.cursor = this.buffer.length
        this.renderLine()
        return
      }
      this.historyIndex = Math.max(0, next)
    }

    this.buffer = this.history[this.historyIndex]
    this.cursor = this.buffer.length
    this.renderLine()
  }

  // ------------------------------------------------------------------- output

  private contentWidth(): number {
    return Math.max(24, this.host.cols() - 1)
  }

  private println(line: string) {
    for (const row of wrapAnsi(line, this.contentWidth())) {
      this.host.write(row + "\r\n")
    }
  }

  private printLines(lines: string[]) {
    for (const line of lines) this.println(line)
  }

  private bootLines(): string[] {
    const wide = this.host.cols() >= 66
    const banner = (wide ? BANNER_WIDE : BANNER_NARROW).map((l) => cyan(l))

    return [
      "",
      ...banner,
      "",
      `${bold(profile.name)} ${dim("·")} ${italic(profile.tagline)}`,
      dim(`${profile.location} · booted in ${(Math.random() * 40 + 8).toFixed(0)}ms`),
      "",
      `${dim("type")} ${bold(brightCyan("help"))} ${dim("to list commands,")} ${bold(brightCyan("about"))} ${dim("to start, or")} ${bold(brightCyan("gui"))} ${dim("for the normal site.")}`,
    ]
  }

  // ----------------------------------------------------------------- commands

  private buildCommands(): Command[] {
    const twoColumn = (rows: [string, string][], gap = 2): string[] => {
      const labelWidth = Math.max(...rows.map(([label]) => visibleLength(label)))
      const width = this.contentWidth()
      const valueColumn = 2 + labelWidth + gap
      const valueWidth = width - valueColumn

      // Longest unbreakable token — a URL or an email must never be split.
      const longestWord = Math.max(
        ...rows.flatMap(([, value]) =>
          value.split(/ +/).map((word) => visibleLength(word)),
        ),
      )

      // Below a usable value column, stack the value under its label instead.
      if (valueWidth < 16 || longestWord > valueWidth) {
        return rows.flatMap(([label, value]) => [
          `  ${label}`,
          ...wrapAnsi(value, width - 4).map((line) => `    ${line}`),
        ])
      }

      return rows.flatMap(([label, value]) =>
        wrapAnsi(value, valueWidth).map((line, i) =>
          i === 0
            ? `  ${padEnd(label, labelWidth + gap)}${line}`
            : `${" ".repeat(valueColumn)}${line}`,
        ),
      )
    }

    const heading = (text: string): string[] => [
      bold(brightWhite(text)),
      dim("─".repeat(Math.min(visibleLength(text) + 6, 40))),
    ]

    const aboutLines = (): string[] => [
      ...heading("about"),
      "",
      profile.bio,
      "",
      dim(`See ${bold("experience")}, ${bold("projects")} and ${bold("awards")} for details.`),
    ]

    const experienceLines = (): string[] => {
      const width = this.contentWidth()
      const out: string[] = [...heading("experience"), ""]

      for (const job of experience) {
        const title = `${bold(job.company)} ${dim(`· ${job.role}`)}`
        const period = dim(job.period)
        const inline =
          visibleLength(title) + visibleLength(period) + 3 <= width
            ? `${padEnd(title, width - visibleLength(period))}${period}`
            : null

        out.push(inline ?? title)
        if (!inline) out.push(`  ${period}`)
        out.push(...wrapAnsi(gray(job.summary), width - 2).map((l) => `  ${l}`))
        if (job.url) out.push(`  ${dim(underline(job.url))}`)
        out.push("")
      }

      out.pop()
      return out
    }

    const projectLines = (): string[] => {
      const width = this.contentWidth()
      const out: string[] = [...heading("projects"), ""]

      for (const project of projects) {
        const name = `${bold(magenta(project.name))}`
        const host = dim(project.host)
        const inline =
          visibleLength(name) + visibleLength(host) + 3 <= width
            ? `${padEnd(name, width - visibleLength(host))}${host}`
            : null

        out.push(inline ?? name)
        if (!inline) out.push(`  ${host}`)
        out.push(...wrapAnsi(gray(project.summary), width - 2).map((l) => `  ${l}`))
        out.push("")
      }

      out.pop()
      out.push("")
      out.push(dim(`run ${bold("open <name>")} to visit one — e.g. ${bold("open maca")}`))
      return out
    }

    const awardLines = (): string[] => {
      const width = this.contentWidth()
      const out: string[] = [...heading("honors & awards"), ""]

      for (const award of awards) {
        const left = `${yellow("★")} ${award.title} ${dim(`· ${award.issuer}`)}`
        const date = dim(award.date)
        const inline =
          visibleLength(left) + visibleLength(date) + 3 <= width
            ? `${padEnd(left, width - visibleLength(date))}${date}`
            : null
        out.push(inline ?? left)
        if (!inline) out.push(`    ${date}`)
      }

      return out
    }

    const skillLines = (): string[] => {
      const out: string[] = [...heading("skills"), ""]
      for (const { group, items } of skills) {
        out.push(bold(cyan(group)))
        out.push(...wrapAnsi(items.map((i) => gray(i)).join(dim(" · ")), this.contentWidth() - 2).map((l) => `  ${l}`))
        out.push("")
      }
      out.pop()
      return out
    }

    const contactLines = (): string[] => [
      ...heading("contact"),
      "",
      ...twoColumn([
        [dim("location"), profile.location],
        [dim("email"), underline(profile.email)],
        [dim("site"), underline(`https://${profile.site}`)],
      ]),
      "",
      dim(`run ${bold("open email")} to start a message.`),
    ]

    const socialLines = (): string[] => {
      // URLs only earn their place when they fit without being hard-broken.
      const roomy = this.contentWidth() >= 72
      return [
        ...heading("social"),
        "",
        ...twoColumn(
          socials.map((s) => [
            cyan(s.name),
            roomy ? `${s.handle}  ${dim(underline(s.url))}` : s.handle,
          ]),
        ),
        "",
        dim(`run ${bold("open github")} to follow a link.`),
      ]
    }

    return [
      {
        name: "help",
        aliases: ["?", "commands"],
        summary: "list every command",
        run: (args) => {
          if (args[0]) {
            const command = this.commands.get(args[0].toLowerCase())
            if (!command) return [`${yellow("no help for")} ${args[0]}`]
            return [
              bold(command.name),
              dim(command.usage ?? command.name),
              "",
              command.summary,
              ...(command.aliases?.length
                ? ["", dim(`aliases: ${command.aliases.join(", ")}`)]
                : []),
            ]
          }

          const visible = this.registry.filter((c) => !c.hidden)
          return [
            ...heading("commands"),
            "",
            ...twoColumn(
              visible.map((c) => [cyan(c.usage ?? c.name), gray(c.summary)]),
              3,
            ),
            "",
            dim(
              `${bold("tab")} completes · ${bold("↑ ↓")} history · ${bold("ctrl+l")} clear · ${bold("ctrl+c")} cancel`,
            ),
          ]
        },
      },
      {
        name: "about",
        aliases: ["bio", "info"],
        summary: "who I am",
        run: aboutLines,
      },
      {
        name: "whoami",
        summary: "print the current user",
        run: () => [
          `${green(profile.handle)}${dim(` (${profile.name})`)}`,
          "",
          ...wrapAnsi(gray(profile.tagline), this.contentWidth()),
        ],
      },
      {
        name: "experience",
        aliases: ["work", "career", "cv", "resume"],
        summary: "where I have worked",
        run: experienceLines,
      },
      {
        name: "projects",
        aliases: ["ls-projects", "portfolio"],
        summary: "things I have shipped",
        run: projectLines,
      },
      {
        name: "awards",
        aliases: ["honors", "wins"],
        summary: "hackathons and honors",
        run: awardLines,
      },
      {
        name: "skills",
        aliases: ["stack", "tech"],
        summary: "tools I reach for",
        run: skillLines,
      },
      {
        name: "contact",
        aliases: ["email"],
        summary: "how to reach me",
        run: contactLines,
      },
      {
        name: "social",
        aliases: ["links"],
        summary: "where to find me online",
        run: socialLines,
      },
      {
        name: "neofetch",
        aliases: ["fetch"],
        summary: "system information, the fun way",
        run: () => {
          const info: [string, string][] = [
            ["", bold(green(profile.site))],
            ["", dim("─".repeat(22))],
            [cyan("Name"), profile.name],
            [cyan("Role"), "Software Engineer · Statistician"],
            [cyan("Uptime"), "8 years in tech"],
            [cyan("Location"), profile.location],
            [cyan("Shell"), "wterm (zig → wasm)"],
            [cyan("Editor"), "Neovim · Cursor"],
            [cyan("Now"), experience[0].company + " · " + experience[0].role],
            [cyan("Awards"), `${awards.length} wins`],
            [cyan("Projects"), `${projects.length} shipped`],
            [cyan("Contact"), profile.email],
          ]

          const rows = info.map(([key, value]) =>
            key ? `${padEnd(key, 12)}${value}` : value,
          )

          // Side-by-side only when the terminal is wide enough for both panes.
          if (this.host.cols() < 62) return [...LOGO.map((l) => cyan(l)), "", ...rows]

          const height = Math.max(LOGO.length, rows.length)
          const out: string[] = []
          for (let i = 0; i < height; i++) {
            const art = cyan(LOGO[i] ?? " ".repeat(LOGO[0].length))
            out.push(`${padEnd(art, LOGO[0].length + 2)}${rows[i] ?? ""}`)
          }
          return out
        },
      },
      {
        name: "ls",
        aliases: ["dir"],
        usage: "ls [-a]",
        summary: "list the files in ~",
        run: (args) => {
          const all = args.includes("-a") || args.includes("-la")
          const files = FILES.filter((f) => all || !f.startsWith("."))
          const width = Math.max(...files.map((f) => f.length)) + 3
          const perRow = Math.max(1, Math.floor(this.contentWidth() / width))
          const out: string[] = []

          for (let i = 0; i < files.length; i += perRow) {
            out.push(
              files
                .slice(i, i + perRow)
                .map((f) => padEnd(f.startsWith(".") ? dim(f) : cyan(f), width))
                .join("")
                .trimEnd(),
            )
          }

          out.push("", dim(`read one with ${bold("cat about.txt")}`))
          return out
        },
      },
      {
        name: "cat",
        aliases: ["less", "head"],
        usage: "cat <file>",
        summary: "read a file",
        run: (args) => {
          const file = args[0]
          if (!file) {
            return [`${dim("usage: cat <file> — run")} ${bold("ls")} ${dim("first")}`]
          }

          switch (file.replace(/^\.\//, "")) {
            case "about.txt":
              return aboutLines()
            case "experience.txt":
              return experienceLines()
            case "projects.txt":
              return projectLines()
            case "awards.txt":
              return awardLines()
            case "skills.txt":
              return skillLines()
            case "contact.txt":
              return contactLines()
            case "social.txt":
              return socialLines()
            case ".secret":
              return [
                magenta("You found it."),
                "",
                ...wrapAnsi(
                  gray(
                    "Before software I spent eight years as a carpenter in Bogotá, building furniture with my hands. Same instinct, different material.",
                  ),
                  this.contentWidth(),
                ),
                "",
                dim("run `experience` and scroll to the bottom."),
              ]
            default:
              return [`${yellow("cat:")} ${file}: No such file or directory`]
          }
        },
      },
      {
        name: "open",
        aliases: ["go", "visit"],
        usage: "open <target>",
        summary: "open a project or profile",
        run: (args) => {
          const target = args.join(" ").toLowerCase().trim()
          if (!target) {
            return [
              dim("usage: open <target>"),
              "",
              dim("targets: ") +
                this.argumentsFor("open").map((t) => cyan(t)).join(dim(", ")),
            ]
          }

          if (target === "email" || target === "mail") {
            this.host.openUrl(`mailto:${profile.email}`)
            return [`${green("→")} opening mail to ${underline(profile.email)}`]
          }

          if (target === "site" || target === "home") {
            this.host.navigate("/")
            return [`${green("→")} opening ${underline(profile.site)}`]
          }

          const project = projects.find(
            (p) => slug(p.name) === target || p.host === target,
          )
          if (project) {
            this.host.openUrl(project.url)
            return [`${green("→")} opening ${bold(project.name)} ${dim(project.url)}`]
          }

          const social = socials.find((s) => s.name.toLowerCase() === target)
          if (social) {
            this.host.openUrl(social.url)
            return [`${green("→")} opening ${bold(social.name)} ${dim(social.url)}`]
          }

          const job = experience.find(
            (e) => e.company.toLowerCase() === target && e.url,
          )
          if (job?.url) {
            this.host.openUrl(job.url)
            return [`${green("→")} opening ${bold(job.company)} ${dim(job.url)}`]
          }

          return [
            `${yellow("open:")} no target named ${bold(target)}`,
            dim("run `open` with no argument to see the list"),
          ]
        },
      },
      {
        name: "theme",
        usage: "theme [dark|light]",
        summary: "switch the color scheme",
        run: (args) => {
          const requested = args[0]?.toLowerCase()
          const current = this.host.getTheme()

          if (!requested || requested === "toggle") {
            const next = current === "dark" ? "light" : "dark"
            this.host.setTheme(next)
            return [`${green("✓")} theme set to ${bold(next)}`]
          }

          if (requested !== "dark" && requested !== "light") {
            return [`${yellow("theme:")} unknown theme ${bold(requested)} — try dark or light`]
          }

          this.host.setTheme(requested)
          return [`${green("✓")} theme set to ${bold(requested)}`]
        },
      },
      {
        name: "gui",
        aliases: ["web", "exit-terminal"],
        summary: "leave the terminal for the normal site",
        run: () => {
          setTimeout(() => this.host.navigate("/"), 450)
          return [dim("dropping back to the GUI…")]
        },
      },
      {
        name: "history",
        summary: "show past commands",
        run: () =>
          this.history.length
            ? this.history.map((cmd, i) => `${dim(padEnd(String(i + 1), 4))}${cmd}`)
            : [dim("no history yet")],
      },
      {
        name: "echo",
        usage: "echo <text>",
        summary: "print some text",
        run: (args) => [args.join(" ")],
      },
      {
        name: "date",
        summary: "print the current date",
        run: () => [new Date().toString()],
      },
      {
        name: "pwd",
        summary: "print the working directory",
        run: () => [`/home/${profile.handle}`],
      },
      {
        name: "uname",
        usage: "uname [-a]",
        summary: "print system information",
        run: () => [
          `cris.fast ${profile.site} 1.0.0 wterm/wasm (zig) x86_64 ${new Date().getFullYear()}`,
        ],
      },
      {
        name: "sudo",
        hidden: true,
        summary: "nice try",
        run: () => [
          `${red("sudo:")} ${profile.handle} is not in the sudoers file.`,
          dim("This incident has been reported."),
        ],
      },
      {
        name: "exit",
        aliases: ["quit", "logout"],
        summary: "end the session",
        run: () => [
          `${dim("There is no exit. There is only")} ${bold(brightCyan("gui"))}${dim(" — or close the tab.")}`,
        ],
      },
      {
        name: "clear",
        aliases: ["cls"],
        summary: "clear the screen",
        run: () => [],
      },
    ]
  }
}

// -------------------------------------------------------------------- helpers

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function tokenize(line: string): string[] {
  return line.trim().split(/\s+/)
}

function commonPrefix(items: string[]): string {
  if (items.length === 0) return ""
  let prefix = items[0]
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1)
    if (!prefix) break
  }
  return prefix
}

/** Levenshtein distance, used for "did you mean" suggestions. */
function distance(a: string, b: string): number {
  const rows = a.length + 1
  const cols = b.length + 1
  let prev = Array.from({ length: cols }, (_, i) => i)

  for (let i = 1; i < rows; i++) {
    const curr = [i]
    for (let j = 1; j < cols; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    prev = curr
  }

  return prev[cols - 1]
}
