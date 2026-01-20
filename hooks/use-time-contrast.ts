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

// Stellar color palettes - based on real astronomical phenomena
const palettes: Record<string, ColorPalette> = {
  // 0-4am: Deep Space - The darkest void with distant galaxies
  deepSpace: {
    colorA: "#0a0a1a",      // Near black with blue hint
    colorB: "#1a1a3a",      // Deep space blue
    baseColor: "#0d1025",   // Cosmic void
    upColor: "#1a1a4a",     // Distant nebula glow
    downColor: "#050508",   // Pure darkness
    leftColor: "#12122a",   // Starfield edge
    rightColor: "#0f0f20",  // Galaxy arm
    overlayOpacity: 0.05,
    starColors: [
      "200, 220, 255",      // Blue-white giants
      "255, 240, 220",      // Warm white stars
      "180, 180, 220",      // Cool distant stars
      "255, 200, 150",      // Orange giants
      "220, 180, 255",      // Purple nebula glow
      "150, 200, 255",      // Bright blue stars
    ],
    accentGlow: "#4a3a8a",
  },

  // 4-5:30am: Blue Hour - Pre-dawn stillness
  blueHour: {
    colorA: "#0d1028",      // Deep blue
    colorB: "#1a1840",      // Twilight blue
    baseColor: "#121530",   // Pre-dawn
    upColor: "#1e1c4a",     // Sky lightening
    downColor: "#06060c",   // Ground dark
    leftColor: "#141430",   // Eastern hint
    rightColor: "#101025",  // Western dark
    overlayOpacity: 0.04,
    starColors: [
      "180, 200, 255",      // Fading blue stars
      "200, 180, 240",      // Violet morning
      "220, 210, 255",      // Cool white
      "160, 180, 230",      // Pale blue
      "190, 170, 220",      // Soft purple
      "210, 200, 240",      // Lavender
    ],
    accentGlow: "#3a4090",
  },

  // 5:30-6:30am: Cosmic Dawn - First light piercing the void
  dawn: {
    colorA: "#1a1025",      // Deep purple-blue
    colorB: "#2a1a3a",      // Twilight purple
    baseColor: "#251530",   // Pre-dawn violet
    upColor: "#3a2040",     // Rising magenta
    downColor: "#0a0812",   // Lingering night
    leftColor: "#201a35",   // Blending horizon
    rightColor: "#2a1530",  // First light edge
    overlayOpacity: 0.03,
    starColors: [
      "255, 180, 200",      // Pink dawn stars
      "200, 150, 220",      // Violet fading
      "255, 200, 180",      // Warm awakening
      "180, 160, 200",      // Twilight remnants
      "255, 220, 200",      // Golden hints
      "220, 180, 220",      // Soft purple
    ],
    accentGlow: "#6a3a6a",
  },

  // 6:30-8am: Nebula Rise - Like the Orion Nebula awakening
  sunrise: {
    colorA: "#2a1a2a",      // Deep magenta-brown
    colorB: "#4a2a3a",      // Dusty rose nebula
    baseColor: "#3a2030",   // Warm nebula core
    upColor: "#5a3040",     // Rising cosmic dust
    downColor: "#1a1018",   // Fading darkness
    leftColor: "#352535",   // Nebula edge
    rightColor: "#402a35",  // Stellar nursery
    overlayOpacity: 0.02,
    starColors: [
      "255, 200, 150",      // Young orange stars
      "255, 180, 180",      // Pink protostars
      "255, 220, 180",      // Golden newborns
      "220, 180, 200",      // Rose tint
      "255, 240, 200",      // Bright yellow
      "240, 200, 180",      // Warm amber
    ],
    accentGlow: "#8a4a5a",
  },

  // 8-11am: Solar Corona morning
  morning: {
    colorA: "#252018",      // Warm brown
    colorB: "#403520",      // Golden dust
    baseColor: "#352a20",   // Morning warmth
    upColor: "#4a4030",     // Corona glow
    downColor: "#151210",   // Soft shadow
    leftColor: "#302820",   // Amber edge
    rightColor: "#382e20",  // Gold rim
    overlayOpacity: 0.01,
    starColors: [
      "255, 240, 200",      // Solar white
      "255, 220, 160",      // Bright gold
      "255, 200, 130",      // Amber
      "250, 245, 220",      // Warm cream
      "240, 220, 180",      // Light gold
      "255, 230, 190",      // Soft gold
    ],
    accentGlow: "#9a7a4a",
  },

  // 11am-2pm: Stellar Noon - Peak brightness
  midday: {
    colorA: "#202428",      // Cool steel
    colorB: "#303840",      // Bright cosmic
    baseColor: "#282c35",   // Clear space
    upColor: "#3a4048",     // Zenith light
    downColor: "#121418",   // Grounded shadow
    leftColor: "#252a30",   // Cool side
    rightColor: "#2a3038",  // Bright edge
    overlayOpacity: 0.0,
    starColors: [
      "255, 255, 255",      // Pure white
      "220, 240, 255",      // Blue-white
      "255, 250, 240",      // Warm white
      "200, 220, 255",      // Cool blue
      "240, 245, 255",      // Ice white
      "255, 255, 245",      // Cream white
    ],
    accentGlow: "#6a7a9a",
  },

  // 2-5pm: Stellar Drift - Like a comet's tail
  afternoon: {
    colorA: "#201830",      // Purple-blue shift
    colorB: "#302840",      // Drifting violet
    baseColor: "#282035",   // Comet core
    upColor: "#3a3048",     // Tail glow
    downColor: "#100c15",   // Deep shadow
    leftColor: "#252030",   // Trailing edge
    rightColor: "#2a2538",  // Leading edge
    overlayOpacity: 0.01,
    starColors: [
      "220, 200, 255",      // Violet shift
      "255, 220, 240",      // Pink drift
      "200, 180, 240",      // Lavender
      "255, 230, 230",      // Warm fade
      "180, 200, 255",      // Cool blue
      "240, 220, 255",      // Soft purple
    ],
    accentGlow: "#7a5a8a",
  },

  // 5-6:30pm: Golden Hour - Solar warmth intensifies
  goldenHour: {
    colorA: "#2a2015",      // Deep amber
    colorB: "#453020",      // Rich gold
    baseColor: "#38281a",   // Golden core
    upColor: "#503828",     // Ember glow
    downColor: "#151008",   // Warm shadow
    leftColor: "#322518",   // Amber edge
    rightColor: "#3a2a18",  // Gold rim
    overlayOpacity: 0.02,
    starColors: [
      "255, 220, 150",      // Golden
      "255, 200, 120",      // Deep gold
      "255, 240, 180",      // Light gold
      "240, 200, 140",      // Amber
      "255, 230, 160",      // Warm yellow
      "250, 210, 150",      // Soft gold
    ],
    accentGlow: "#aa7a3a",
  },

  // 6:30-8pm: Cosmic Sunset - Like a dying star
  sunset: {
    colorA: "#2a1520",      // Deep burgundy
    colorB: "#4a2530",      // Dying star red
    baseColor: "#351a28",   // Sunset core
    upColor: "#5a3038",     // Ember glow
    downColor: "#100810",   // Night approaching
    leftColor: "#301a25",   // Fading horizon
    rightColor: "#402028",  // Last light
    overlayOpacity: 0.03,
    starColors: [
      "255, 150, 100",      // Orange giant
      "255, 180, 150",      // Warm ember
      "255, 120, 80",       // Deep orange
      "255, 200, 180",      // Pink sunset
      "220, 150, 120",      // Dusty red
      "255, 160, 140",      // Salmon glow
    ],
    accentGlow: "#aa5a4a",
  },

  // 8-9:30pm: Twilight Nebula - Deep purples like Carina Nebula
  dusk: {
    colorA: "#1a1030",      // Deep purple
    colorB: "#301848",      // Nebula purple
    baseColor: "#251238",   // Twilight core
    upColor: "#3a2050",     // Magenta clouds
    downColor: "#0a0815",   // Deep void
    leftColor: "#201030",   // Purple edge
    rightColor: "#2a1540",  // Violet rim
    overlayOpacity: 0.04,
    starColors: [
      "220, 150, 255",      // Bright purple
      "255, 180, 220",      // Pink nebula
      "180, 120, 220",      // Deep violet
      "255, 200, 255",      // Light magenta
      "200, 180, 255",      // Soft purple
      "240, 160, 240",      // Orchid
    ],
    accentGlow: "#8a3a9a",
  },

  // 9:30-11pm: Midnight Galaxy - The Milky Way
  evening: {
    colorA: "#101025",      // Deep blue-black
    colorB: "#202040",      // Galaxy arm blue
    baseColor: "#151530",   // Midnight void
    upColor: "#252550",     // Star cloud glow
    downColor: "#080810",   // Absolute dark
    leftColor: "#181835",   // Galaxy edge
    rightColor: "#1a1a3a",  // Spiral arm
    overlayOpacity: 0.05,
    starColors: [
      "200, 220, 255",      // Blue giants
      "255, 220, 200",      // Yellow stars
      "180, 200, 255",      // Cool blue
      "255, 200, 180",      // Orange giants
      "220, 220, 255",      // White giants
      "255, 180, 150",      // Red giants
    ],
    accentGlow: "#4a4a8a",
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
