const ESC = "\x1b["

/** Matches SGR sequences so we can measure/wrap on visible characters only. */
const SGR = /\x1b\[[0-9;]*m/g

const wrap = (open: string, value: string) => `${ESC}${open}${value}${ESC}0m`

export const bold = (s: string) => wrap("1m", s)
export const dim = (s: string) => wrap("2m", s)
export const italic = (s: string) => wrap("3m", s)
export const underline = (s: string) => wrap("4m", s)

export const red = (s: string) => wrap("31m", s)
export const green = (s: string) => wrap("32m", s)
export const yellow = (s: string) => wrap("33m", s)
export const blue = (s: string) => wrap("34m", s)
export const magenta = (s: string) => wrap("35m", s)
export const cyan = (s: string) => wrap("36m", s)
export const white = (s: string) => wrap("37m", s)
export const gray = (s: string) => wrap("90m", s)

export const brightCyan = (s: string) => wrap("96m", s)
export const brightYellow = (s: string) => wrap("93m", s)
export const brightWhite = (s: string) => wrap("97m", s)

export const CLEAR_SCREEN = `${ESC}2J${ESC}3J${ESC}H`
export const CLEAR_LINE = `${ESC}2K`
export const ERASE_TO_END = `${ESC}K`
export const HIDE_CURSOR = `${ESC}?25l`
export const SHOW_CURSOR = `${ESC}?25h`
export const right = (n: number) => (n > 0 ? `${ESC}${n}C` : "")

export function stripAnsi(s: string): string {
  return s.replace(SGR, "")
}

export function visibleLength(s: string): number {
  return stripAnsi(s).length
}

/** Pad to `width` visible columns, ignoring escape sequences. */
export function padEnd(s: string, width: number): string {
  const pad = width - visibleLength(s)
  return pad > 0 ? s + " ".repeat(pad) : s
}

/**
 * Word-wrap a string to `width` visible columns, keeping SGR sequences intact.
 * Continuation rows are prefixed with `indent` spaces.
 */
export function wrapAnsi(text: string, width: number, indent = 0): string[] {
  if (width <= 2) return text.split("\n")

  const out: string[] = []

  for (const rawLine of text.split("\n")) {
    if (visibleLength(rawLine) <= width) {
      out.push(rawLine)
      continue
    }

    // Continuation rows keep the source line's own indentation, so wrapped
    // two-column and bulleted output stays aligned under its first row.
    const lead = /^ */.exec(stripAnsi(rawLine))![0].length
    const hang = " ".repeat(Math.min(Math.max(indent, lead), Math.max(0, width - 8)))

    let line = " ".repeat(lead)
    let len = lead

    const flush = () => {
      out.push(line)
      line = hang
      len = hang.length
    }

    for (const word of rawLine.replace(/^ +/, "").split(/ +/)) {
      const wordLen = visibleLength(word)
      const empty = stripAnsi(line).trim() === ""
      const sep = empty ? 0 : 1

      if (len + sep + wordLen <= width) {
        line += (sep ? " " : "") + word
        len += sep + wordLen
        continue
      }

      if (!empty) flush()

      // A single word wider than the row: hard-break it across rows.
      let rest = word
      while (visibleLength(rest) > width - len) {
        const [head, tail] = splitAnsiAt(rest, width - len)
        line += head
        flush()
        rest = tail
      }

      line += rest
      len += visibleLength(rest)
    }

    if (stripAnsi(line).trim() !== "") out.push(line)
  }

  return out
}

/** Split at `n` visible characters, carrying escape sequences along. */
function splitAnsiAt(s: string, n: number): [string, string] {
  let visible = 0
  let i = 0

  while (i < s.length && visible < n) {
    if (s[i] === "\x1b") {
      const match = /^\x1b\[[0-9;]*m/.exec(s.slice(i))
      if (match) {
        i += match[0].length
        continue
      }
    }
    i++
    visible++
  }

  return [s.slice(0, i), s.slice(i)]
}
