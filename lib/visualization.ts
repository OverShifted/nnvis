import AssetManager from './asset_manager'
import { Controller } from './controller'
import { NDArray } from './numpy_loader'
import Renderer from './renderer'
import { distanceSquared, lerpSample, readablizeBytes, remap } from './utils'
import Variation from './variation'

interface MouseCollision {
  sampleIdx: number
  sampleX: number
  sampleY: number

  mouseX: number
  mouseY: number
}

class Visualization {
  id: string

  // Pending or loaded
  variation: Variation | null = null
  canvas: HTMLCanvasElement
  renderer: Renderer | null = null
  controller: Controller

  reactSetIsLoading: (_isLoading: boolean) => void
  reactSetLoadIndicator: ({
    txt,
    percentage,
  }: {
    txt: string
    percentage: number
  }) => void
  reactSetMouseCollision: (_collision: MouseCollision | null) => void

  channel: number
  colorMap: string[]
  renderStyle: string
  tailFalloff: number
  radius: number
  opacity: number
  fraction: number

  colorMapWithTransparency: string[]

  hoveredSampleIdx: number | null = null

  mouseMoveListener: (_e: MouseEvent) => void
  mouseLeaveListener: (_e: MouseEvent) => void

  constructor(
    id: string,
    canvas: HTMLCanvasElement,
    controller: Controller,
    reactSetIsLoading: (_isLoading: boolean) => void,
    reactSetLoadIndicator: ({
      txt,
      percentage,
    }: {
      txt: string
      percentage: number
    }) => void,
    reactSetMouseCollision: (_collision: MouseCollision | null) => void,
    options: {
      channel: number
      colorMap: string[]
      renderStyle: string
      tailFalloff: number
      radius: number
      opacity: number
      fraction: number
    },
  ) {
    this.id = id
    this.canvas = canvas
    this.controller = controller

    this.reactSetIsLoading = reactSetIsLoading
    this.reactSetLoadIndicator = reactSetLoadIndicator
    this.reactSetMouseCollision = reactSetMouseCollision

    this.channel = options.channel
    this.colorMap = options.colorMap
    this.renderStyle = options.renderStyle
    this.tailFalloff = options.tailFalloff
    this.radius = options.radius
    this.opacity = options.opacity
    this.fraction = options.fraction

    this.colorMapWithTransparency = []
    this.buildColorMapWithTransparency()

    this.mouseMoveListener = (event) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const collision = this.getHoveredSample(x, y)
      this.hoveredSampleIdx = collision?.sampleIdx ?? null
      this.draw()

      reactSetMouseCollision(collision)
    }

    this.mouseLeaveListener = (_) => {
      this.hoveredSampleIdx = null
      this.draw()

      reactSetMouseCollision(null)
    }

    this.canvas.addEventListener(
      Visualization._pointerMove,
      this.mouseMoveListener,
    )

    this.canvas.addEventListener(
      Visualization._pointerLeave,
      this.mouseLeaveListener,
    )
  }

  shutdown() {
    this.canvas.removeEventListener(
      Visualization._pointerMove,
      this.mouseMoveListener,
    )

    this.canvas.removeEventListener(
      Visualization._pointerLeave,
      this.mouseLeaveListener,
    )
  }

  static get _pointerMove() {
    return window.PointerEvent ? 'pointermove' : 'mousemove'
  }

  static get _pointerLeave() {
    return window.PointerEvent ? 'pointerleave' : 'mouseleave'
  }

  _setArray(array: NDArray[], variation: Variation) {
    this.renderer = new Renderer(array, variation, this.canvas, this.controller)
    this.variation = variation
    this.draw()
  }

  setVariation(variation: Variation, basePath: string) {
    this.renderer?.clear()
    this.renderer = null

    AssetManager.get(
      this.id,
      variation,
      basePath,
      () => {
        this.reactSetIsLoading(true)
      },
      (e) => {
        const percentage = e.lengthComputable ? (e.loaded * 100) / e.total : -1
        this.reactSetLoadIndicator({
          txt:
            percentage >= 0
              ? `${percentage.toFixed(0)}%`
              : readablizeBytes(e.loaded),
          percentage,
        })
      },
    )
      .then((ndArrays) => {
        this._setArray(ndArrays, variation)
      })
      .finally(() => {
        this.reactSetIsLoading(false)
      })
  }

  setChannel(channel: number) {
    this.channel = channel
    this.draw()
  }

  setColorMap(colorMap: string[]) {
    this.colorMap = colorMap
    this.buildColorMapWithTransparency()
    this.draw()
  }

  setRenderStyle(renderStyle: string) {
    this.renderStyle = renderStyle
    this.draw()
  }

  setTailFalloff(tailFalloff: number) {
    this.tailFalloff = tailFalloff
    this.draw()
  }

  setRadius(radius: number) {
    this.radius = radius
    this.draw()
  }

  setOpacity(opacity: number) {
    this.opacity = opacity
    this.buildColorMapWithTransparency()
    this.draw()
  }

  setFraction(fraction: number) {
    this.fraction = fraction
    this.draw()
  }

  buildColorMapWithTransparency() {
    this.colorMapWithTransparency = this.colorMap.map((color) =>
      color.replace('rgb', 'rgba').replace(')', `,${this.opacity}%)`),
    )
  }

  draw(time: number = this.controller.time) {
    this.renderer?.render(
      time,
      this.channel,
      this.radius,
      this.colorMapWithTransparency,
      this.renderStyle.endsWith('tail'),
      this.renderStyle == 'lines-tail',
      this.tailFalloff,
      this.controller.isPlaying,
      this.fraction,
      this.controller.capture?.hasXPreview ? this.hoveredSampleIdx : null,
    )
  }

  getHoveredSample(mouseX: number, mouseY: number): MouseCollision | null {
    const array = this.renderer?.array[this.channel]
    if (!array || !this.variation) return null

    const [xBounds, yBounds] = this.variation.channels[this.channel].bounds
    const radius2 = Math.pow(this.radius, 2)
    const closest = {
      distance2: Infinity,
      sampleIdx: 0,
      sampleX: 0,
      sampleY: 0,

      mouseX: mouseX,
      mouseY: mouseY,
    }

    for (let i = array.shape[1] - 1; i >= 0; i--) {
      const x = remap(
        lerpSample(array, this.controller.time, i, 0) as number,
        xBounds,
        [0, this.canvas.getBoundingClientRect().width],
      )
      const y = remap(
        lerpSample(array, this.controller.time, i, 1) as number,
        yBounds,
        [0, this.canvas.getBoundingClientRect().height],
      )

      const distance2 = distanceSquared(x, y, mouseX, mouseY)

      if (distance2 <= radius2)
        return {
          sampleIdx: i,
          sampleX: x,
          sampleY: y,

          mouseX: mouseX,
          mouseY: mouseY,
        }

      if (distance2 < closest.distance2) {
        closest.distance2 = distance2

        closest.sampleIdx = i
        closest.sampleX = x
        closest.sampleY = y
      }
    }

    if (closest.distance2 < radius2 * Math.pow(7, 2)) return closest

    return null
  }
}

export { Visualization }
export type { MouseCollision }
