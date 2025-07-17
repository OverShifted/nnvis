import Capture from "./capture"

const captures: Capture[] = [
	{
		name: "Fasion MNIST",
		frameCount: 1850,
		variations: [
			{
				name: '0.1',
				path: '/embeddings/embedding-smoothed-mini-0.1.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-5.797, 17.828], [-5.301, 11.278] ] },
					{ name: 'fc1', bounds: [ [-5.797, 17.828], [-5.301, 11.278] ] },
				]
			},
			{
				name: '0.2',
				path: '/embeddings/embedding-smoothed-mini-0.2.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-5.797, 17.828], [-5.301, 11.278] ] },
					{ name: 'fc1', bounds: [ [-5.797, 17.828], [-5.301, 11.278] ] },
				]
			},
		],
		labels: ['T-shirt/top',
			'Trouser',
			'Pullover',
			'Dress',
			'Coat',
			'Sandal',
			'Shirt',
			'Sneaker',
			'Bag',
			'Ankle boot']
	},
	{
		name: "Deep MNIST",
		frameCount: 363,
		variations: [
			{
				name: '50-0.1-f8e4 (2.9M)',
				path: '/embeddings/embedding-smoothed-50-0.1-float8_e4m3.np',
				deltaEncoding: false,
				fpFormat: { eBits: 4 },
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '50-0.1-f8e4d (2.9M)',
				path: '/embeddings/embedding-smoothed-50-0.1-float8_e4m3-delta.np',
				deltaEncoding: true,
				fpFormat: { eBits: 4 },
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '50-0.1-f16 (5.8M)',
				path: '/embeddings/embedding-smoothed-50-0.1-fp16.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '50-0.1-f32 (12M)',
				path: '/embeddings/embedding-smoothed-50-0.1.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '50-0.2-f8d (2.9M)',
				path: '/embeddings/embedding-smoothed-50-0.2-float8_e3m4-delta.np',
				deltaEncoding: true,
				fpFormat: { eBits: 3 },
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '50-0.2',
				path: '/embeddings/embedding-smoothed-50-0.2.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '100-0.1',
				path: '/embeddings/embedding-smoothed-100-0.1.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '100-0.2',
				path: '/embeddings/embedding-smoothed-100-0.2.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '200-0.1',
				path: '/embeddings/embedding-smoothed-200-0.1.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			},
			{
				name: '200-0.2',
				path: '/embeddings/embedding-smoothed-200-0.2.np',
				deltaEncoding: false,
				fpFormat: 'standard',
				channels: [
					{ name: 'fc0', bounds: [ [-8, 20], [-12, 18] ] },
					{ name: 'fc1', bounds: [ [-10, 25], [-10, 20] ] },
				]
			}
		],
		labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x.toString())
	}
]

export default captures