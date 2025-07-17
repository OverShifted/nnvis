export default interface Variation {
	name: string,
	path: string,
	deltaEncoding: boolean,

	// 'standard' means to use numpy hints
	// { eBits: number } means to read as f8
	fpFormat: 'standard' | { eBits: number },

	channels: {
		name: string,
		bounds: [[number, number], [number, number]]
	}[]
}
