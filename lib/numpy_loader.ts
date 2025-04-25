// Client-side parser for .npy files
// See the specification: http://docs.scipy.org/doc/numpy-dev/neps/npy-format.html

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
            Float32Array |
            Float64Array) {
                this.shape = shape
                this.fortran_order = fortran_order
                this.data = data
            }

    // at: function (...indices) {
    //     let i = 0
    //     for (let i_dim = 0 i_dim < indices.length i_dim++) {
    //         let i_at_dim = indices[i_dim]

    //         for (let i_next_dim = i_dim + 1 i_next_dim < indices.length i_next_dim++)
    //             i_at_dim *= this.shape[i_next_dim]

    //         i += i_at_dim
    //     }
    //     return this.data[i]
    // }

    at(a: number, b: number, c: number): number | bigint {
        return this.data[a * this.shape[1] * this.shape[2] + b * this.shape[2] + c]
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

    function fromArrayBuffer(buf: ArrayBuffer): NDArray[] {
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
            else if (info.descr === "<f4")
                data = new Float32Array(buf, offsetBytes, len)
            else if (info.descr === "<f8")
                data = new Float64Array(buf, offsetBytes, len)
            else
                throw new Error('unknown numeric dtype')

            current = offsetBytes + len * data.BYTES_PER_ELEMENT
            out.push(new NDArray(info.shape, info.fortran_order, data))
        }

        return out
    }

    return {
        fromArrayBuffer: fromArrayBuffer
    }
})()

export { NumpyLoader, NDArray }
