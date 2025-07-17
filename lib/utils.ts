function mixColors(rgbString1: string, rgbString2: string, factor = 0.5) {
    const rgbMatch1 = rgbString1.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/)
    if (!rgbMatch1) throw new Error("Invalid rgb(...) format: " + rgbString1)

    const rgbMatch2 = rgbString2.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/)
    if (!rgbMatch2) throw new Error("Invalid rgb(...) format: " + rgbString2)

    const [r1, g1, b1] = rgbMatch1.slice(1).map(Number)
    const [r2, g2, b2] = rgbMatch2.slice(1).map(Number)

    const rOut = r2 * factor + r1 * (1 - factor)
    const gOut = g2 * factor + g1 * (1 - factor)
    const bOut = b2 * factor + b1 * (1 - factor)

    return `rgb(${rOut}, ${gOut}, ${bOut})`
}

export { mixColors }
