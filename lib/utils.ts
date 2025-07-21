function parseColor(color: string): [number, number, number] {
  if (color === 'white') return [255, 255, 255]

  if (color === 'black') return [0, 0, 0]

  const rgbMatch = color.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/)
  if (!rgbMatch) throw new Error('Invalid rgb(...) format: ' + color)

  const [r, g, b] = rgbMatch.slice(1).map(Number)
  return [r, g, b]
}

function mixColors(rgbString1: string, rgbString2: string, factor = 0.5) {
  const [r1, g1, b1] = parseColor(rgbString1)
  const [r2, g2, b2] = parseColor(rgbString2)

  const rOut = r2 * factor + r1 * (1 - factor)
  const gOut = g2 * factor + g1 * (1 - factor)
  const bOut = b2 * factor + b1 * (1 - factor)

  return `rgb(${rOut}, ${gOut}, ${bOut})`
}

function linspace(start: number, stop: number, num: number) {
  if (num === 1) return [start]
  const step = (stop - start) / (num - 1)
  return Array.from({ length: num }, (_, i) => start + step * i)
}

export { mixColors, linspace }
