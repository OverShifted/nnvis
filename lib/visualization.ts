import AssetManager from './asset_manager'
import GlobalController from './global_controller'
import { NDArray } from './numpy_loader'
import Renderer from './renderer'
import Variation from './variation'

export default class Visualization {
  id: string

  // Pending or loaded
  variation: Variation | null = null
  canvas: HTMLCanvasElement
  renderer: Renderer | null = null

  reactSetIsLoading: (isLoading: boolean) => void
  reactSetLoadPercentage: (percentage: number) => void

  channel: number
  colorMap: string[]
  renderStyle: string
  tailFalloff: number
  radius: number
  opacity: number
  fraction: number

  colorMapWithTransparency: string[]

  constructor(
    id: string,
    canvas: HTMLCanvasElement,
    reactSetIsLoading: (isLoading: boolean) => void,
    reactSetLoadPercentage: (percentage: number) => void,
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

    this.reactSetIsLoading = reactSetIsLoading
    this.reactSetLoadPercentage = reactSetLoadPercentage

    this.channel = options.channel
    this.colorMap = options.colorMap
    this.renderStyle = options.renderStyle
    this.tailFalloff = options.tailFalloff
    this.radius = options.radius
    this.opacity = options.opacity
    this.fraction = options.fraction

    this.colorMapWithTransparency = []
    this.buildColorMapWithTransparency()
  }

  _setArray(array: NDArray[], variation: Variation) {
    this.renderer = new Renderer(array, variation, this.canvas)
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
      (percentage) => {
        this.reactSetLoadPercentage(percentage)
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

  draw(time: number = GlobalController.time) {
    this.renderer?.render(
      time,
      this.channel,
      this.radius,
      this.colorMapWithTransparency,
      this.renderStyle.endsWith('tail'),
      this.renderStyle == 'lines-tail',
      this.tailFalloff,
      GlobalController.isPlaying,
      this.fraction,
    )
  }
}
