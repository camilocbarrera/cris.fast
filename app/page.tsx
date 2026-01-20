"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import { useDeviceOrientation } from "@/hooks/use-device-orientation"
import { RadiantConstellation } from "@/components/radiant-constellation"

const initialColorConfig = {
  shaderColorA: "#050505",
  shaderColorB: "#1a1a1a",
  shaderBaseColor: "#2a2a2a",
  shaderUpColor: "#181818",
  shaderDownColor: "#030303",
  shaderLeftColor: "#141414",
  shaderRightColor: "#0a0a0a",
  shaderIntensity: 0.8,
  shaderOverlayOpacity: 0.1,
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
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [glitchKey, setGlitchKey] = useState(0)

  const timePalette = useTimeContrast(previewHour)
  const { tiltX, tiltY, isSupported, hasPermission, requestPermission } = useDeviceOrientation()

  // Auto-enable motion on Android, show prompt on iOS
  const handleEnableMotion = useCallback(async () => {
    if (hasPermission === true) {
      setMotionEnabled(true)
      return
    }
    const granted = await requestPermission()
    if (granted) setMotionEnabled(true)
  }, [hasPermission, requestPermission])

  // Auto-request on first interaction for iOS
  useEffect(() => {
    if (!isSupported) return
    if (hasPermission === true && !motionEnabled) {
      setMotionEnabled(true)
    }
  }, [isSupported, hasPermission, motionEnabled])

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
    <main 
      className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden"
      onTouchStart={isSupported && hasPermission === null ? handleEnableMotion : undefined}
    >
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
        tiltX={motionEnabled ? tiltX : 0}
        tiltY={motionEnabled ? tiltY : 0}
      />


      <RadiantConstellation
        tiltX={motionEnabled ? tiltX : 0}
        tiltY={motionEnabled ? tiltY : 0}
        opacity={0.5}
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
          {/* Dev: Enable Motion Button */}
          {hasPermission !== true && isSupported && (
            <button
              onClick={handleEnableMotion}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-bold rounded-full text-lg shadow-2xl shadow-emerald-500/40 animate-pulse"
            >
              Tap to Enable Motion
            </button>
          )}
          {/* Dev: Gyroscope Debug */}
          <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white text-xs font-mono p-3 rounded-lg space-y-1 min-w-[180px]">
            <div className="text-emerald-400 font-bold mb-2">Gyroscope Debug</div>
            <div>supported: <span className={isSupported ? "text-green-400" : "text-red-400"}>{String(isSupported)}</span></div>
            <div>permission: <span className={hasPermission === true ? "text-green-400" : hasPermission === false ? "text-red-400" : "text-yellow-400"}>{String(hasPermission)}</span></div>
            <div>enabled: <span className={motionEnabled ? "text-green-400" : "text-red-400"}>{String(motionEnabled)}</span></div>
            <div className="border-t border-white/20 pt-1 mt-1">
              <div>tiltX: <span className="text-cyan-400">{tiltX.toFixed(3)}</span></div>
              <div>tiltY: <span className="text-cyan-400">{tiltY.toFixed(3)}</span></div>
            </div>
            <div className="relative w-full h-16 bg-white/10 rounded mt-2 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-white/30" />
                <div className="absolute w-full h-px bg-white/30" />
              </div>
              <div 
                className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                style={{
                  left: `calc(50% + ${tiltX * 40}px - 6px)`,
                  top: `calc(50% + ${tiltY * 30}px - 6px)`,
                  transition: "none"
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <TimeIndicator
            timeOfDay={timePalette.timeOfDay}
            value={previewHour}
            onChange={setPreviewHour}
          />
          {/* Subtle motion prompt for mobile in production */}
          {isSupported && hasPermission !== true && !motionEnabled && (
            <button
              onClick={handleEnableMotion}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 text-xs text-muted-foreground/60 hover:text-muted-foreground border border-muted-foreground/20 hover:border-muted-foreground/40 rounded-full backdrop-blur-sm transition-all"
            >
              enable motion
            </button>
          )}
        </>
      )}

      {/* Content area */}
      <div ref={contentRef} className="w-full max-w-[240px] md:max-w-md space-y-4 md:space-y-6 relative z-10">
        <GlitchEffect.Text triggerKey={glitchKey}>
          <div className="space-y-1 md:space-y-2">
            <h1
              className="text-xl md:text-3xl font-medium text-foreground text-balance cursor-default"
              onMouseEnter={() => setGlitchKey((k) => k + 1)}
            >
              Cris
            </h1>
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
