"use client"

import { useState, useEffect } from "react"

interface TimeIndicatorProps {
  timeOfDay: string
  value: number | null
  onChange: (value: number | null) => void
}

function formatTime(hour: number): string {
  const h = Math.floor(hour)
  const period = h >= 12 ? "pm" : "am"
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}${period}`
}

export function TimeIndicator({ timeOfDay, value, onChange }: TimeIndicatorProps) {
  const [expanded, setExpanded] = useState(false)
  const [currentHour, setCurrentHour] = useState(12)

  useEffect(() => {
    const update = () => setCurrentHour(new Date().getHours() + new Date().getMinutes() / 60)
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  const displayHour = value ?? currentHour
  const isLive = value === null

  return (
    <div
      className="fixed bottom-2 left-2 z-40 group"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={`transition-all duration-300 ${expanded ? "opacity-60" : "opacity-[0.12]"}`}>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/80 mb-1">
          <span>{formatTime(displayHour)}</span>
          <span className="text-white/40">{timeOfDay}</span>
          {isLive && <span className="text-green-400/60 text-[7px]">live</span>}
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden ${expanded ? "h-4 opacity-100" : "h-0 opacity-0"}`}>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={23.99}
              step={0.25}
              value={displayHour}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="w-20 h-0.5 bg-white/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-1.5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60"
            />
            {!isLive && (
              <button 
                onClick={() => onChange(null)}
                className="text-[7px] text-white/40 hover:text-white/60"
              >
                reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
