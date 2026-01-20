"use client"

import { useState, useEffect } from "react"

interface ColorPalette {
  colorA: string
  colorB: string
  baseColor: string
  upColor: string
  downColor: string
  leftColor: string
  rightColor: string
  overlayOpacity: number
  starColors: string[]
  accentGlow: string
}

// Stellar color palette based on deep indigo cosmic theme (darker variant)
// Base colors: #7179C6 (accent), #212652, #2A2D4C, #11142C (darkest), #212654
const palettes: Record<string, ColorPalette> = {
  // 0-4am: Deep Space - The darkest void
  deepSpace: {
    colorA: "#08091A",      // Darkest void
    colorB: "#0E1125",      // Slightly lighter
    baseColor: "#0A0C1E",   // Deep base
    upColor: "#121630",     // Subtle glow above
    downColor: "#040510",   // Pure darkness
    leftColor: "#0B0E22",   // Edge dark
    rightColor: "#090C1C",  // Galaxy arm
    overlayOpacity: 0.08,
    starColors: [
      "90, 97, 158",        // #7179C6 dimmed
      "110, 120, 175",      // Muted blue
      "80, 88, 145",        // Deep blue
      "125, 130, 180",      // Soft periwinkle
      "70, 80, 135",        // Very deep
      "100, 110, 165",      // Mid blue
    ],
    accentGlow: "#4A5080",
  },

  // 4-5:30am: Blue Hour - Pre-dawn stillness
  blueHour: {
    colorA: "#0C0E28",      // Deep blue
    colorB: "#121535",      // Twilight blue
    baseColor: "#0E112A",   // Pre-dawn
    upColor: "#181C3C",     // Sky lightening
    downColor: "#060818",   // Ground dark
    leftColor: "#10132E",   // Eastern hint
    rightColor: "#0D1025",  // Western dark
    overlayOpacity: 0.07,
    starColors: [
      "95, 105, 160",       // Fading blue
      "110, 115, 170",      // Soft periwinkle
      "80, 92, 150",        // Cool blue
      "120, 125, 175",      // Pale blue
      "88, 96, 155",        // Mid tone
      "105, 112, 168",      // Light accent
    ],
    accentGlow: "#3E4578",
  },

  // 5:30-6:30am: Cosmic Dawn - First light
  dawn: {
    colorA: "#101430",      // Purple-blue
    colorB: "#181C3E",      // Twilight purple
    baseColor: "#121635",   // Pre-dawn violet
    upColor: "#1E2248",     // Rising glow
    downColor: "#08091A",   // Lingering night
    leftColor: "#151938",   // Blending horizon
    rightColor: "#111432",  // First light edge
    overlayOpacity: 0.06,
    starColors: [
      "105, 110, 165",      // Dawn blue
      "120, 125, 172",      // Lighter
      "92, 100, 155",       // Cool tone
      "128, 132, 180",      // Pale glow
      "112, 118, 168",      // Mid accent
      "100, 108, 160",      // Soft blue
    ],
    accentGlow: "#505890",
  },

  // 6:30-8am: Nebula Rise - Morning awakening
  sunrise: {
    colorA: "#14183A",      // Base navy
    colorB: "#1C2048",      // Lighter navy
    baseColor: "#181C40",   // Warm base
    upColor: "#242852",     // Rising light
    downColor: "#0C0E26",   // Shadow
    leftColor: "#1A1E44",   // Edge
    rightColor: "#161A3C",  // Rim
    overlayOpacity: 0.05,
    starColors: [
      "112, 120, 168",      // Soft blue
      "128, 135, 180",      // Brighter
      "105, 112, 160",      // Cool
      "135, 140, 188",      // Pale
      "120, 126, 174",      // Mid
      "115, 124, 172",      // Accent
    ],
    accentGlow: "#5860A0",
  },

  // 8-11am: Morning Light
  morning: {
    colorA: "#181C40",      // Cool navy
    colorB: "#222652",      // Brighter
    baseColor: "#1C2045",   // Clear
    upColor: "#282D58",     // Light
    downColor: "#101330",   // Shadow
    leftColor: "#1E2248",   // Cool side
    rightColor: "#20244C",  // Bright edge
    overlayOpacity: 0.04,
    starColors: [
      "120, 128, 176",      // Bright blue
      "135, 142, 188",      // Light
      "112, 120, 168",      // Mid
      "145, 150, 195",      // Pale
      "128, 135, 180",      // Cool
      "155, 165, 220",      // Soft
    ],
    accentGlow: "#8088D0",
  },

  // 11am-2pm: Stellar Noon - Peak brightness (still dark themed)
  midday: {
    colorA: "#1C1F3A",      // Base slate
    colorB: "#262A4C",      // Brighter slate
    baseColor: "#1E2240",   // Clear space
    upColor: "#2E3258",     // Zenith light
    downColor: "#121530",   // Grounded shadow
    leftColor: "#222648",   // Cool side
    rightColor: "#24284A",  // Bright edge
    overlayOpacity: 0.03,
    starColors: [
      "128, 136, 185",      // Bright
      "145, 152, 198",      // White-blue
      "120, 128, 176",      // Cool
      "152, 158, 202",      // Pale
      "138, 145, 192",      // Mid
      "132, 140, 188",      // Soft
    ],
    accentGlow: "#6870A8",
  },

  // 2-5pm: Afternoon Drift
  afternoon: {
    colorA: "#181C3C",      // Purple-blue
    colorB: "#242852",      // Drifting
    baseColor: "#1C2042",   // Core
    upColor: "#2A2E58",     // Glow
    downColor: "#10132E",   // Shadow
    leftColor: "#1E2248",   // Trail
    rightColor: "#22264C",  // Lead
    overlayOpacity: 0.04,
    starColors: [
      "118, 125, 172",      // Shift
      "132, 138, 185",      // Drift
      "108, 118, 165",      // Soft
      "140, 145, 192",      // Pale
      "125, 132, 178",      // Cool
      "120, 128, 175",      // Mid
    ],
    accentGlow: "#5A62A0",
  },

  // 5-6:30pm: Golden Hour (twilight tones)
  goldenHour: {
    colorA: "#161A3C",      // Deeper blue
    colorB: "#20244A",      // Twilight
    baseColor: "#1A1E42",   // Core
    upColor: "#282C55",     // Glow
    downColor: "#0E1128",   // Shadow
    leftColor: "#1C2045",   // Edge
    rightColor: "#1E2248",  // Rim
    overlayOpacity: 0.05,
    starColors: [
      "112, 120, 168",      // Golden-blue
      "128, 135, 180",      // Light
      "105, 112, 160",      // Deep
      "135, 140, 188",      // Pale
      "120, 126, 175",      // Mid
      "118, 125, 172",      // Soft
    ],
    accentGlow: "#525898",
  },

  // 6:30-8pm: Cosmic Sunset
  sunset: {
    colorA: "#14183A",      // Deep navy
    colorB: "#1C2045",      // Sunset navy
    baseColor: "#181C40",   // Core
    upColor: "#242850",     // Glow
    downColor: "#0C0E26",   // Night approaching
    leftColor: "#1A1E42",   // Fading
    rightColor: "#1C2048",  // Last light
    overlayOpacity: 0.06,
    starColors: [
      "105, 112, 165",      // Deeper
      "120, 126, 176",      // Soft
      "95, 105, 155",       // Cool
      "128, 132, 182",      // Pale
      "112, 118, 170",      // Mid
      "108, 116, 168",      // Accent
    ],
    accentGlow: "#484F88",
  },

  // 8-9:30pm: Twilight Nebula
  dusk: {
    colorA: "#101335",      // Deep purple
    colorB: "#181C40",      // Nebula
    baseColor: "#141738",   // Twilight core
    upColor: "#1E2248",     // Clouds
    downColor: "#080A1E",   // Deep void
    leftColor: "#151838",   // Purple edge
    rightColor: "#161A3C",  // Violet rim
    overlayOpacity: 0.07,
    starColors: [
      "96, 105, 158",       // Deep accent
      "112, 118, 172",      // Nebula
      "88, 96, 150",        // Violet
      "120, 126, 180",      // Light
      "105, 110, 165",      // Soft
      "100, 108, 160",      // Cool
    ],
    accentGlow: "#424882",
  },

  // 9:30-11pm: Midnight Galaxy
  evening: {
    colorA: "#0C0F28",      // Deep blue-black
    colorB: "#141735",      // Galaxy arm
    baseColor: "#10132E",   // Midnight void
    upColor: "#1A1D40",     // Star cloud glow
    downColor: "#060818",   // Absolute dark
    leftColor: "#121530",   // Galaxy edge
    rightColor: "#131632",  // Spiral arm
    overlayOpacity: 0.08,
    starColors: [
      "90, 97, 158",        // #7179C6 dimmed
      "105, 112, 168",      // Brighter
      "80, 88, 148",        // Cool
      "115, 122, 176",      // Pale
      "96, 102, 160",       // Mid
      "92, 100, 156",       // Deep
    ],
    accentGlow: "#3A4078",
  },
}

