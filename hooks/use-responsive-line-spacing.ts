"use client"

import { useState, useEffect } from "react"

/**
 * Calculate responsive spacing using viewport units and mathematical constraints
 * Ensures lines never overlap with content or viewport edges on any screen size
 */
export function useResponsiveLineSpacing() {
  const [spacing, setSpacing] = useState({ horizontal: 376, vertical: 215 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function calculateSpacing() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const mobile = vw < 768

      setIsMobile(mobile)

      if (mobile) {
        // Mobile: use minimal spacing to maximize content area
        // Horizontal (top/bottom): 15% of viewport height, min 60px, max 120px
        const horizontal = Math.max(60, Math.min(120, vh * 0.15))
        // Vertical (left/right): 10% of viewport width, min 24px, max 60px
        const vertical = Math.max(24, Math.min(60, vw * 0.1))

        setSpacing({ horizontal, vertical })
      } else {
        // Desktop: use percentage-based spacing with larger bounds
        // Horizontal: 25% of viewport height, min 150px, max 400px
        const horizontal = Math.max(150, Math.min(400, vh * 0.25))
        // Vertical: 15% of viewport width, min 100px, max 300px
        const vertical = Math.max(100, Math.min(300, vw * 0.15))

        setSpacing({ horizontal, vertical })
      }
    }

    calculateSpacing()
    window.addEventListener("resize", calculateSpacing)
    return () => window.removeEventListener("resize", calculateSpacing)
  }, [])

  return { spacing, isMobile }
}
