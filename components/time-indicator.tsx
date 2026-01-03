"use client"

import { useState, useEffect } from "react"

interface TimeIndicatorProps {
  timeOfDay: string
}

function formatTime(hour: number): string {
  const h = Math.floor(hour)
  const period = h >= 12 ? "pm" : "am"
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}${period}`
}

export function TimeIndicator({ timeOfDay }: TimeIndicatorProps) {
  const [hour, setHour] = useState(12)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setHour(new Date().getHours())
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed bottom-2 left-2 z-40"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div 
        className={`flex items-center gap-1.5 text-[9px] font-mono transition-opacity duration-500 ${
          visible ? "opacity-40" : "opacity-[0.15]"
        }`}
      >
        <span className="text-white/80">{formatTime(hour)}</span>
        <span className="text-white/50">{timeOfDay}</span>
      </div>
    </div>
  )
}

