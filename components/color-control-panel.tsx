"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

interface ColorConfig {
  shaderColorA: string
  shaderColorB: string
  shaderBaseColor: string
  shaderUpColor: string
  shaderDownColor: string
  shaderLeftColor: string
  shaderRightColor: string
  shaderIntensity: number
  shaderOverlayOpacity: number
  borderLineOpacity: number
  borderLineColor: string
  dotOpacity: number
  selectionBg: string
}

interface ColorControlPanelProps {
  onChange: (config: ColorConfig) => void
  initialConfig: ColorConfig
}

export function ColorControlPanel({ onChange, initialConfig }: ColorControlPanelProps) {
  const [config, setConfig] = useState<ColorConfig>(initialConfig)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  const updateConfig = (updates: Partial<ColorConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onChange(newConfig)
  }

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetToDefaults = () => {
    setConfig(initialConfig)
    onChange(initialConfig)
  }

  return (
    <div className="fixed top-4 right-4 z-[100] bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-80 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Color Controls</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/60 hover:text-white transition-colors"
          aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {/* Shader Colors */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-white/80">Shader Colors</h4>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Color A</label>
              <input
                type="color"
                value={config.shaderColorA}
                onChange={(e) => updateConfig({ shaderColorA: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Color B</label>
              <input
                type="color"
                value={config.shaderColorB}
                onChange={(e) => updateConfig({ shaderColorB: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Base Color</label>
              <input
                type="color"
                value={config.shaderBaseColor}
                onChange={(e) => updateConfig({ shaderBaseColor: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Shader Intensity */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 flex justify-between">
              <span>Shader Intensity</span>
              <span>{config.shaderIntensity.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.shaderIntensity}
              onChange={(e) => updateConfig({ shaderIntensity: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Shader Overlay */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 flex justify-between">
              <span>Overlay Opacity</span>
              <span>{config.shaderOverlayOpacity.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={config.shaderOverlayOpacity}
              onChange={(e) => updateConfig({ shaderOverlayOpacity: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Border Lines */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-white/80">Border Lines</h4>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Line Color</label>
              <input
                type="color"
                value={config.borderLineColor}
                onChange={(e) => updateConfig({ borderLineColor: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60 flex justify-between">
                <span>Line Opacity</span>
                <span>{config.borderLineOpacity.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.borderLineOpacity}
                onChange={(e) => updateConfig({ borderLineOpacity: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60 flex justify-between">
                <span>Dot Opacity</span>
                <span>{config.dotOpacity.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.dotOpacity}
                onChange={(e) => updateConfig({ dotOpacity: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Text Selection */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-white/80">Text Selection</h4>
            <input
              type="color"
              value={config.selectionBg}
              onChange={(e) => updateConfig({ selectionBg: e.target.value })}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={resetToDefaults}
              className="flex-1 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white/80 rounded transition-colors"
            >
              Reset
            </button>
            <button
              onClick={copyConfig}
              className="flex-1 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white/80 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Config
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
