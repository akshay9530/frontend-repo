// imageHelpers.js
// Put this file next to Home.jsx (same directory) and keep the import path './imageHelpers'

const PLACEHOLDER_BASE = 'https://via.placeholder.com'

export function isHttpUrl(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  // allow protocol-relative URLs like //example.com/image.jpg
  if (trimmed.startsWith('//')) return true
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (e) {
    return false
  }
}

// Returns a URL safe to pass to <img src> or CSS background-image
// - If value is a http(s) or protocol-relative URL, returns it (protocol-relative kept as-is).
// - If value looks like a 6-digit hex color (e.g. "#FFFFFF" or "FFFFFF"), returns an inline SVG data URL.
// - Otherwise returns a via.placeholder.com fallback.
export function safeImageUrl(value, { placeholderText = 'Image+not+available', width = 1200, height = 800 } = {}) {
  const asString = (value ?? '').toString().trim()
  if (!asString) {
    return `${PLACEHOLDER_BASE}/${width}x${height}?text=${placeholderText}`
  }

  // protocol-relative URL (//domain/...)
  if (asString.startsWith('//')) {
    return asString
  }

  if (isHttpUrl(asString)) {
    return asString
  }

  // If it's a 6-digit hex color, return a small SVG as a data URI
  const hex = asString.replace(/^#/, '')
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const text = decodeURIComponent(placeholderText).replace(/\+/g, ' ')
    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
        `<rect width="100%" height="100%" fill="#${hex}"/>` +
        `<text x="50%" y="50%" font-size="28" fill="#000" dominant-baseline="middle" text-anchor="middle">${text}</text>` +
      `</svg>`
    )
    return `data:image/svg+xml;charset=utf-8,${svg}`
  }

  // final fallback
  return `${PLACEHOLDER_BASE}/${width}x${height}?text=${placeholderText}`
}