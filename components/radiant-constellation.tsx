"use client"

import { useRef, useEffect, useMemo } from "react"

interface RadiantConstellationProps {
  opacity?: number
}

interface Star {
  x: number
  y: number
  size: number
  blur: number
  opacity: number
  color: string
}

// Dark grey/black noise palette
const starColors = [
  "180, 180, 180", // light grey
  "140, 140, 140", // medium grey
  "100, 100, 100", // dark grey
  "80, 80, 80",    // darker grey
  "60, 60, 60",    // very dark
  "200, 200, 200", // pale grey
  "120, 120, 120", // mid grey
  "90, 90, 90",    // charcoal
]

export function RadiantConstellation({
  opacity = 0.5
}: RadiantConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate scattered noise particles
  const stars = useMemo(() => {
    const generated: Star[] = []
    const count = 300

    for (let i = 0; i < count; i++) {
      const x = Math.random()
      const y = Math.random()

      // Mostly tiny, few slightly larger
      const isLarge = Math.random() > 0.92
      const isMedium = !isLarge && Math.random() > 0.75

      const color = starColors[Math.floor(Math.random() * starColors.length)]

      generated.push({
        x,
        y,
        size: isLarge ? 0.5 + Math.random() * 0.3 : isMedium ? 0.3 + Math.random() * 0.2 : 0.15 + Math.random() * 0.15,
        blur: isLarge ? 0.8 + Math.random() * 0.5 : 0.2 + Math.random() * 0.3,
        opacity: isLarge ? 0.4 + Math.random() * 0.3 : isMedium ? 0.2 + Math.random() * 0.2 : 0.08 + Math.random() * 0.15,
        color
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
        drawStar(x, y, star.size, star.blur, star.opacity * opacity, star.color)
      })
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [stars, opacity])

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
