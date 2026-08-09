import type { ContributionsData } from "@/lib/github-contributions"
import { bold, dim, padEnd, visibleLength } from "./ansi"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const LABEL_WIDTH = 4
const WEEKDAYS = 7

export type HeatmapTheme = "light" | "dark"

/**
 * Five-step mono ramp per theme, mirroring the GUI's `--gitmap-*` scale:
 * dark mode brightens as activity rises, light mode darkens.
 *
 * These are xterm-256 *grayscale* indices (232–255), not 24-bit colors. The
 * WASM core quantizes truecolor onto the 6×6×6 cube, where near-neutral RGB
 * lands on tinted entries — warm grays came out olive and pink. The grayscale
 * band is exact, so the ramp stays monochrome in both themes.
 */
const RAMP: Record<HeatmapTheme, { bg: number; fg: number }[]> = {
  dark: [
    { bg: 234, fg: 241 },
    { bg: 239, fg: 253 },
    { bg: 244, fg: 232 },
    { bg: 250, fg: 232 },
    { bg: 255, fg: 232 },
  ],
  light: [
    { bg: 254, fg: 247 },
    { bg: 250, fg: 235 },
    { bg: 245, fg: 232 },
    { bg: 238, fg: 255 },
    { bg: 232, fg: 255 },
  ],
}

type Cell = { level: number; count: number; date: string } | null

/** Parsed as UTC so weekdays never shift with the viewer's timezone. */
const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay()
const monthOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCMonth()

function tile(level: number, text: string, theme: HeatmapTheme): string {
  const { bg, fg } = RAMP[theme][Math.max(0, Math.min(4, level))]
  return `\x1b[48;5;${bg}m\x1b[38;5;${fg}m${text}\x1b[0m`
}

/**
 * Zero days stay blank so the numbers read like the GUI's sparse grid.
 * Counts are centred, with any odd column falling on the right — that trailing
 * space doubles as the separator between neighbouring tiles, so even two
 * adjacent three-digit days stay legible.
 */
function cellText(count: number, cellWidth: number, showCounts: boolean): string {
  if (!showCounts || cellWidth < 2) return " ".repeat(cellWidth)
  if (count === 0) return " ".repeat(cellWidth)

  const digits = String(count)
  const text = digits.length > cellWidth ? "9".repeat(cellWidth) : digits
  const room = cellWidth - text.length
  const left = Math.floor(room / 2)
  return " ".repeat(left) + text + " ".repeat(room - left)
}

/**
 * A year of contributions as a terminal heatmap: month ruler, Mon/Wed/Fri
 * labels, and shaded tiles carrying the day's count — the terminal reading of
 * the GUI panel. Always 9 lines tall; when the terminal is too narrow for the
 * whole year it drops cell width first, then trims to the most recent weeks.
 */
export function renderHeatmap(
  data: ContributionsData,
  width: number,
  theme: HeatmapTheme = "dark",
  { fullYear = false }: { fullYear?: boolean } = {},
): string[] {
  const days = data.contributions
  if (days.length === 0) return [dim("no contribution data")]

  // Pad the first column so every row lines up with its weekday.
  const cells: Cell[] = [
    ...Array.from({ length: weekdayOf(days[0].date) }, () => null),
    ...days.map((d) => ({
      level: Math.max(0, Math.min(4, d.level)),
      count: Math.max(0, d.count),
      date: d.date,
    })),
  ]

  const weeks: Cell[][] = []
  for (let i = 0; i < cells.length; i += WEEKDAYS) {
    const week = cells.slice(i, i + WEEKDAYS)
    while (week.length < WEEKDAYS) week.push(null)
    weeks.push(week)
  }

  const available = Math.max(WEEKDAYS, width - LABEL_WIDTH)

  // The daily counts are the point of this view, so keep cells wide enough to
  // hold them and trim to recent weeks instead — the same trade the GUI makes
  // by scrolling horizontally. `--year` flips it to a full-year glance.
  //
  // `stride` leaves an uncoloured column between weeks so neighbouring tiles
  // stay separate; without it two 3-digit days run together as one number.
  const MIN_WEEKS = 16
  // `--year` drops the numbers: at one or two columns per day there is no room
  // for them, and printing them anyway runs the whole grid into a wall of
  // digits. The shading alone carries it, exactly like the GUI at a glance.
  const showCounts = !fullYear
  const LAYOUTS = fullYear
    ? [
        { cell: 2, stride: 2 },
        { cell: 1, stride: 1 },
      ]
    : [
        { cell: 3, stride: 4 },
        { cell: 1, stride: 1 },
      ]

  // Full-year mode wants every week on screen; the counts view only needs
  // enough weeks to be worth reading.
  const target = fullYear ? weeks.length : Math.min(MIN_WEEKS, weeks.length)
  const layout =
    LAYOUTS.find(({ stride }) => Math.floor(available / stride) >= target) ??
    LAYOUTS[LAYOUTS.length - 1]

  const { cell: cellWidth, stride } = layout
  const maxWeeks = Math.max(1, Math.floor(available / stride))
  const trimmed = weeks.length > maxWeeks
  const shown = trimmed ? weeks.slice(weeks.length - maxWeeks) : weeks

  // Month ruler, positioned over the column where each month begins.
  const ruler = Array.from({ length: shown.length * stride }, () => " ")
  let previousMonth = -1
  let lastLabelAt = -4

  shown.forEach((week, i) => {
    const day = week.find((cell): cell is NonNullable<Cell> => Boolean(cell))
    if (!day) return

    const month = monthOf(day.date)
    if (month === previousMonth) return
    previousMonth = month

    const name = MONTHS[month]
    const at = i * stride
    if (at - lastLabelAt < name.length + 1) return
    if (at + name.length > ruler.length) return

    for (let k = 0; k < name.length; k++) ruler[at + k] = name[k]
    lastLabelAt = at
  })

  const rows = [`${" ".repeat(LABEL_WIDTH)}${dim(ruler.join(""))}`]

  for (let d = 0; d < WEEKDAYS; d++) {
    const label = padEnd(dim(DAY_LABELS[d]), LABEL_WIDTH)
    const row = shown
      .map((week) => {
        const gap = " ".repeat(stride - cellWidth)
        const cell = week[d]
        return cell
          ? tile(cell.level, cellText(cell.count, cellWidth, showCounts), theme) + gap
          : " ".repeat(stride)
      })
      .join("")
      .trimEnd()
    rows.push(label + row)
  }

  // Panel-style header: title left, total right — the same pairing as the GUI.
  const title = bold("Contributions")
  const total = `${bold(data.total.lastYear.toLocaleString("en-US"))} ${dim("in the last year")}`
  const gridWidth = LABEL_WIDTH + shown.length * stride - (stride - cellWidth)
  const header =
    visibleLength(title) + visibleLength(total) + 2 <= gridWidth
      ? padEnd(title, gridWidth - visibleLength(total)) + total
      : `${title}  ${total}`

  return [
    header,
    "",
    ...rows,
    ...(trimmed
      ? [
          "",
          dim(
            fullYear
              ? `last ${shown.length} weeks — the terminal is too narrow for the full year`
              : `last ${shown.length} weeks · run ${bold("contributions --year")} for the whole year`,
          ),
        ]
      : []),
  ]
}
