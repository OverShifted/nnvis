import Capture from './capture'
import capturesJson from './captures.json'

const captures: Capture[] = capturesJson as Capture[]

// console.log(capturesFromJson)

// prettier-ignore
// const capturesOld: Capture[] = [
// 	{
// 		name: 'Fashion MNIST alt',
// 		frameCount: 1354,
// 		variations: [
// 			{
// 				name: "bw0.1-f16",
// 				path: "/embeddings/fashion-mnist/data-0.np",
// 				fpFormat: "standard",
// 				deltaEncoded: false,
// 				channels: [
// 					{ name: "fc1", bounds: [[-9.508203125, 18.105859375], [-8.665234374999999, 13.051953124999999]] },
// 					{ name: "fc2", bounds: [[-8.038281249999999, 15.296093749999999], [-12.704687499999999, 22.9390625]] }
// 				]
// 			},

// 			{
// 				name: "bw0.1-f8",
// 				path: "/embeddings/fashion-mnist/data-1.np",
// 				fpFormat: { eBits: 4 },
// 				deltaEncoded: false,
// 				channels: [
// 					{ name: "fc1", bounds: [[-9.508203125, 18.105859375], [-8.665234374999999, 13.051953124999999]] },
// 					{ name: "fc2", bounds: [[-8.038281249999999, 15.296093749999999], [-12.704687499999999, 22.9390625]] }
// 				]
// 			},

// 			{
// 				name: "bw0.1-f8d",
// 				path: "/embeddings/fashion-mnist/data-2.np",
// 				fpFormat: { eBits: 4 },
// 				deltaEncoded: true,
// 				channels: [
// 					{ name: "fc1", bounds: [[-9.508203125, 18.105859375], [-8.665234374999999, 13.051953124999999]] },
// 					{ name: "fc2", bounds: [[-8.038281249999999, 15.296093749999999], [-12.704687499999999, 22.9390625]] }
// 				]
// 			}
// 		],
// 		labels: [
// 			{ name: 'T-shirt/top', image: '/images/fashion-mnist/0.png' },
// 			{ name: 'Trouser', image: '/images/fashion-mnist/1.png' },
// 			{ name: 'Pullover', image: '/images/fashion-mnist/2.png' },
// 			{ name: 'Dress', image: '/images/fashion-mnist/3.png' },
// 			{ name: 'Coat', image: '/images/fashion-mnist/4.png' },
// 			{ name: 'Sandal', image: '/images/fashion-mnist/5.png' },
// 			{ name: 'Shirt', image: '/images/fashion-mnist/6.png' },
// 			{ name: 'Sneaker', image: '/images/fashion-mnist/7.png' },
// 			{ name: 'Bag', image: '/images/fashion-mnist/8.png' },
// 			{ name: 'Ankle boot', image: '/images/fashion-mnist/9.png' },
// 		]
// 	},
// 	{
// 		name: 'Fashion MNIST',
// 		frameCount: 1850,
// 		variations: [
// 			{
// 				name: '0.1',
// 				path: '/embeddings/embedding-smoothed-mini-0.1.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-5.797, 17.828], [-5.301, 11.278]] },
// 					{ name: 'fc1', bounds: [[-5.797, 17.828], [-5.301, 11.278]] },
// 				]
// 			},
// 			{
// 				name: '0.2',
// 				path: '/embeddings/embedding-smoothed-mini-0.2.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-5.797, 17.828], [-5.301, 11.278]] },
// 					{ name: 'fc1', bounds: [[-5.797, 17.828], [-5.301, 11.278]] },
// 				]
// 			},
// 		],
// 		labels: [
// 			{ name: 'T-shirt/top', image: '/images/fashion-mnist/0.png' },
// 			{ name: 'Trouser', image: '/images/fashion-mnist/1.png' },
// 			{ name: 'Pullover', image: '/images/fashion-mnist/2.png' },
// 			{ name: 'Dress', image: '/images/fashion-mnist/3.png' },
// 			{ name: 'Coat', image: '/images/fashion-mnist/4.png' },
// 			{ name: 'Sandal', image: '/images/fashion-mnist/5.png' },
// 			{ name: 'Shirt', image: '/images/fashion-mnist/6.png' },
// 			{ name: 'Sneaker', image: '/images/fashion-mnist/7.png' },
// 			{ name: 'Bag', image: '/images/fashion-mnist/8.png' },
// 			{ name: 'Ankle boot', image: '/images/fashion-mnist/9.png' },
// 		]
// 	},
// 	{
// 		name: 'Deep MNIST',
// 		frameCount: 363,
// 		variations: [
// 			{
// 				name: '50-0.1-f8e4 (2.9M)',
// 				path: '/embeddings/embedding-smoothed-50-0.1-float8_e4m3.np',
// 				deltaEncoded: false,
// 				fpFormat: { eBits: 4 },
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '50-0.1-f8e4d (2.9M)',
// 				path: '/embeddings/embedding-smoothed-50-0.1-float8_e4m3-delta.np',
// 				deltaEncoded: true,
// 				fpFormat: { eBits: 4 },
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '50-0.1-f16 (5.8M)',
// 				path: '/embeddings/embedding-smoothed-50-0.1-fp16.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '50-0.1-f32 (12M)',
// 				path: '/embeddings/embedding-smoothed-50-0.1.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '50-0.2-f8d (2.9M)',
// 				path: '/embeddings/embedding-smoothed-50-0.2-float8_e3m4-delta.np',
// 				deltaEncoded: true,
// 				fpFormat: { eBits: 3 },
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '50-0.2',
// 				path: '/embeddings/embedding-smoothed-50-0.2.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '100-0.1',
// 				path: '/embeddings/embedding-smoothed-100-0.1.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '100-0.2',
// 				path: '/embeddings/embedding-smoothed-100-0.2.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '200-0.1',
// 				path: '/embeddings/embedding-smoothed-200-0.1.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			},
// 			{
// 				name: '200-0.2',
// 				path: '/embeddings/embedding-smoothed-200-0.2.np',
// 				deltaEncoded: false,
// 				fpFormat: 'standard',
// 				channels: [
// 					{ name: 'fc0', bounds: [[-8, 20], [-12, 18]] },
// 					{ name: 'fc1', bounds: [[-10, 25], [-10, 20]] },
// 				]
// 			}
// 		],
// 		labels: [
// 			{ name: '0', image: '/images/mnist/0.png' },
// 			{ name: '1', image: '/images/mnist/1.png' },
// 			{ name: '2', image: '/images/mnist/2.png' },
// 			{ name: '3', image: '/images/mnist/3.png' },
// 			{ name: '4', image: '/images/mnist/4.png' },
// 			{ name: '5', image: '/images/mnist/5.png' },
// 			{ name: '6', image: '/images/mnist/6.png' },
// 			{ name: '7', image: '/images/mnist/7.png' },
// 			{ name: '8', image: '/images/mnist/8.png' },
// 			{ name: '9', image: '/images/mnist/9.png' },
// 		]
// 	}
// ]

export default captures
