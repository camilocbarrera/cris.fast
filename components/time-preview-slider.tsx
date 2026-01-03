"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"

interface TimePreviewSliderProps {
  value: number | null
  onChange: (value: number | null) => void
  timeOfDay: string
  showColorControls: boolean
  onToggleColorControls: () => void
}

function formatTime(hour: number): string {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  const period = h >= 12 ? "PM" : "AM"
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`
}

export function TimePreviewSlider({ value, onChange, timeOfDay, showColorControls, onToggleColorControls }: TimePreviewSliderProps) {
  const isLive = value === null
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  const speeds = [0.5, 1, 2, 4, 8]

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      const hoursPerSecond = 0.5 * speed
      const increment = (delta / 1000) * hoursPerSecond

      const currentValue = value ?? new Date().getHours() + new Date().getMinutes() / 60
      let newValue = currentValue + increment

      if (newValue >= 24) newValue = 0

      onChange(newValue)
      animationRef.current = requestAnimationFrame(animate)
    }

    lastTimeRef.current = 0
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, speed, onChange, value])

  const handlePlayPause = () => {
    if (isLive && !isPlaying) {
      onChange(new Date().getHours() + new Date().getMinutes() / 60)
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    onChange(null)
  }

  const displayValue = value ?? new Date().getHours() + new Date().getMinutes() / 60

  return (
    <div className="fixed bottom-3 left-3 z-50 bg-black/50 backdrop-blur-sm rounded-md border border-white/10 text-[10px]">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          onClick={handlePlayPause}
          className={`p-1 rounded transition-colors ${
            isPlaying ? "text-orange-400" : "text-white/50 hover:text-white/80"
          }`}
        >
          {isPlaying ? (
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <Slider
          value={[displayValue]}
          onValueChange={([v]) => {
            setIsPlaying(false)
            onChange(v)
          }}
          min={0}
          max={23.99}
          step={0.05}
          className="w-24"
        />

        <span className="text-white/70 font-mono w-14 text-center">{formatTime(displayValue)}</span>
        
        <span className="text-white/40 capitalize w-12 truncate">{timeOfDay}</span>

        {isLive && !isPlaying ? (
          <span className="text-green-400/80 text-[8px] uppercase">Live</span>
        ) : (
          <button onClick={handleReset} className="text-white/40 hover:text-white/70 text-[8px] uppercase">
            Reset
          </button>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white/40 hover:text-white/70 ml-1"
        >
          <svg className={`w-2.5 h-2.5 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="px-2 pb-2 pt-1 border-t border-white/5 space-y-1.5">
          <div className="flex items-center gap-1">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                  speed === s
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <button
            onClick={onToggleColorControls}
            className={`w-full py-1 rounded transition-colors ${
              showColorControls
                ? "text-white/40 hover:text-white/60"
                : "bg-purple-500/20 text-purple-400"
            }`}
          >
            {showColorControls ? "Hide Colors" : "Show Colors"}
          </button>
        </div>
      )}
    </div>
  )
}
