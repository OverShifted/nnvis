import GlobalController from './global_controller'
import { NDArray } from './numpy_loader'
import Variation from './variation'

function remap(
  x: number,
  initial_range: [number, number],
  target_range: [number, number],
) {
  const a =
    (target_range[1] - target_range[0]) / (initial_range[1] - initial_range[0])
  return a * (x - initial_range[0]) + target_range[0]
}

export default class Renderer {
  // TODO:
  array: NDArray[]
  variation: Variation
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(
    array: NDArray[],
    variation: Variation,
    canvas: HTMLCanvasElement,
  ) {
    this.array = array
    this.variation = variation
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.correctScaling()
  }

  // setArray(array: NDArray[], variation: Variation) {
  //     this.array = array
  //     this.variation = variation
  // }

  render(
    frame: number,
    channel_id: number,
    radius: number,
    colormap: string[],
    tailMode: boolean,
    taTailMode: boolean,
    tailFalloff: number,
    isPlaying: boolean,
    _fraction: number,
  ) {
    if (!(tailMode && frame != 0)) this.clear()

    const array = this.array[channel_id]
    const [xBounds, yBounds] = this.variation.channels[channel_id].bounds

    if (tailMode && isPlaying) {
      this.ctx.beginPath()
      this.ctx.rect(
        0,
        0,
        this.canvas.width / window.devicePixelRatio,
        this.canvas.height / window.devicePixelRatio,
      )

      this.ctx.fillStyle = `rgb(255, 255, 255, ${tailFalloff}%)`
      this.ctx.fill()
    }

    if (!tailMode)
      for (let i = 0; i < array.shape[1]; i++) {
        const x = remap(array.at(frame, i, 0) as number, xBounds, [0, 1])
        const y = remap(array.at(frame, i, 1) as number, yBounds, [0, 1])

        const colorid = this.array[this.array.length - 1].data[i] as number
        const mask = GlobalController.classMask[colorid]

        if (mask === undefined || mask > 0.5)
          this._drawCircle(x, y, radius, colormap[colorid])
        else
          this._drawCircle(
            x,
            y,
            radius,
            colormap[colorid].replace(
              /(,\s*\d*%)?\)/g,
              `,${1000 / array.shape[1]}%)`,
            ),
          )
      }
    else
      for (let i = 0; i < array.shape[1]; i++) {
        const ax = remap(array.at(frame - 1, i, 0) as number, xBounds, [0, 1])
        const ay = remap(array.at(frame - 1, i, 1) as number, yBounds, [0, 1])

        const bx = remap(array.at(frame, i, 0) as number, xBounds, [0, 1])
        const by = remap(array.at(frame, i, 1) as number, yBounds, [0, 1])
        const colorid = this.array[this.array.length - 1].data[i] as number

        this._drawLine([ax, ay], [bx, by], radius * 2, colormap[colorid])

        if (taTailMode) this._drawCircle(bx, by, radius, colormap[colorid])
      }
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width / window.devicePixelRatio,
      this.canvas.height / window.devicePixelRatio,
    )
  }

  _drawCircle(centerX: number, centerY: number, radius: number, color: string) {
    this.ctx.beginPath()
    this.ctx.arc(
      Math.floor((centerX * this.canvas.width) / window.devicePixelRatio),
      Math.floor((centerY * this.canvas.height) / window.devicePixelRatio),
      radius,
      0,
      2 * Math.PI,
      false,
    )
    this.ctx.fillStyle = color
    this.ctx.fill()
  }

  _drawLine(
    a: [number, number],
    b: [number, number],
    width: number,
    color: string,
  ) {
    this.ctx.beginPath()
    this.ctx.moveTo(
      Math.floor((a[0] * this.canvas.width) / window.devicePixelRatio),
      Math.floor((a[1] * this.canvas.height) / window.devicePixelRatio),
    )
    this.ctx.lineTo(
      Math.floor((b[0] * this.canvas.width) / window.devicePixelRatio),
      Math.floor((b[1] * this.canvas.height) / window.devicePixelRatio),
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
