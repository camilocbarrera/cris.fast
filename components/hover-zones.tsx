"use client"

import { useState } from "react"

interface HoverZonesProps {
  spacing: { horizontal: number; vertical: number }
  isMobile: boolean
}

interface ZoneProps {
  style: React.CSSProperties
  isMobile: boolean
}

function Zone({ style, isMobile }: ZoneProps) {
  const [isActive, setIsActive] = useState(false)

  const handleTouchStart = () => setIsActive(true)
  const handleTouchEnd = () => setIsActive(false)

  return (
    <div
      className="fixed transition-colors duration-300"
      style={{
        ...style,
        backgroundColor: isActive ? "rgba(255,255,255,0.02)" : "transparent",
      }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchCancel={isMobile ? handleTouchEnd : undefined}
      onMouseEnter={!isMobile ? () => setIsActive(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsActive(false) : undefined}
    />
  )
}

export function HoverZones({ spacing, isMobile }: HoverZonesProps) {
  const zones = [
    { top: 0, left: 0, width: `${spacing.vertical}px`, height: `${spacing.horizontal}px` },
    { top: 0, left: `${spacing.vertical}px`, right: `${spacing.vertical}px`, height: `${spacing.horizontal}px` },
    { top: 0, right: 0, width: `${spacing.vertical}px`, height: `${spacing.horizontal}px` },
    { top: `${spacing.horizontal}px`, left: 0, width: `${spacing.vertical}px`, bottom: `${spacing.horizontal}px` },
    { top: `${spacing.horizontal}px`, right: 0, width: `${spacing.vertical}px`, bottom: `${spacing.horizontal}px` },
    { bottom: 0, left: 0, width: `${spacing.vertical}px`, height: `${spacing.horizontal}px` },
    { bottom: 0, left: `${spacing.vertical}px`, right: `${spacing.vertical}px`, height: `${spacing.horizontal}px` },
    { bottom: 0, right: 0, width: `${spacing.vertical}px`, height: `${spacing.horizontal}px` },
  ]

  return (
    <>
      {zones.map((style, i) => (
        <Zone key={i} style={style} isMobile={isMobile} />
      ))}
    </>
  )
}
