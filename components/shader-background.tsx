"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"

interface Palette {
  colorA: string
  colorB: string
  baseColor: string
  upColor: string
  downColor: string
  leftColor: string
  rightColor: string
}

interface ShaderBackgroundProps {
  palette?: Palette
  intensity?: number
  overlayOpacity?: number
}

export function ShaderBackground({
  palette,
  intensity = 1,
  overlayOpacity = 0.1,
}: ShaderBackgroundProps) {
  // Default fallback colors (deep space theme)
  const colorA = palette?.colorA ?? "#0a0a1a"
  const colorB = palette?.colorB ?? "#1a1a3a"
  const baseColor = palette?.baseColor ?? "#0d1025"
  const upColor = palette?.upColor ?? "#1a1a4a"
  const downColor = palette?.downColor ?? "#050508"
  const leftColor = palette?.leftColor ?? "#12122a"
  const rightColor = palette?.rightColor ?? "#0f0f20"

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
          upColor={upColor}
          downColor={downColor}
          leftColor={leftColor}
          rightColor={rightColor}
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
