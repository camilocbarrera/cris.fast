"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface DeviceOrientationState {
  tiltX: number
  tiltY: number
  isSupported: boolean
  hasPermission: boolean | null
  requestPermission: () => Promise<boolean>
}

interface PhysicsConfig {
  springStiffness: number
  dampingFactor: number
  maxTilt: number
  sensitivity: number
}

const defaultConfig: PhysicsConfig = {
  springStiffness: 0.08,
  dampingFactor: 0.85,
  maxTilt: 1,
  sensitivity: 0.025,
}

export function useDeviceOrientation(config: Partial<PhysicsConfig> = {}): DeviceOrientationState {
  const { springStiffness, dampingFactor, maxTilt, sensitivity } = { ...defaultConfig, ...config }
  
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const currentTilt = useRef({ x: 0, y: 0 })
  const targetTilt = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const animationFrame = useRef<number | null>(null)
  const isActive = useRef(false)

  // Clamp value between -max and +max
  const clamp = useCallback((value: number, max: number) => {
    return Math.max(-max, Math.min(max, value))
  }, [])

  // Physics-based animation loop with spring damping
  const updatePhysics = useCallback(() => {
    if (!isActive.current) return

    // Calculate spring force
    const forceX = (targetTilt.current.x - currentTilt.current.x) * springStiffness
    const forceY = (targetTilt.current.y - currentTilt.current.y) * springStiffness

    // Apply force to velocity
    velocity.current.x += forceX
    velocity.current.y += forceY

    // Apply damping
    velocity.current.x *= dampingFactor
    velocity.current.y *= dampingFactor

    // Update position
    currentTilt.current.x += velocity.current.x
    currentTilt.current.y += velocity.current.y

    // Clamp final values
    currentTilt.current.x = clamp(currentTilt.current.x, maxTilt)
    currentTilt.current.y = clamp(currentTilt.current.y, maxTilt)

    // Update state (throttled by animation frame)
    setTiltX(currentTilt.current.x)
    setTiltY(currentTilt.current.y)

    animationFrame.current = requestAnimationFrame(updatePhysics)
  }, [springStiffness, dampingFactor, maxTilt, clamp])

  // Handle device orientation events
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const { beta, gamma } = event
    
    if (beta === null || gamma === null) return

    // Normalize values: beta is front-back tilt (-180 to 180), gamma is left-right tilt (-90 to 90)
    // Center around upright position (beta ~90 when holding phone upright)
    const normalizedBeta = (beta - 90) / 90
    const normalizedGamma = gamma / 90

    // Apply sensitivity and clamp
    targetTilt.current.x = clamp(normalizedGamma * sensitivity * 40, maxTilt)
    targetTilt.current.y = clamp(normalizedBeta * sensitivity * 40, maxTilt)
  }, [sensitivity, maxTilt, clamp])

  // Request permission for iOS 13+
  const requestPermission = useCallback(async (): Promise<boolean> => {
    // Check if permission API exists (iOS 13+)
    if (typeof DeviceOrientationEvent !== "undefined" && 
        "requestPermission" in DeviceOrientationEvent &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === "function") {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
        const granted = response === "granted"
        setHasPermission(granted)
        return granted
      } catch {
        setHasPermission(false)
        return false
      }
    }
    
    // Non-iOS or older versions don't need permission
    setHasPermission(true)
    return true
  }, [])

  // Check support and setup listeners
  useEffect(() => {
    const supported = typeof window !== "undefined" && "DeviceOrientationEvent" in window
    setIsSupported(supported)

    if (!supported) {
      setHasPermission(false)
      return
    }

    // Check if permission is needed (iOS 13+)
    const needsPermission = typeof DeviceOrientationEvent !== "undefined" && 
      "requestPermission" in DeviceOrientationEvent

    if (!needsPermission) {
      // Android and older iOS don't need explicit permission
      setHasPermission(true)
    }
  }, [])

  // Setup orientation listener when permission is granted
  useEffect(() => {
    if (!isSupported || hasPermission !== true) return

    isActive.current = true
    window.addEventListener("deviceorientation", handleOrientation, { passive: true })
    animationFrame.current = requestAnimationFrame(updatePhysics)

    return () => {
      isActive.current = false
      window.removeEventListener("deviceorientation", handleOrientation)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [isSupported, hasPermission, handleOrientation, updatePhysics])

  return {
    tiltX,
    tiltY,
    isSupported,
    hasPermission,
    requestPermission,
  }
}
