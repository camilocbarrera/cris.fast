 "use client"
 
 import { useEffect, useRef } from "react"
 import type p5 from "p5"
 
 interface P5GyroCanvasProps {
   tiltX: number
   tiltY: number
   enabled?: boolean
   opacity?: number
 }
 
 export function P5GyroCanvas({ tiltX, tiltY, enabled = false, opacity = 0.2 }: P5GyroCanvasProps) {
   const containerRef = useRef<HTMLDivElement>(null)
   const instanceRef = useRef<p5 | null>(null)
   const tiltRef = useRef({ x: tiltX, y: tiltY })
   const enabledRef = useRef(enabled)
 
   useEffect(() => {
     tiltRef.current = { x: tiltX, y: tiltY }
   }, [tiltX, tiltY])
 
   useEffect(() => {
     enabledRef.current = enabled
   }, [enabled])
 
   useEffect(() => {
     let isMounted = true
 
     const init = async () => {
       if (!containerRef.current) return
 
       const { default: P5 } = await import("p5")
       if (!isMounted || !containerRef.current) return
 
       const sketch = (s: p5) => {
         s.setup = () => {
           s.createCanvas(containerRef.current!.clientWidth, containerRef.current!.clientHeight)
           s.noStroke()
         }
 
         s.windowResized = () => {
           if (!containerRef.current) return
           s.resizeCanvas(containerRef.current.clientWidth, containerRef.current.clientHeight)
         }
 
         s.draw = () => {
           if (!enabledRef.current) {
             s.clear()
             return
           }
 
           s.background(0, 70)
           const x = s.map(tiltRef.current.x, -1, 1, 0, s.width)
           const y = s.map(tiltRef.current.y, -1, 1, 0, s.height)
           const magnitude = Math.min(1.5, Math.hypot(tiltRef.current.x, tiltRef.current.y))
           const diameter = s.map(magnitude, 0, 1.5, 18, 120)
 
           s.fill(255)
           s.circle(x, y, diameter)
         }
       }
 
       instanceRef.current = new P5(sketch, containerRef.current)
     }
 
     init()
 
     return () => {
       isMounted = false
       instanceRef.current?.remove()
       instanceRef.current = null
     }
   }, [])
 
   return (
     <div
       ref={containerRef}
       className="fixed inset-0 z-[2] pointer-events-none"
       style={{ opacity }}
     />
   )
 }
