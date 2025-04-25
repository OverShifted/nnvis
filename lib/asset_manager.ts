import { NumpyLoader, NDArray } from "./numpy_loader"

// Currently only handles numpy arrays
// TODO: Cleanup
const AssetManager = (() => {
    class Pending {
        xhr: XMLHttpRequest
        wishlist: object[]
        progressbars: object[]

        constructor(xhr: XMLHttpRequest, wishlist: object[], progressbars: object[]) {
            this.xhr = xhr
            this.wishlist = wishlist
            this.progressbars = progressbars
        }
    }

    class _AssetManager {
        assets: Map<string, NDArray[]>
        pending: Map<string, Pending>
        
        constructor() {
            this.assets = new Map()
            this.pending = new Map()
        }

        /* eslint @typescript-eslint/no-unused-vars: 0 */
        get(url: string, _progressbar: object | null = null): Promise<NDArray[]> {
            return new Promise((resolve, reject) => {
                if (this.assets.has(url)) {
                    resolve(this.assets.get(url) as NDArray[])
                    // if (progressbar)
                    //     this.attach_progressbar(url, progressbar)
                    return
                }

                if (this.pending.has(url)) {
                    const pending = this.pending.get(url)
                    pending?.wishlist.push({ resolve, reject })
                    // if (progressbar)
                    //     this.attach_progressbar(url, progressbar)
                    return
                }

                const xhr = new XMLHttpRequest()
                const pending = {
                    xhr,
                    wishlist: [
                        { resolve, reject }
                    ],
                    progressbars: []
                }
                this.pending.set(url, pending)

                // console.log(this.pending)

                // if (progressbar)
                //     this.attach_progressbar(url, progressbar)

                const fail = ((e: object) => {
                    pending.wishlist.forEach(wish => wish.reject(e))
                    // pending.progressbars.forEach(progressbar_fail)

                    setTimeout(() => alert("Could not load data. See console for more information."), 400)
                    console.log(e)

                    this.pending.delete(url)
                }).bind(this)

                const succeed = (() => {
                    const buf = xhr.response // not responseText
                    const ndarray = NumpyLoader.fromArrayBuffer(buf)
                    this.assets.set(url, ndarray)

                    // TODO: make sure this works
                    pending.wishlist.forEach(wish => wish.resolve(ndarray))
                    // pending.progressbars.forEach(progressbar_success)
                }).bind(this)

                xhr.addEventListener('load', e => {
                    if (e.loaded < e.total)
                        fail(e)
                    else
                        succeed()
                })

                xhr.addEventListener('error', fail)

                xhr.addEventListener('progress', e => {
                    const percentage = e.loaded * 100 / e.total
                    console.log(percentage)

                    // pending.progressbars.forEach(progressbar => progressbar.ldBar.set(percentage))
                })

                // xhr.addEventListener('loadstart', () => {
                //     // pending.progressbars.forEach(progressbar => {
                //     //     progressbar.classList.remove('done')
                //     //     progressbar.classList.remove('success')
                //     //     progressbar.classList.remove('failure')
                //     //     progressbar.ldBar.set(0, false)
                //     // })
                // })

                // xhr.addEventListener('loadend', e => {
                //     // pending.progressbars.forEach(progressbar => progressbar.classList.add('done'))
                // })

                xhr.open("GET", url, true)
                xhr.responseType = "arraybuffer"

                xhr.send(null)
            })
        }

        // attach_progressbar(_url: string, _progressbar: object) {
            // if (this.assets.has(url)) {
            //     progressbar_success(progressbar)
            // } else if (this.pending.has(url)) {
            //     // TODO: update progress right here
            //     progressbar_running(progressbar)
            //     this.pending.forEach(p =>
            //         p.progressbars = p.progressbars.filter(
            //             item => item != progressbar
            //         )
            //     )

            //     this.pending.get(url).progressbars.push(progressbar)
            // }
        // }
    }

    return new _AssetManager()
})()

export default AssetManager
