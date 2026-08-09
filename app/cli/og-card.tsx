import type { ReactNode } from "react"
import { ImageResponse } from "next/og"

import { profile } from "@/lib/profile"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_ALT = `${profile.name} — profile as a terminal`

/**
 * Hex mirrors of the site's oklch tokens and the `theme-cris` terminal palette.
 * Satori does not resolve oklch(), so the values are converted here; keep them
 * in sync with `app/globals.css` if the palette changes.
 */
const BG = "#0f0f12"
const FG = "#f2f2f2"
const MUTED = "#9797a0"
const LINE = "#26262a"
const GREEN = "#65c67d"
const CYAN = "#6eccd1"
const MAGENTA = "#d78adb"
const YELLOW = "#eec05b"

const MONO = "GeistMono"

/** Every glyph the card draws — Google Fonts subsets the file to just these. */
const GLYPHS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ~$_·—×.,:;'\"()[]<>/@!?+-#"

/**
 * Fetch a Google font as raw TTF for satori. Returns null when the network is
 * unavailable so a build never fails over a social image — the card then falls
 * back to satori's built-in proportional font.
 */
async function loadMono(text: string) {
  try {
    const query = `family=Geist+Mono:wght@400;500&text=${encodeURIComponent(text)}`
    const css = await fetch(`https://fonts.googleapis.com/css2?${query}`, {
      headers: {
        // Google serves woff2 to modern UAs; satori needs ttf/otf.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/533.4 (KHTML, like Gecko)",
      },
    }).then((res) => res.text())

    const url = /src: url\((https:\/\/[^)]+)\)/.exec(css)?.[1]
    if (!url) return null

    return await fetch(url).then((res) => res.arrayBuffer())
  } catch {
    return null
  }
}

type LineProps = {
  children: ReactNode
  color?: string
  size?: number
  top?: number
}

function Line({ children, color = FG, size = 30, top = 0 }: LineProps) {
  return (
    <div
      style={{
        display: "flex",
        color,
        fontSize: size,
        marginTop: top,
        lineHeight: 1.35,
      }}
    >
      {children}
    </div>
  )
}

function Prompt() {
  return (
    <>
      <span style={{ color: CYAN }}>~</span>
      <span style={{ color: MUTED }}>$</span>
      <span style={{ width: 14 }} />
    </>
  )
}

export async function renderTerminalOg() {
  const mono = await loadMono(GLYPHS)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          color: FG,
          fontFamily: mono ? MONO : "sans-serif",
          padding: 56,
          position: "relative",
        }}
      >
        {/* Hairline window frame, echoing the site's bordered panels. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            border: `1px solid ${LINE}`,
            position: "relative",
          }}
        >
          {/* Corner squares — the same motif the site uses on its panels. */}
          {[
            { top: -5, left: -5 },
            { top: -5, right: -5 },
            { bottom: -5, left: -5 },
            { bottom: -5, right: -5 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: 9,
                height: 9,
                background: BG,
                border: `1px solid ${LINE}`,
              }}
            />
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${LINE}`,
              padding: "18px 28px",
              fontSize: 22,
              color: MUTED,
            }}
          >
            <span style={{ display: "flex" }}>{profile.site} — terminal</span>
            <span style={{ display: "flex", color: MUTED }}>80×24</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "34px 40px",
              flex: 1,
            }}
          >
            <Line>
              <Prompt />
              <span>whoami</span>
            </Line>

            <Line color={FG} size={54} top={26}>
              <span style={{ color: GREEN }}>{profile.handle}</span>
              <span style={{ color: MUTED, marginLeft: 18 }}>
                ({profile.name})
              </span>
            </Line>

            <Line color={MUTED} size={27} top={18}>
              {profile.tagline}
            </Line>

            <Line color={MUTED} size={27} top={30}>
              <span style={{ color: MAGENTA }}>projects</span>
              <span style={{ margin: "0 12px" }}>·</span>
              <span style={{ color: CYAN }}>experience</span>
              <span style={{ margin: "0 12px" }}>·</span>
              <span style={{ color: YELLOW }}>awards</span>
              <span style={{ margin: "0 12px" }}>·</span>
              <span style={{ color: GREEN }}>neofetch</span>
            </Line>

            <div style={{ display: "flex", flex: 1 }} />

            <Line size={30}>
              <Prompt />
              {/* Drawn rather than typed — a block-cursor glyph is not a
                  reliable width across font subsets. */}
              <div style={{ width: 17, height: 34, background: FG }} />
            </Line>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: mono
        ? [{ name: MONO, data: mono, style: "normal", weight: 400 }]
        : undefined,
    },
  )
}
