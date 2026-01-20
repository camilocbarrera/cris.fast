"use client"

import { useRef, useEffect, useMemo } from "react"

interface RadiantConstellationProps {
  opacity?: number
  starColors?: string[]
}

interface Star {
  x: number
  y: number
  size: number
  blur: number
  opacity: number
  colorIndex: number // Store index instead of color for dynamic updates
}

// Default stellar colors (used as fallback)
const defaultStarColors = [
  "200, 220, 255", // Blue-white giants
  "255, 240, 220", // Warm white stars
  "180, 180, 220", // Cool distant stars
  "255, 200, 150", // Orange giants
  "220, 180, 255", // Purple nebula glow
  "150, 200, 255", // Bright blue stars
]

export function RadiantConstellation({
  opacity = 0.5,
  starColors = defaultStarColors
}: RadiantConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate scattered noise particles (positions only, colors are dynamic)
  const stars = useMemo(() => {
    const generated: Star[] = []
    const count = 300

    for (let i = 0; i < count; i++) {
      const x = Math.random()
      const y = Math.random()

      // Mostly tiny, few slightly larger
      const isLarge = Math.random() > 0.92
      const isMedium = !isLarge && Math.random() > 0.75

      generated.push({
        x,
        y,
        size: isLarge ? 0.5 + Math.random() * 0.3 : isMedium ? 0.3 + Math.random() * 0.2 : 0.15 + Math.random() * 0.15,
        blur: isLarge ? 0.8 + Math.random() * 0.5 : 0.2 + Math.random() * 0.3,
        opacity: isLarge ? 0.4 + Math.random() * 0.3 : isMedium ? 0.2 + Math.random() * 0.2 : 0.08 + Math.random() * 0.15,
        colorIndex: Math.floor(Math.random() * 6) // 6 color slots
      })
    }

    return generated
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    const drawStar = (x: number, y: number, size: number, blur: number, alpha: number, color: string) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size + blur)
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`)
      gradient.addColorStop(0.4, `rgba(${color}, ${alpha * 0.5})`)
      gradient.addColorStop(0.7, `rgba(${color}, ${alpha * 0.15})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      ctx.beginPath()
      ctx.arc(x, y, size + blur, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      stars.forEach((star) => {
        const x = star.x * width
        const y = star.y * height
        // Get color from current palette using stored index
        const color = starColors[star.colorIndex % starColors.length]
        drawStar(x, y, star.size, star.blur, star.opacity * opacity, color)
      })
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [stars, opacity, starColors])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        mixBlendMode: "screen"
      }}
    />
  )
}
