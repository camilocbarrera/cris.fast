"use client"

import { useState, useEffect, useRef } from "react"
import { GlitchEffect } from "@/components/glitch-effect"
import { BorderLines } from "@/components/border-lines"
import { HoverZones } from "@/components/hover-zones"
import { SocialLinks } from "@/components/social-links"
import { ShaderBackground } from "@/components/shader-background"
import { GrainOverlay } from "@/components/grain-overlay"
import { ColorControlPanel } from "@/components/color-control-panel"
import { TimePreviewSlider } from "@/components/time-preview-slider"
import { TimeIndicator } from "@/components/time-indicator"
import { useTimeContrast } from "@/hooks/use-time-contrast"

const initialColorConfig = {
  shaderColorA: "#050505",
  shaderColorB: "#1a1a1a",
  shaderBaseColor: "#2a2a2a",
  shaderUpColor: "#181818",
  shaderDownColor: "#030303",
  shaderLeftColor: "#141414",
  shaderRightColor: "#0a0a0a",
  shaderIntensity: 0.6,
  shaderOverlayOpacity: 0.25,
  borderLineColor: "#888888",
  borderLineOpacity: 0.35,
  dotOpacity: 0.45,
  selectionBg: "#2a2a2a",
}

const isProduction = process.env.NODE_ENV === "production"
const SHOW_DEV_CONTROLS = !isProduction

export default function Portfolio() {
  const [spacing, setSpacing] = useState({ horizontal: 380, vertical: 500 })
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [colorConfig, setColorConfig] = useState(initialColorConfig)
  const [previewHour, setPreviewHour] = useState<number | null>(null)
  const [showColorControls, setShowColorControls] = useState(true)
  
  const timePalette = useTimeContrast(previewHour)

  useEffect(() => {
    document.documentElement.style.setProperty("--selection-bg", colorConfig.selectionBg)
  }, [colorConfig.selectionBg])

  useEffect(() => {
    function calculateResponsiveSpacing() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const mobile = vw < 768

      setIsMobile(mobile)

      if (mobile) {
        const contentHeight = contentRef.current?.offsetHeight || 150
        const minPadding = 40
        const maxHorizontal = Math.floor((vh - contentHeight) / 2 - minPadding)
        const horizontalSpacing = Math.max(60, Math.min(maxHorizontal, vh * 0.15))
        const verticalSpacing = Math.max(24, Math.min(vw * 0.08, 48))
        setSpacing({ horizontal: horizontalSpacing, vertical: verticalSpacing })
      } else {
        const horizontalPercent = 380 / 1920
        const verticalPercent = 500 / 1080
        const horizontal = Math.max(150, Math.min(vh * 0.35, vh * horizontalPercent * 2))
        const vertical = Math.max(100, Math.min(vw * 0.25, vw * verticalPercent))
        setSpacing({ horizontal, vertical })
      }
    }

    calculateResponsiveSpacing()
    window.addEventListener("resize", calculateResponsiveSpacing)
    return () => window.removeEventListener("resize", calculateResponsiveSpacing)
  }, [])

  return (
    <main className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
      <ShaderBackground
        colorA={timePalette.colorA}
        colorB={timePalette.colorB}
        baseColor={timePalette.baseColor}
        upColor={timePalette.upColor}
        downColor={timePalette.downColor}
        leftColor={timePalette.leftColor}
        rightColor={timePalette.rightColor}
        intensity={colorConfig.shaderIntensity}
        overlayOpacity={timePalette.overlayOpacity}
      />

      <GrainOverlay />
      <GlitchEffect />

      <HoverZones spacing={spacing} isMobile={isMobile} />

      <BorderLines
        spacing={spacing}
        lineColor={colorConfig.borderLineColor}
        lineOpacity={colorConfig.borderLineOpacity}
        dotOpacity={colorConfig.dotOpacity}
      />

      {SHOW_DEV_CONTROLS ? (
        <>
          {showColorControls && (
            <ColorControlPanel onChange={setColorConfig} initialConfig={initialColorConfig} />
          )}
          <TimePreviewSlider 
            value={previewHour} 
            onChange={setPreviewHour} 
            timeOfDay={timePalette.timeOfDay}
            showColorControls={showColorControls}
            onToggleColorControls={() => setShowColorControls(!showColorControls)}
          />
        </>
      ) : (
        <TimeIndicator timeOfDay={timePalette.timeOfDay} />
      )}

      {/* Content area */}
      <div ref={contentRef} className="w-full max-w-[240px] md:max-w-md space-y-4 md:space-y-8 relative z-10">
        <GlitchEffect.Text>
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-xl md:text-3xl font-medium text-foreground text-balance">Cris</h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {"Software Engineer building data-intensive applications"}
            </p>
          </div>
        </GlitchEffect.Text>

        <SocialLinks />
      </div>
    </main>
  )
}
