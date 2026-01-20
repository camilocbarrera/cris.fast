"use client"

import { useEffect, useState } from "react"

interface TiltIndicatorProps {
  tiltX: number
  tiltY: number
  visible: boolean
}

export function TiltIndicator({ tiltX, tiltY, visible }: TiltIndicatorProps) {
  const [show, setShow] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      setFadeOut(false)

      // Auto-hide after 4 seconds
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000)
      const hideTimer = setTimeout(() => setShow(false), 4000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [visible])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[55] pointer-events-none flex items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Tilt visualization ring */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-white/20" />

        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-6 bg-white/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-px bg-white/20" />
        </div>

        {/* Moving dot */}
        <div
          className="absolute w-3 h-3 bg-white/60 rounded-full shadow-lg shadow-white/20"
          style={{
            left: `calc(50% + ${tiltX * 35}px - 6px)`,
            top: `calc(50% + ${tiltY * 35}px - 6px)`,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        />
      </div>

      {/* Instruction text */}
      <div
        className={`absolute bottom-32 text-center text-white/50 text-sm transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        tilt your device
      </div>
    </div>
  )
}
