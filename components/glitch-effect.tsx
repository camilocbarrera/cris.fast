"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function GlitchEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const feImageRef = useRef<SVGFEImageElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    const feImage = feImageRef.current
    if (!canvas || !feImage) return

    const context = canvas.getContext("2d")
    if (!context) return

    const canvasHeight = 200
    canvas.height = canvasHeight

    const w = canvas.width
    const h = canvas.height
    let frameCount = 0
    const maxFrames = isMobile ? 180 : 240
    const fadeOutFrames = isMobile ? 60 : 80
    const glitchIntensity = isMobile ? 0.12 : 0.15
    let animationId: number
    let lastTime = 0
    const frameInterval = isMobile ? 1000 / 30 : 1000 / 60

    function generateNoise(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
      const pixelCount = width * height
      const image = ctx.createImageData(width, height)
      const pixels = image.data
      const base = 128
      const glitchiness = glitchIntensity * intensity

      for (let i = 0; i < pixelCount * 4; i += 4) {
        const chance = Math.random() <= glitchiness
        const offset = chance ? Math.floor(Math.random() * 255) : base
        pixels[i] = offset
        pixels[i + 1] = base
        pixels[i + 3] = 255
      }
      return image
    }

    function nextFrame(currentTime: number) {
      if (!context || !feImage || !canvas) return
      
      if (frameCount >= maxFrames) {
        context.clearRect(0, 0, w, h)
        return
      }

      const elapsed = currentTime - lastTime

      if (elapsed >= frameInterval) {
        lastTime = currentTime

        const framesRemaining = maxFrames - frameCount
        const intensity = framesRemaining <= fadeOutFrames ? framesRemaining / fadeOutFrames : 1.0

        const noise = generateNoise(context, w, h, intensity)
        context.putImageData(noise, 0, 0)
        feImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", canvas.toDataURL())

        frameCount++
      }

      animationId = requestAnimationFrame(nextFrame)
    }

    animationId = requestAnimationFrame(nextFrame)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isMobile])

  return (
    <>
      <canvas ref={canvasRef} id="wavemap" width="1" height="200" className="hidden" />
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
          <filter id="wavy" colorInterpolationFilters="sRGB">
            <feImage
              ref={feImageRef}
              id="wavemap_feImage"
              xlinkHref="#nothing"
              result="wavemap"
              preserveAspectRatio="none"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="wavemap" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              scale={isMobile ? 8 : 12} 
            />
          </filter>
        </defs>
      </svg>
    </>
  )
}

GlitchEffect.Text = function GlitchText({ children }: { children: ReactNode }) {
  const [isGlitching, setIsGlitching] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const duration = isMobile ? 3500 : 4500
    const timer = setTimeout(() => setIsGlitching(false), duration)
    return () => clearTimeout(timer)
  }, [isMobile])

  return (
    <div
      style={{
        filter: isGlitching ? "url(#wavy)" : "none",
        transition: "filter 0.5s ease-in-out",
        willChange: isGlitching ? "filter" : "auto",
        transform: "translateZ(0)",
      }}
    >
      {children}
    </div>
  )
}
