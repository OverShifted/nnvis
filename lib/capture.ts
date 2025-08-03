import Variation from './variation'

export default interface Capture {
  name: string
  frameCount: number

  variations: Variation[]
  classes?: { name: string; image?: string }[]
}
