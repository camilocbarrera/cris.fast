interface BorderLinesProps {
  spacing: { horizontal: number; vertical: number }
  lineColor?: string
  lineOpacity?: number
  dotOpacity?: number
}

export function BorderLines({ spacing, lineColor = "#e5e4e7", lineOpacity = 0.3, dotOpacity = 0.4 }: BorderLinesProps) {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
      : "229, 228, 231"
  }

  const rgb = hexToRgb(lineColor)

  return (
    <>
      {/* Horizontal border lines */}
      <div
        className="fixed left-0 right-0 h-px pointer-events-none transition-all duration-300"
        style={{
          top: `${spacing.horizontal}px`,
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, ${lineOpacity}), transparent)`,
        }}
      />
      <div
        className="fixed left-0 right-0 h-px pointer-events-none transition-all duration-300"
        style={{
          bottom: `${spacing.horizontal}px`,
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, ${lineOpacity}), transparent)`,
        }}
      />

      {/* Vertical border lines */}
      <div
        className="fixed top-0 bottom-0 w-px pointer-events-none transition-all duration-300"
        style={{
          left: `${spacing.vertical}px`,
          background: `linear-gradient(180deg, transparent, rgba(${rgb}, ${lineOpacity}), transparent)`,
        }}
      />
      <div
        className="fixed top-0 bottom-0 w-px pointer-events-none transition-all duration-300"
        style={{
          right: `${spacing.vertical}px`,
          background: `linear-gradient(180deg, transparent, rgba(${rgb}, ${lineOpacity}), transparent)`,
        }}
      />

      {/* Corner dots */}
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-300"
        style={{
          top: `${spacing.horizontal}px`,
          left: `${spacing.vertical}px`,
          backgroundColor: `rgba(${rgb}, ${dotOpacity})`,
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-300"
        style={{
          top: `${spacing.horizontal}px`,
          right: `${spacing.vertical}px`,
          backgroundColor: `rgba(${rgb}, ${dotOpacity})`,
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-300"
        style={{
          bottom: `${spacing.horizontal}px`,
          left: `${spacing.vertical}px`,
          backgroundColor: `rgba(${rgb}, ${dotOpacity})`,
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-300"
        style={{
          bottom: `${spacing.horizontal}px`,
          right: `${spacing.vertical}px`,
          backgroundColor: `rgba(${rgb}, ${dotOpacity})`,
        }}
      />
    </>
  )
}
