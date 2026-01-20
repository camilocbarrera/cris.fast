"use client"

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
}: ShaderBackgroundProps) {
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
