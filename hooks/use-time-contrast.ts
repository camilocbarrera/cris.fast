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
    colorA: "#030303",
    colorB: "#080808",
    baseColor: "#0c0c0c",
    upColor: "#0a0a0a",
    downColor: "#020202",
    leftColor: "#060606",
    rightColor: "#050505",
    overlayOpacity: 0.0,
  },
  blueHour: {
    colorA: "#040404",
    colorB: "#0a0a0a",
    baseColor: "#101010",
    upColor: "#0c0c0c",
    downColor: "#030303",
    leftColor: "#080808",
    rightColor: "#060606",
    overlayOpacity: 0.0,
  },
  dawn: {
    colorA: "#050505",
    colorB: "#0c0c0c",
    baseColor: "#141414",
    upColor: "#101010",
    downColor: "#030303",
    leftColor: "#0a0a0a",
    rightColor: "#080808",
    overlayOpacity: 0.0,
  },
  sunrise: {
    colorA: "#060606",
    colorB: "#0e0e0e",
    baseColor: "#181818",
    upColor: "#141414",
    downColor: "#040404",
    leftColor: "#0c0c0c",
    rightColor: "#0a0a0a",
    overlayOpacity: 0.0,
  },
  morning: {
    colorA: "#080808",
    colorB: "#121212",
    baseColor: "#1c1c1c",
    upColor: "#181818",
    downColor: "#050505",
    leftColor: "#0e0e0e",
    rightColor: "#0c0c0c",
    overlayOpacity: 0.0,
  },
  midday: {
    colorA: "#0a0a0a",
    colorB: "#161616",
    baseColor: "#222222",
    upColor: "#1c1c1c",
    downColor: "#060606",
    leftColor: "#121212",
    rightColor: "#0e0e0e",
    overlayOpacity: 0.0,
  },
  afternoon: {
    colorA: "#080808",
    colorB: "#141414",
    baseColor: "#1e1e1e",
    upColor: "#1a1a1a",
    downColor: "#050505",
    leftColor: "#101010",
    rightColor: "#0c0c0c",
    overlayOpacity: 0.0,
  },
  goldenHour: {
    colorA: "#070707",
    colorB: "#101010",
    baseColor: "#1a1a1a",
    upColor: "#161616",
    downColor: "#040404",
    leftColor: "#0c0c0c",
    rightColor: "#0a0a0a",
    overlayOpacity: 0.0,
  },
  sunset: {
    colorA: "#060606",
    colorB: "#0e0e0e",
    baseColor: "#161616",
    upColor: "#121212",
    downColor: "#030303",
    leftColor: "#0a0a0a",
    rightColor: "#080808",
    overlayOpacity: 0.0,
  },
  dusk: {
    colorA: "#050505",
    colorB: "#0c0c0c",
    baseColor: "#141414",
    upColor: "#101010",
    downColor: "#030303",
    leftColor: "#080808",
    rightColor: "#060606",
    overlayOpacity: 0.0,
  },
  evening: {
    colorA: "#040404",
    colorB: "#0a0a0a",
    baseColor: "#101010",
    upColor: "#0c0c0c",
    downColor: "#020202",
    leftColor: "#060606",
    rightColor: "#050505",
    overlayOpacity: 0.0,
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
