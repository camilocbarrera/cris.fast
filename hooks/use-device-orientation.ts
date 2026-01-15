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
  const lastOrientationAt = useRef(0)

  // Clamp value between -max and +max
  const clamp = useCallback((value: number, max: number) => {
    return Math.max(-max, Math.min(max, value))
  }, [])

  const getScreenAngle = useCallback(() => {
    if (typeof window === "undefined") return 0
    const screenOrientation = window.screen?.orientation
    if (screenOrientation && typeof screenOrientation.angle === "number") {
      return screenOrientation.angle
    }
    const legacyAngle = (window as Window & { orientation?: number }).orientation
    return typeof legacyAngle === "number" ? legacyAngle : 0
  }, [])

  const rotateByScreen = useCallback((x: number, y: number) => {
    const angle = getScreenAngle()

    switch (angle) {
      case 90:
        return { x: y, y: -x }
      case -90:
      case 270:
        return { x: -y, y: x }
      case 180:
        return { x: -x, y: -y }
      default:
        return { x, y }
    }
  }, [getScreenAngle])

  const setTargetTilt = useCallback((x: number, y: number) => {
    targetTilt.current.x = clamp(x * sensitivity * 40, maxTilt)
    targetTilt.current.y = clamp(y * sensitivity * 40, maxTilt)
  }, [sensitivity, maxTilt, clamp])

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
    const rotated = rotateByScreen(normalizedGamma, normalizedBeta)

    lastOrientationAt.current = performance.now()
    setTargetTilt(rotated.x, rotated.y)
  }, [rotateByScreen, setTargetTilt])

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const now = performance.now()
    if (now - lastOrientationAt.current < 200) return

    const acceleration = event.accelerationIncludingGravity || event.acceleration
    if (!acceleration) return

    const gx = acceleration.x ?? 0
    const gy = acceleration.y ?? 0
    const rotated = rotateByScreen(gx / 9.81, gy / 9.81)

    setTargetTilt(rotated.x, rotated.y)
  }, [rotateByScreen, setTargetTilt])

  // Request permission for iOS 13+
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const requestOrientationPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      "requestPermission" in DeviceOrientationEvent &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === "function"
        ? (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission
        : null

    const requestMotionPermission =
      typeof DeviceMotionEvent !== "undefined" &&
      "requestPermission" in DeviceMotionEvent &&
      typeof (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === "function"
        ? (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission
        : null

    if (!requestOrientationPermission && !requestMotionPermission) {
      setHasPermission(true)
      return true
    }

    try {
      if (requestOrientationPermission) {
        const response = await requestOrientationPermission()
        if (response === "granted") {
          setHasPermission(true)
          return true
        }
      }
      if (requestMotionPermission) {
        const response = await requestMotionPermission()
        if (response === "granted") {
          setHasPermission(true)
          return true
        }
      }
    } catch {
      setHasPermission(false)
      return false
    }

    setHasPermission(false)
    return false
  }, [])

  // Check support and setup listeners
  useEffect(() => {
    const supported = typeof window !== "undefined" && (
      "DeviceOrientationEvent" in window || "DeviceMotionEvent" in window
    )
    setIsSupported(supported)

    if (!supported) {
      setHasPermission(false)
      return
    }

    // Check if permission is needed (iOS 13+)
    const needsPermission = (
      typeof DeviceOrientationEvent !== "undefined" && "requestPermission" in DeviceOrientationEvent
    ) || (
      typeof DeviceMotionEvent !== "undefined" && "requestPermission" in DeviceMotionEvent
    )

    if (!needsPermission) {
      // Android and older iOS don't need explicit permission
      setHasPermission(true)
    }
  }, [])

  // Setup orientation listener when permission is granted
  useEffect(() => {
    if (!isSupported || hasPermission !== true) return

    isActive.current = true
    if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true })
      window.addEventListener("deviceorientationabsolute", handleOrientation, { passive: true })
    }
    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleMotion, { passive: true })
    }
    animationFrame.current = requestAnimationFrame(updatePhysics)

    return () => {
      isActive.current = false
      window.removeEventListener("deviceorientation", handleOrientation)
      window.removeEventListener("deviceorientationabsolute", handleOrientation)
      window.removeEventListener("devicemotion", handleMotion)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [isSupported, hasPermission, handleOrientation, handleMotion, updatePhysics])

  return {
    tiltX,
    tiltY,
    isSupported,
    hasPermission,
    requestPermission,
  }
}
