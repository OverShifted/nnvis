import { buildColormap } from '@/lib/colormaps'
import GlobalController from '@/lib/global_controller'
import { mixColors } from '@/lib/utils'
import { Chip, Tooltip } from '@mui/joy'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ClassChipsProps {
  labels: string[]
  colorMap: string
}

export default function ClassChips({ labels, colorMap }: ClassChipsProps) {
  const [classMask, setClassMask] = useState([] as number[])

  useEffect(() => {
    GlobalController.setClassMask(classMask)
  }, [classMask])

  useEffect(() => {
    setClassMask(new Array(labels.length).fill(1))
  }, [labels])

  return labels.map((label, index) => (
    <Tooltip
      key={index}
      variant="plain"
      arrow
      title={
        <Image
          style={{
            imageRendering: 'pixelated',
            // filter: 'invert()'
          }}
          width={150}
          height={100}
          src={`/images/fasion-mnist-${index}.png`}
          alt=""
        />
      }
      sx={(theme) => ({
        background: 'black',
        padding: 4,
        filter: theme.palette.mode === 'dark' ? 'invert()' : '',
        '.MuiTooltip-arrow': {
          '--joy-palette-background-surface': 'black',
        },
      })}
      onOpen={() =>
        setClassMask(
          Array.from({ length: 10 }, (_, i) => (i === index ? 1 : 0)),
        )
      }
      onClose={() => setClassMask(new Array(classMask.length).fill(1))}
    >
      <div
      // onMouseOver={() => setClassMask(Array.from({ length: 10 }, (_, i) => i === index ? 1 : 0))}
      // onMouseOut={() => setClassMask(classMask.fill(1))}
      >
        <Chip
          key={index}
          size="lg"
          sx={(theme) => {
            const color = buildColormap(colorMap)[index]
            const light = theme.palette.mode == 'light'
            const white = 'rgb(255,255,255)'
            const black = 'rgb(0,0,0)'

            const bg = light ? white : black
            const fg = light ? black : white
            const mix = (other: string, factor: number) =>
              mixColors(color, other, factor)

            return {
              /// Pastel:
              backgroundColor: mix(bg, 0.5),
              color: mix(fg, 0.6),

              /// Realistic:
              // backgroundColor: mix(fg, 0.2),
              // color: mix(bg, 0.85),

              borderColor: mix(fg, 0.2),
              cursor: 'default',
              // filter: classMask[index] ? "" : "grayscale()"
              opacity: classMask[index] ? '100%' : '40%',
              // transition: "all ease 0.15s"
              // opacity: '60%',
              // textDecoration: 'line-through'
            }
          }}
        >
          {label}
        </Chip>
      </div>
    </Tooltip>
  ))
}
