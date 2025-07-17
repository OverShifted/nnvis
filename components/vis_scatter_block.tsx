import { buildColormap } from '@/lib/colormaps'
import GlobalController from '@/lib/global_controller'
import Variation from '@/lib/variation'
import Visualization from '@/lib/visualization'
import { Button, CircularProgress, Option, Select, Slider, ToggleButtonGroup } from '@mui/joy'
import { RefObject, useEffect, useId, useRef, useState } from 'react'

interface VisScatterBlockProps {
    variations: Variation[]
    colorMaps: string[]
    colorMap: string
}

export default function VisScatterBlock({variations, colorMaps, colorMap}: VisScatterBlockProps) {
    const componentId = useId()

    const canvas: RefObject<HTMLCanvasElement | null> = useRef(null)
    const vis: RefObject<Visualization | null> = useRef(null)

    const [variation, setVariation] = useState(0)
    const [channel, setChannel] = useState(0)
    // const [colorMap, setColorMap] = useState(colorMaps[0])
    const [isLoading, setIsLoading] = useState(true)
    const [renderStyle, setRenderStyle] = useState("dots")
    const [tailFalloff, setTailFalloff] = useState(10)
    const [radius, setRadius] = useState(2)
    const [opacity, setOpacity] = useState(100)
    const [fraction, setFraction] = useState(2000)
    
    /* eslint react-hooks/exhaustive-deps: 0 */
    useEffect(() => {
        vis.current = new Visualization(canvas.current as HTMLCanvasElement, setIsLoading, {
            channel,
            colorMap: buildColormap(colorMap),
            renderStyle,
            tailFalloff,
            radius,
            opacity,
            fraction
        })

        GlobalController.register(componentId, vis.current)

        return () => {
            GlobalController.unRegister(componentId)
        }
    }, [])

    useEffect(() => {
        if (variation >= variations.length)
            setVariation(0)

        vis.current?.setVariation(variations[variation])
    }, [variations])

    useEffect(() => {
        vis.current?.setColorMap(buildColormap(colorMap as string))
    }, [colorMap])

    return (
        <div className="vis-container mb-10 max-w-full">
            <div className="flex items-center justify-evenly px-2 gap-2">
                <Select
                    className="grow-1"
                    value={variation}
                    placeholder="Variation"
                    onChange={ (_e: object | null, value: number | null) => {
                        setVariation(value as number)
                        vis.current?.setVariation(variations[value as number])
                    }}
                    >
                    {variations.map((v, index) => <Option value={index} key={index}>{v.name}</Option>)}
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
                    {variations[variation].channels.map((v, index) => <Option value={index} key={index}>{v.name}</Option>)}
                </Select>

                {/* <Select
                    className="grow-1"
                    value={colorMap}
                    placeholder="Color map"
                    onChange={ (_e: object | null, value: string | null) => {
                        setColorMap(value as string)
                        vis.current?.setColorMap(buildColormap(value as string))
                    }}
                    >
                    {colorMaps.map(v => <Option value={v} key={v}>{v}</Option>)}
                </Select> */}
            </div>

            <div className="flex items-center justify-evenly mt-2 px-2">
                <ToggleButtonGroup
                    className="grow-1"
                    value={renderStyle}
                    onChange={(_e: object, value: string | null) => { 
                        if (value == null)
                            return

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

            <div className="flex items-center justify-evenly -mb-3 pl-2.5 pr-4">
                <label className="min-w-35">Opacity</label>
                <Slider aria-label="Opacity" value={opacity} onChange={(_e: object, value: number | number[]) => {
                    setOpacity(value as number)
                    vis.current?.setOpacity(value as number)
                }} min={0} max={100} size="sm" />
            </div>

            <div className="flex items-center justify-evenly mb-0 pl-2.5 pr-4">
                <label className="min-w-35">Fraction</label>
                <Slider aria-label="Fraction" value={fraction} onChange={(_e: object, value: number | number[]) => {
                    setFraction(value as number)
                    vis.current?.setFraction(value as number)
                }} min={0} max={2000} size="sm" />
            </div>

            <div className="relative">
                { isLoading ? <div className="absolute" style={{top: "calc(50% - 20px)", left: "calc(50% - 20px)"}}><CircularProgress /></div> : null}
                <canvas ref={canvas} id="canvas" width="1024px" height="1024px"></canvas>
            </div>
        </div>
    )
}
