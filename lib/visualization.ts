import AssetManager from "./asset_manager"
import GlobalController from "./global_controller"
import { NDArray } from "./numpy_loader"
import Renderer from "./renderer"

export default class Visualization {
    array: NDArray[] | null
    canvas: HTMLCanvasElement
    renderer: Renderer | null
    
    reactSetIsLoading: (isLoading: boolean) => void

    channel: number
    colorMap: string[]
    renderStyle: string
    tailFalloff: number
    radius: number
    opacity: number

    colorMapWithTransparency: string[]

    constructor(canvas: HTMLCanvasElement, reactSetIsLoading: (isLoading: boolean) => void, options: {
        channel: number,
        colorMap: string[],
        renderStyle: string,
        tailFalloff: number,
        radius: number,
        opacity: number
    }) {
        this.array = null
        this.renderer = null
        this.canvas = canvas
        
        this.reactSetIsLoading = reactSetIsLoading

        this.channel = options.channel
        this.colorMap = options.colorMap
        this.renderStyle = options.renderStyle
        this.tailFalloff = options.tailFalloff
        this.radius = options.radius
        this.opacity = options.opacity

        this.colorMapWithTransparency = []
        this.buildColorMapWithTransparency()
    }
    
    setArray(array: NDArray[]) {
        this.array = array
        this.renderer = new Renderer(array, this.canvas)
        this.draw()
    }

    setSmoothing(smoothing: string) {
        this.reactSetIsLoading(true)
        this.renderer?.clear()
        this.renderer = null

        // TODO: Ignore resolvation of old promises
        AssetManager.get(smoothing).then(ndas => {
            this.setArray(ndas)
        }).finally(() => {
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

    buildColorMapWithTransparency() {
        this.colorMapWithTransparency = this.colorMap.map(color => color.replace("rgb", "rgba").replace(")", `,${this.opacity}%)`))
    }

    draw(time: number = GlobalController.time) {
        this.renderer?.render(
            time, this.channel, this.radius,
            this.colorMapWithTransparency,
            this.renderStyle.endsWith("tail"),
            this.renderStyle == "lines-tail",
            this.tailFalloff, GlobalController.isPlaying)
    }
}
