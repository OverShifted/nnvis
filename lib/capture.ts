import Variation from "./variation"

export default interface Capture {
	name: string,
	frameCount: number,

	variations: Variation[],
	labels?: string[]
}
