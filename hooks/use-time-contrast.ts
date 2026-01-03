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
}

const palettes: Record<string, ColorPalette> = {
  deepNight: {
    colorA: "#020306",
    colorB: "#06090f",
    baseColor: "#080c14",
    upColor: "#050810",
    downColor: "#010203",
    leftColor: "#04060a",
    rightColor: "#030408",
    overlayOpacity: 0.03,
  },
  blueHour: {
    colorA: "#04050c",
    colorB: "#0a0c1a",
    baseColor: "#101428",
    upColor: "#0c1020",
    downColor: "#020308",
    leftColor: "#080a14",
    rightColor: "#06080e",
    overlayOpacity: 0.06,
  },
  dawn: {
    colorA: "#0c0608",
    colorB: "#1a0e12",
    baseColor: "#2a161c",
    upColor: "#201018",
    downColor: "#060306",
    leftColor: "#140a0e",
    rightColor: "#0e060a",
    overlayOpacity: 0.12,
  },
  sunrise: {
    colorA: "#140a06",
    colorB: "#2a180e",
    baseColor: "#3a2214",
    upColor: "#2e1a10",
    downColor: "#0a0604",
    leftColor: "#1e100a",
    rightColor: "#140c08",
    overlayOpacity: 0.18,
  },
  morning: {
    colorA: "#0a0c10",
    colorB: "#161c24",
    baseColor: "#202a38",
    upColor: "#1a222e",
    downColor: "#060708",
    leftColor: "#101418",
    rightColor: "#0c0e12",
    overlayOpacity: 0.25,
  },
  midday: {
    colorA: "#0c1014",
    colorB: "#1a2028",
    baseColor: "#263040",
    upColor: "#202838",
    downColor: "#06080a",
    leftColor: "#14181e",
    rightColor: "#0e1216",
    overlayOpacity: 0.32,
  },
  afternoon: {
    colorA: "#100e0c",
    colorB: "#221e1a",
    baseColor: "#302a24",
    upColor: "#28221e",
    downColor: "#080706",
    leftColor: "#181614",
    rightColor: "#100e0c",
    overlayOpacity: 0.28,
  },
  goldenHour: {
    colorA: "#140a04",
    colorB: "#2c1608",
    baseColor: "#3e200c",
    upColor: "#321a0a",
    downColor: "#0a0602",
    leftColor: "#1e0e06",
    rightColor: "#140a04",
    overlayOpacity: 0.22,
  },
  sunset: {
    colorA: "#120408",
    colorB: "#280a12",
    baseColor: "#3a0e18",
    upColor: "#2e0c14",
    downColor: "#080206",
    leftColor: "#1a060c",
    rightColor: "#100408",
    overlayOpacity: 0.16,
  },
  dusk: {
    colorA: "#0a0610",
    colorB: "#160e22",
    baseColor: "#201432",
    upColor: "#1a1028",
    downColor: "#04030a",
    leftColor: "#0e0a18",
    rightColor: "#080610",
    overlayOpacity: 0.10,
  },
  evening: {
    colorA: "#060508",
    colorB: "#0c0a14",
    baseColor: "#12101e",
    upColor: "#0e0c18",
    downColor: "#030306",
    leftColor: "#08080e",
    rightColor: "#06060a",
    overlayOpacity: 0.05,
  },
}

const timeSlots = [
  { hour: 0, palette: "deepNight" },
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
  { hour: 23, palette: "deepNight" },
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

function lerpPalette(paletteA: ColorPalette, paletteB: ColorPalette, t: number): ColorPalette {
  const smoothT = t * t * (3 - 2 * t)
  return {
    colorA: lerpColor(paletteA.colorA, paletteB.colorA, smoothT),
    colorB: lerpColor(paletteA.colorB, paletteB.colorB, smoothT),
    baseColor: lerpColor(paletteA.baseColor, paletteB.baseColor, smoothT),
    upColor: lerpColor(paletteA.upColor, paletteB.upColor, smoothT),
    downColor: lerpColor(paletteA.downColor, paletteB.downColor, smoothT),
    leftColor: lerpColor(paletteA.leftColor, paletteB.leftColor, smoothT),
    rightColor: lerpColor(paletteA.rightColor, paletteB.rightColor, smoothT),
    overlayOpacity: lerp(paletteA.overlayOpacity, paletteB.overlayOpacity, smoothT),
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
