// Client-side parser for .npy files
// See the specification: http://docs.scipy.org/doc/numpy-dev/neps/npy-format.html

import Variation from "./variation"

class NDArray {
    shape: number[]
    fortran_order: boolean
    data: Uint8Array |
        Int8Array |
        Uint16Array |
        Int16Array |
        Uint32Array |
        Int32Array |
        BigInt64Array |
        Float16Array |
        Float32Array |
        Float64Array

    constructor(shape: number[],
        fortran_order: boolean,
        data: Uint8Array |
            Int8Array |
            Uint16Array |
            Int16Array |
            Uint32Array |
            Int32Array |
            BigInt64Array |
            Float16Array |
            Float32Array |
            Float64Array) {
                this.shape = shape
                this.fortran_order = fortran_order
                this.data = data
            }

    /*
    at: function (...indices) {
        let i = 0
        for (let i_dim = 0 i_dim < indices.length i_dim++) {
            let i_at_dim = indices[i_dim]

            for (let i_next_dim = i_dim + 1 i_next_dim < indices.length i_next_dim++)
                i_at_dim *= this.shape[i_next_dim]

            i += i_at_dim
        }
        return this.data[i]
    }
    */

    at(a: number, b: number, c: number): number | bigint {
        return this.data[a * this.shape[1] * this.shape[2] + b * this.shape[2] + c]
    }
}

function f8ToNumber(u8: number, eBits: number = 3): number {
    const mBits = 8 - 1 - eBits
    const sMask = (1 << 8    ) - (1 << 7    )
    const eMask = (1 << 7    ) - (1 << mBits)
    const mMask = (1 << mBits) - (1 << 0    )
    const exponentBias = (1 << (eBits - 1)) - 1

    const signBit  = u8 & sMask
    const exponent = u8 & eMask
    const mantissa = u8 & mMask
    const sign = signBit ? -1 : 1

    if (exponent === 0) {
        if (mantissa === 0) {
            return sign * 0
        } else {
            const finalExponent = 1 - exponentBias
            return sign * Math.pow(2, finalExponent - mBits) * mantissa
        }
    } else if (exponent === eMask) {
        return sign * (mantissa === 0 ? Infinity : NaN)
    } else {
        const finalExponent = (exponent >> mBits) - exponentBias
        return sign * Math.pow(2, finalExponent) * (1 + mantissa / (1 << mBits))
    }
}

const NumpyLoader = (function () {
    function asciiDecode(buf: ArrayBuffer) {
        return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)))
    }

    function readUint16LE(buffer: ArrayBuffer) {
        const view = new DataView(buffer)
        let val = view.getUint8(0)
        val |= view.getUint8(1) << 8
        return val
    }

    function readF8Array(buffer: ArrayBuffer, offsetBytes: number, len: number, shape: number[], variation: Variation): Float32Array {
        const u8Buffer = new Uint8Array(buffer, offsetBytes, len)

        let counter = 0
        const out = new Float32Array(u8Buffer.length)

        u8Buffer.forEach(u8 => {
            if (variation.fpFormat != 'standard') {
                const number = f8ToNumber(u8, variation.fpFormat.eBits)
                out.set([number], counter)
                counter++
            }
        })


        if (variation.deltaEncoding) {

            const frameLen = shape[1] * shape[2] // TODO
            const cumOut = new Float32Array(u8Buffer.length)
            cumOut.set(out.slice(0, frameLen), 0)
            
            for (let frame = 1; frame < shape[0]; frame++) {
                const prevFrame = cumOut.slice((frame - 1) * frameLen, frame * frameLen)
                const delta = out.slice(frame * frameLen, (frame + 1) * frameLen)
                
                cumOut.set(prevFrame.map((v, i) => v + delta[i]), frame * frameLen)
            }
            
            return cumOut
        }

        return out
    }

    function fromArrayBuffer(buf: ArrayBuffer, variation: Variation): NDArray[] {
        let current = 0
        const out = []

        while (current < buf.byteLength) {
            // Check the magic number
            const magic = asciiDecode(buf.slice(current, current + 6))
            if (magic.slice(1, 6) != 'NUMPY') {
                throw new Error('unknown file type')
            }

            /* eslint @typescript-eslint/no-unused-vars: 0 */
            const _version = new Uint8Array(buf.slice(current + 6, current + 8)),
                headerLength = readUint16LE(buf.slice(current + 8, current + 10)),
                headerStr = asciiDecode(buf.slice(current + 10, current + 10 + headerLength))
            const offsetBytes = current + 10 + headerLength

            const info = JSON.parse(headerStr.toLowerCase().replace('(', '[').replace('),', ']').replaceAll("'", '"').replace(',]', ']'))
            const len = info.shape.reduce((a: number, b: number) => a * b)

            // Intepret the bytes according to the specified dtype
            let data
            if (info.descr === "|u1")
                data = new Uint8Array(buf, offsetBytes, len)
            else if (info.descr === "|i1")
                data = new Int8Array(buf, offsetBytes, len)
            else if (info.descr === "<u2")
                data = new Uint16Array(buf, offsetBytes, len)
            else if (info.descr === "<i2")
                data = new Int16Array(buf, offsetBytes, len)
            else if (info.descr === "<u4")
                data = new Uint32Array(buf, offsetBytes, len)
            else if (info.descr === "<i4")
                data = new Int32Array(buf, offsetBytes, len)
            else if (info.descr === "<i8")
                data = new BigInt64Array(buf, offsetBytes, len)
            else if (info.descr === "<f2")
                data = new Float16Array(buf, offsetBytes, len)
            else if (info.descr === "<f4")
                data = new Float32Array(buf, offsetBytes, len)
            else if (info.descr === "<f8")
                data = new Float64Array(buf, offsetBytes, len)
            else if (info.descr === "<v1")
                data = readF8Array(buf, offsetBytes, len, info.shape, variation)
            else
                throw new Error('unknown numeric dtype ' + info.descr)

            // current = offsetBytes + len * data.BYTES_PER_ELEMENT
            current = offsetBytes + len * parseInt(info.descr[2])
            out.push(new NDArray(info.shape, info.fortran_order, data))
        }

        return out
    }

    return {
        fromArrayBuffer: fromArrayBuffer
    }
})()

export { NumpyLoader, NDArray }
