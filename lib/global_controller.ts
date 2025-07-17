import Visualization from "./visualization"

class _GlobalController {
    items: Map<string, Visualization>
    
    time: number = 0
    reactSetTime: ((time: number) => void) | null = null

    frameCount: number = 0

    isPlaying: boolean = true
    reactSetIsPlaying: ((isPlaying: boolean) => void) | null = null

    classMask: number[] = []

    constructor() {
        this.items = new Map()
    }

    register(id: string, visualization: Visualization) {
        this.items.set(id, visualization)
    }

    unRegister(id: string) {
        this.items.delete(id)
    }

    get(id: string): Visualization | undefined {
        return this.items.get(id)
    }

    tick() {
        if (this.isPlaying && this.frameCount) {
            this.items.forEach(item => item.draw())
            this.setTime((this.time + 1) % this.frameCount)
        }
    }

    setTime(time: number) {
        this.time = time
        this.reactSetTime?.(time)

        if (!this.isPlaying) {
            this.items.forEach(item => item.draw())
        }
    }

    setIsPlaying(isPlaying: boolean) {
        this.isPlaying = isPlaying
        this.reactSetIsPlaying?.(isPlaying)
    }

    setClassMask(classMask: number[]) {
        this.classMask = classMask
        this.items.forEach(item => item.draw())
    }

    correctScaling() {
        this.items.forEach(item => {
            item.renderer?.correctScaling()
            item.draw()
        })
    }
}

const GlobalController = new _GlobalController()
export default GlobalController

// let then = Date.now()
// const fpses: number[] = []

function tick() {
    // const now = Date.now()
    // const deltaTime = now - then
    // const fps = 1000/deltaTime

    // if (fpses.length < 100)
    //     fpses.push(fps)
    // else {
    //     console.log(fpses.reduce((a, b) => a + b) / fpses.length)
    //     fpses.length = 0
    // }

    GlobalController.tick()

    // then = now
    requestAnimationFrame(tick)
}

if (typeof window !== "undefined") {
    requestAnimationFrame(tick)

    window.addEventListener('resize', () => {
        GlobalController.correctScaling()
    })
}
