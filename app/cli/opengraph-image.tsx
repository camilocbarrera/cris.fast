import { OG_ALT, OG_SIZE, renderTerminalOg } from "./og-card"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = OG_ALT

export default function Image() {
  return renderTerminalOg()
}
