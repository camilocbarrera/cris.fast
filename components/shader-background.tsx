"use client"

import { useMemo } from "react"
import { Shader, ChromaFlow, Swirl } from "shaders/react"

interface ShaderBackgroundProps {
  colorA?: string
  colorB?: string
  baseColor?: string
  upColor?: string
  downColor?: string
  leftColor?: string
  rightColor?: string
  intensity?: number
  overlayOpacity?: number
  tiltX?: number
  tiltY?: number
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return "#" + [r, g, b].map(x => clamp(x).toString(16).padStart(2, "0")).join("")
}

function shiftColor(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * factor, g * factor, b * factor)
}

export function ShaderBackground({
  colorA = "#1c2838",
  colorB = "#385070",
  baseColor = "#5070a0",
  upColor = "#406088",
  downColor = "#101418",
  leftColor = "#2c3c58",
  rightColor = "#243048",
  intensity = 1,
  overlayOpacity = 0.1,
  tiltX = 0,
  tiltY = 0,
}: ShaderBackgroundProps) {
  // Apply tilt-based color shifting for gyroscope effect - increased for visibility
  const tiltedColors = useMemo(() => {
    const tiltFactor = 0.8
    const xInfluence = tiltX * tiltFactor
    const yInfluence = tiltY * tiltFactor

    return {
      up: shiftColor(upColor, 1 + yInfluence * 1.2),
      down: shiftColor(downColor, 1 - yInfluence * 0.8),
      left: shiftColor(leftColor, 1 + xInfluence * 1.2),
      right: shiftColor(rightColor, 1 - xInfluence * 0.8),
    }
  }, [upColor, downColor, leftColor, rightColor, tiltX, tiltY])

  return (
    <div className="fixed inset-0 z-0" style={{ contain: "strict" }}>
      <Shader className="h-full w-full">
        <Swirl
          colorA={colorA}
          colorB={colorB}
          speed={0.6}
          detail={0.8}
          blend={40}
          coarseX={30}
          coarseY={30}
          mediumX={25}
          mediumY={25}
          fineX={20}
          fineY={20}
        />
        <ChromaFlow
          baseColor={baseColor}
          upColor={tiltedColors.up}
          downColor={tiltedColors.down}
          leftColor={tiltedColors.left}
          rightColor={tiltedColors.right}
          intensity={intensity * 1.4}
          radius={2.2}
          momentum={32}
          maskType="alpha"
          opacity={0.96}
        />
      </Shader>
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
    </div>
  )
}
