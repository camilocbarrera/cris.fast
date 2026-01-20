"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TimeIslandProps {
  value: number | null
  onChange: (value: number | null) => void
  timeOfDay: string
}

function formatTime(hour: number): string {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  const period = h >= 12 ? "PM" : "AM"
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`
}

export function TimeIsland({ value, onChange, timeOfDay }: TimeIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentHour, setCurrentHour] = useState(12)

  useEffect(() => {
    const update = () => setCurrentHour(new Date().getHours() + new Date().getMinutes() / 60)
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  const displayHour = value ?? currentHour
  const isLive = value === null

  const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  }

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Island Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          layout
          onClick={() => !isExpanded && setIsExpanded(true)}
          className="cursor-pointer origin-top bg-black/50 backdrop-blur-md overflow-hidden"
          initial={false}
          animate={{
            width: isExpanded ? 300 : 90,
            height: isExpanded ? 165 : 28,
            borderRadius: isExpanded ? 24 : 14,
          }}
          transition={springConfig}
        >
          {/* Content wrapper with fade */}
          <motion.div
            className="w-full h-full relative"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {/* Collapsed content */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-1.5 px-3"
              initial={false}
              animate={{
                opacity: isExpanded ? 0 : 1,
                scale: isExpanded ? 0.8 : 1,
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ pointerEvents: isExpanded ? "none" : "auto" }}
            >
              <div className="w-1 h-1 rounded-full bg-[#7179C6]/60" />
              <span className="text-[10px] font-mono text-white/40">
                {formatTime(displayHour)}
              </span>
            </motion.div>

            {/* Expanded content */}
            <motion.div
              className="absolute inset-0 p-4"
              initial={false}
              animate={{
                opacity: isExpanded ? 1 : 0,
                scale: isExpanded ? 1 : 0.95,
              }}
              transition={{ duration: 0.2, ease: "easeOut", delay: isExpanded ? 0.1 : 0 }}
              style={{ pointerEvents: isExpanded ? "auto" : "none" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7179C6]/50" />
                  <span className="text-[9px] text-white/25 capitalize">
                    {timeOfDay.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                {isLive ? (
                  <span className="text-[8px] text-white/20 uppercase tracking-wider">
                    live
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(null)
                    }}
                    className="text-[8px] text-white/20 hover:text-white/35 uppercase tracking-wider transition-colors"
                  >
                    reset
                  </button>
                )}
              </div>

              {/* Time display */}
              <div className="text-center mb-4">
                <span className="text-2xl font-light font-mono text-white/70 tracking-tight">
                  {formatTime(displayHour)}
                </span>
              </div>

              {/* Slider */}
              <div className="px-1">
                <input
                  type="range"
                  min={0}
                  max={23.99}
                  step={0.1}
                  value={displayHour}
                  onChange={(e) => {
                    e.stopPropagation()
                    onChange(parseFloat(e.target.value))
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-0.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#7179C6]/70
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-white/5
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:active:scale-110"
                />

                {/* Time markers */}
                <div className="flex justify-between text-[7px] text-white/10 font-mono mt-1.5 px-0.5">
                  <span>12a</span>
                  <span>6a</span>
                  <span>12p</span>
                  <span>6p</span>
                  <span>12a</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
