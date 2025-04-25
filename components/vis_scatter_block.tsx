import { buildColormap } from '@/lib/colormaps'
import GlobalController from '@/lib/global_controller'
import Visualization from '@/lib/visualization'
import { Button, CircularProgress, Option, Select, Slider, ToggleButtonGroup } from '@mui/joy'
import { RefObject, useEffect, useId, useRef, useState } from 'react'

interface VisScatterBlockProps {
    smoothnessOptions: Map<string, string>
    channels: string[]
    colorMaps: string[]
}

export default function VisScatterBlock({smoothnessOptions, channels, colorMaps}: VisScatterBlockProps) {
    const componentId = useId()

    const canvas: RefObject<HTMLCanvasElement | null> = useRef(null)
    const vis: RefObject<Visualization | null> = useRef(null)

    const [smoothing, setSmoothing] = useState(smoothnessOptions.keys().next().value as string)
    const [channel, setChannel] = useState(0)
    const [colorMap, setColorMap] = useState(colorMaps[0])
    const [isLoading, setIsLoading] = useState(true)
    const [renderStyle, setRenderStyle] = useState("dots")
    const [tailFalloff, setTailFalloff] = useState(10)
    const [radius, setRadius] = useState(5)
    const [opacity, setOpacity] = useState(100)
    
    /* eslint react-hooks/exhaustive-deps: 0 */
    useEffect(() => {
        vis.current = new Visualization(canvas.current as HTMLCanvasElement, setIsLoading, {
            channel,
            colorMap: buildColormap(colorMap),
            renderStyle,
            tailFalloff,
            radius,
            opacity
        })

        GlobalController.register(componentId, vis.current)
        vis.current?.setSmoothing(smoothnessOptions.get(smoothing) as string)

        return () => {
            GlobalController.unRegister(componentId)
        }
    }, [])

    return (
        <div className="vis-container mb-10 max-w-full">
            <div className="flex items-center justify-evenly px-2 gap-2">
                <Select
                    className="grow-1"
                    value={smoothing}
                    placeholder="Smoothing"
                    onChange={ (_e: object | null, value: string | null) => {
                        setSmoothing(value as string)
                        vis.current?.setSmoothing(smoothnessOptions.get(value as string) as string)
                    }}
                    >
                    {smoothnessOptions.keys().map((v, index) => <Option value={v} key={index}>{v}</Option>).toArray()}
                </Select>

                <Select
                    className="grow-1"
                    value={channel}
                    placeholder="Channel"
                    onChange={ (_e: object | null, value: number | null) => {
                        setChannel(value as number)
                        vis.current?.setChannel(value as number)
                    }}
                    >
                    {channels.map((v, index) => <Option value={index} key={index}>{v}</Option>)}
                </Select>

                <Select
                    className="grow-1"
                    value={colorMap}
                    placeholder="Color map"
                    onChange={ (_e: object | null, value: string | null) => {
                        setColorMap(value as string)
                        vis.current?.setColorMap(buildColormap(value as string))
                    }}
                    >
                    {colorMaps.map(v => <Option value={v} key={v}>{v}</Option>)}
                </Select>
            </div>

            <div className="flex items-center justify-evenly mt-2 px-2">
                <ToggleButtonGroup
                    className="grow-1"
                    value={renderStyle}
                    onChange={(_e: object, value: string | null) => { 
                        setRenderStyle(value as string)
                        vis.current?.setRenderStyle(value as string)
                    }}
                    aria-label="Render style"
                    size="sm"
                    >
                    <Button className="grow-1" value="dots">Dots</Button>
                    <Button className="grow-1" value="dots-tail">Budget-mode Tail</Button>
                    <Button className="grow-1" value="lines-tail">Totally Accurate Tail Simulation</Button>
                </ToggleButtonGroup>

            </div>

            <div className="flex items-center justify-evenly -mt-1 -mb-3 pl-2.5 pr-4">
                <label className="min-w-35">Tail Falloff</label>
                <Slider aria-label="Tail falloff" value={tailFalloff} onChange={(_e: object | null, value: number | number[]) => {
                    setTailFalloff(value as number)
                    vis.current?.setTailFalloff(value as number)
                }} max={100} size="sm" />
            </div>

            <div className="flex items-center justify-evenly -mb-3 pl-2.5 pr-4">
                <label className="min-w-35">Radius</label>
                <Slider aria-label="Radius" value={radius} onChange={(_e: object, value: number | number[]) => {
                    setRadius(value as number)
                    vis.current?.setRadius(value as number)
                }} min={1} max={20} marks valueLabelDisplay="auto" size="sm" />
            </div>

            <div className="flex items-center justify-evenly mb-0 pl-2.5 pr-4">
                <label className="min-w-35">Opacity</label>
                <Slider aria-label="Opacity" value={opacity} onChange={(_e: object, value: number | number[]) => {
                    setOpacity(value as number)
                    vis.current?.setOpacity(value as number)
                }} min={0} max={100} size="sm" />
            </div>

            <div className="relative">
                { isLoading ? <div className="absolute" style={{top: "calc(50% - 20px)", left: "calc(50% - 20px)"}}><CircularProgress /></div> : null}
                <canvas ref={canvas} id="canvas" width="1024px" height="1024px"></canvas>
            </div>
        </div>
    )
}
