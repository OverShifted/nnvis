import { buildColormap } from '@/lib/colormaps'
import GlobalController from '@/lib/global_controller'
import Variation from '@/lib/variation'
import Visualization from '@/lib/visualization'
import {
  Button,
  CircularProgress,
  Option,
  Select,
  Slider,
  ToggleButtonGroup,
} from '@mui/joy'
import { RefObject, useEffect, useId, useRef, useState } from 'react'

interface VisScatterBlockProps {
  variations: Variation[]
  colorMap: string
}

export default function VisScatterBlock({
  variations,
  colorMap,
}: VisScatterBlockProps) {
  const componentId = useId()

  const canvas: RefObject<HTMLCanvasElement | null> = useRef(null)
  const vis: RefObject<Visualization | null> = useRef(null)
  const prevVariations: RefObject<Variation[] | null> = useRef(null)

  const [variation, setVariation] = useState(0)
  const [channel, setChannel] = useState(0)
  // const [colorMap, setColorMap] = useState(colorMaps[0])
  const [isLoading, setIsLoading] = useState(true)
  const [renderStyle, setRenderStyle] = useState('dots')
  const [tailFalloff, setTailFalloff] = useState(10)
  const [radius, setRadius] = useState(3.5)
  const [opacity, setOpacity] = useState(100)
  const [fraction, setFraction] = useState(2000)

  /* eslint react-hooks/exhaustive-deps: 0 */
  useEffect(() => {
    vis.current = new Visualization(
      canvas.current as HTMLCanvasElement,
      setIsLoading,
      {
        channel,
        colorMap: buildColormap(colorMap),
        renderStyle,
        tailFalloff,
        radius,
        opacity,
        fraction,
      },
    )

    GlobalController.register(componentId, vis.current)

    return () => GlobalController.unRegister(componentId)
  }, [])

  useEffect(() => {
    if (prevVariations.current === variations) {
      vis.current?.setVariation(variations[variation])
    } else {
      setVariation(0)
      vis.current?.setVariation(variations[0])
      prevVariations.current = variations
    }

    setChannel(0)
    vis.current?.setChannel(0)
  }, [variations, variation])

  useEffect(() => {
    vis.current?.setColorMap(buildColormap(colorMap as string))
    vis.current?.setChannel(channel)
    vis.current?.setRenderStyle(renderStyle)
    vis.current?.setTailFalloff(tailFalloff)
    vis.current?.setRadius(radius)
    vis.current?.setOpacity(opacity)
  }, [colorMap, channel, renderStyle, tailFalloff, radius, opacity])

  const radiusResolution = 100

  return (
    <div className="vis-container mb-10 max-w-full">
      <div className="flex items-stretch justify-evenly px-2 gap-2">
        <Select
          className="grow-1"
          value={variation}
          placeholder="Variation"
          onChange={(_, value) => setVariation(value || 0)}
        >
          {variations.map((v, index) => (
            <Option value={index} key={index}>
              {v.name}
            </Option>
          ))}
        </Select>

        <Select
          className="grow-1"
          value={channel}
          placeholder="Channel"
          onChange={(_, value) => setChannel(value || 0)}
        >
          {variations[variation]?.channels.map((v, index) => (
            <Option value={index} key={index}>
              {v.name}
            </Option>
          ))}
        </Select>

        <ToggleButtonGroup
          className="grow-1"
          value={renderStyle}
          onChange={(_, value) => setRenderStyle(value || 'dots')}
          aria-label="Render style"
          size="sm"
        >
          <Button className="grow-1" value="dots">
            Dots
          </Button>
          <Button className="grow-1" value="lines-tail">
            Tails
          </Button>
          {/* <Button className="grow-1" value="dots-tail">Budget-mode Tail</Button> */}
          {/* <Button className="grow-1" value="lines-tail">Totally Accurate Tail Simulation</Button> */}
        </ToggleButtonGroup>
      </div>

      {renderStyle === 'dots-tail' ? (
        <div className="flex items-center justify-evenly -mt-1 -mb-3 pl-2.5 pr-4">
          <label className="min-w-35">Tail Falloff</label>
          <Slider
            aria-label="Tail falloff"
            value={tailFalloff}
            onChange={(_, value) => setTailFalloff(value as number)}
            max={100}
            size="sm"
          />
        </div>
      ) : (
        <></>
      )}

      <div className="flex items-center justify-evenly -mb-3 pl-2.5 pr-4">
        <label className="min-w-35">Radius</label>
        <Slider
          aria-label="Radius"
          value={radius * radiusResolution}
          onChange={(_, value) =>
            setRadius((value as number) / radiusResolution)
          }
          min={1 * radiusResolution}
          max={20 * radiusResolution}
          size="sm"
        />
      </div>

      <div className="flex items-center justify-evenly -mb-3 pl-2.5 pr-4">
        <label className="min-w-35">Opacity</label>
        <Slider
          aria-label="Opacity"
          value={opacity}
          onChange={(_, value) => setOpacity(value as number)}
          min={0}
          max={100}
          size="sm"
        />
      </div>

      {/* <div className="flex items-center justify-evenly mb-0 pl-2.5 pr-4">
                <label className="min-w-35">Fraction</label>
                <Slider aria-label="Fraction" value={fraction} onChange={(_e: object, value: number | number[]) => {
                    setFraction(value as number)
                    vis.current?.setFraction(value as number)
                }} min={0} max={2000} size="sm" />
            </div> */}

      <div className="relative mt-3">
        {isLoading ? (
          <div
            className="absolute"
            style={{ top: 'calc(50% - 20px)', left: 'calc(50% - 20px)' }}
          >
            <CircularProgress />
          </div>
        ) : null}
        <canvas
          ref={canvas}
          id="canvas"
          width="1024px"
          height="1024px"
        ></canvas>
      </div>
    </div>
  )
}