const timeSlots = [
  { hour: 0, palette: "deepSpace" },
  { hour: 4, palette: "blueHour" },
  { hour: 5.5, palette: "dawn" },
  { hour: 6.5, palette: "sunrise" },
  { hour: 8, palette: "morning" },
  { hour: 11, palette: "midday" },
  { hour: 14, palette: "afternoon" },
  { hour: 17, palette: "goldenHour" },
  { hour: 18.5, palette: "sunset" },
  { hour: 20, palette: "dusk" },
  { hour: 21.5, palette: "evening" },
  { hour: 23, palette: "deepSpace" },
]

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, "0")).join("")
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpColor(colorA: string, colorB: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(colorA)
  const [r2, g2, b2] = hexToRgb(colorB)
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t))
}

function lerpRgbString(rgb1: string, rgb2: string, t: number): string {
  const [r1, g1, b1] = rgb1.split(',').map(s => parseInt(s.trim()))
  const [r2, g2, b2] = rgb2.split(',').map(s => parseInt(s.trim()))
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `${r}, ${g}, ${b}`
}

function lerpPalette(paletteA: ColorPalette, paletteB: ColorPalette, t: number): ColorPalette {
  const smoothT = t * t * (3 - 2 * t) // smoothstep easing
  return {
    colorA: lerpColor(paletteA.colorA, paletteB.colorA, smoothT),
    colorB: lerpColor(paletteA.colorB, paletteB.colorB, smoothT),
    baseColor: lerpColor(paletteA.baseColor, paletteB.baseColor, smoothT),
    upColor: lerpColor(paletteA.upColor, paletteB.upColor, smoothT),
    downColor: lerpColor(paletteA.downColor, paletteB.downColor, smoothT),
    leftColor: lerpColor(paletteA.leftColor, paletteB.leftColor, smoothT),
    rightColor: lerpColor(paletteA.rightColor, paletteB.rightColor, smoothT),
    overlayOpacity: lerp(paletteA.overlayOpacity, paletteB.overlayOpacity, smoothT),
    starColors: paletteA.starColors.map((color, i) => {
      const nextColor = paletteB.starColors[i] || paletteB.starColors[0]
      return lerpRgbString(color, nextColor, smoothT)
    }),
    accentGlow: lerpColor(paletteA.accentGlow, paletteB.accentGlow, smoothT),
  }
}

