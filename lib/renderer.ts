import { NDArray } from "./numpy_loader"

function remap(x: number, initial_range: number[], target_range: number[]) {
    const a = (target_range[1] - target_range[0]) / (initial_range[1] - initial_range[0])
    return a * (x - initial_range[0]) + target_range[0]
}

export default class Renderer {
    // TODO:
    array: NDArray[]
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    metadata: { name: string, channels: { name: string, x_range: [number, number], y_range: [number, number] }[] }

    constructor(array: NDArray[], canvas: HTMLCanvasElement) {
        this.array = array
        this.canvas = canvas
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        // TODO:
        this.metadata = {"name": "MNIST", "channels": [{"name": "fc1", "x_range": [-21.10204291343689, 27.388420820236206], "y_range": [-16.948265075683594, 29.670066833496094]}, {"name": "fc2", "x_range": [-10.025067269802094, 26.49038714170456], "y_range": [-12.41721260547638, 22.373779892921448]}]}

        this.correctScaling()
    }

    render(frame: number, channel_id: number, radius: number, colormap: string[], tailMode: boolean, taTailMode: boolean, tailFalloff: number, isPlaying: boolean) {
        if (!(tailMode && frame != 0))
            this.clear()

        const channel_array = this.array[channel_id]
        const { x_range, y_range } = this.metadata.channels[channel_id]
        // let { x_range, y_range } = { x_range: [-30, 30], y_range: [-30, 30] }

        if (tailMode && isPlaying) {
            this.ctx.beginPath()
            this.ctx.rect(0, 0, this.canvas.width / window.devicePixelRatio,
                this.canvas.height / window.devicePixelRatio)
            
            this.ctx.fillStyle = `rgb(255, 255, 255, ${tailFalloff}%)`
            this.ctx.fill()
        }

        if (!tailMode)
            for (let i = 0; i < channel_array.shape[1]; i++) {
                const x = remap(channel_array.at(frame, i, 0) as number, x_range, [0, 1])
                const y = remap(channel_array.at(frame, i, 1) as number, y_range, [0, 1])
                const colorid = this.array[this.array.length - 1].data[i] as number
        
                this.drawCircle(x, y, radius, colormap[colorid])
            }
        else
            for (let i = 0; i < channel_array.shape[1]; i++) {
                
                const ax = remap(channel_array.at(frame - 1, i, 0) as number, x_range, [0, 1])
                const ay = remap(channel_array.at(frame - 1, i, 1) as number, y_range, [0, 1])

                const bx = remap(channel_array.at(frame, i, 0) as number, x_range, [0, 1])
                const by = remap(channel_array.at(frame, i, 1) as number, y_range, [0, 1])
                const colorid = this.array[this.array.length - 1].data[i] as number
        
                this.drawLine([ax, ay], [bx, by], radius * 2, colormap[colorid])

                if (taTailMode)
                    this.drawCircle(bx, by, radius, colormap[colorid])
            }
    }

    clear() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width / window.devicePixelRatio,
            this.canvas.height / window.devicePixelRatio
        )
    }

    drawCircle(centerX: number, centerY: number, radius: number, color: string) {
        this.ctx.beginPath()
        this.ctx.arc(
            Math.floor(centerX * this.canvas.width / window.devicePixelRatio),
            Math.floor(centerY * this.canvas.height / window.devicePixelRatio),
            radius,
            0,
            2 * Math.PI,
            false
        )
        this.ctx.fillStyle = color
        this.ctx.fill()
    }

    drawLine(a: [number, number], b: [number, number], width: number, color: string) {
        this.ctx.beginPath()
        this.ctx.moveTo(
            Math.floor(a[0] * this.canvas.width / window.devicePixelRatio),
            Math.floor(a[1] * this.canvas.height / window.devicePixelRatio),
        )
        this.ctx.lineTo(
            Math.floor(b[0] * this.canvas.width / window.devicePixelRatio),
            Math.floor(b[1] * this.canvas.height / window.devicePixelRatio),
        )
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = width
        this.ctx.stroke()
    }

    correctScaling() {
        this.canvas.width = 512 * window.devicePixelRatio
        this.canvas.height = 512 * window.devicePixelRatio

        this.ctx.resetTransform()
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
}