function getCurrentPalette(hour: number): ColorPalette {
  let currentSlot = timeSlots[timeSlots.length - 1]
  let nextSlot = timeSlots[0]

  for (let i = 0; i < timeSlots.length; i++) {
    if (hour >= timeSlots[i].hour) {
      currentSlot = timeSlots[i]
      nextSlot = timeSlots[(i + 1) % timeSlots.length]
    }
  }

  const currentPalette = palettes[currentSlot.palette]
  const nextPalette = palettes[nextSlot.palette]

  let duration = nextSlot.hour - currentSlot.hour
  if (duration <= 0) duration += 24

  let elapsed = hour - currentSlot.hour
  if (elapsed < 0) elapsed += 24

  const t = elapsed / duration

  return lerpPalette(currentPalette, nextPalette, t)
}

export function useTimeContrast(overrideHour?: number | null) {
  const [palette, setPalette] = useState<ColorPalette>(palettes.midday)
  const [timeOfDay, setTimeOfDay] = useState<string>("midday")
  const [currentHour, setCurrentHour] = useState<number>(12)

  useEffect(() => {
    function update() {
      const hour = overrideHour ?? new Date().getHours() + new Date().getMinutes() / 60

      setCurrentHour(hour)
      const currentPalette = getCurrentPalette(hour)
      setPalette(currentPalette)

      const slot = timeSlots.reduce((prev, curr) =>
        hour >= curr.hour ? curr : prev
      , timeSlots[timeSlots.length - 1])
      setTimeOfDay(slot.palette)
    }

    update()

    if (overrideHour === undefined || overrideHour === null) {
      const interval = setInterval(update, 30000)
      return () => clearInterval(interval)
    }
  }, [overrideHour])

  return { ...palette, timeOfDay, currentHour }
}

// Export palettes for debugging/preview
export { palettes }
