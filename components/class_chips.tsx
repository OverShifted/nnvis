import Capture from '@/lib/capture'
import { buildColormap } from '@/lib/colormaps'
import GlobalController from '@/lib/global_controller'
import { mixColors } from '@/lib/utils'
import { Chip, Tooltip } from '@mui/joy'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ClassChipsProps {
  capture: Capture
  colorMap: string
}

export default function ClassChips({ capture, colorMap }: ClassChipsProps) {
  const [classMask, setClassMask] = useState([] as number[])
  const labels = capture.labels || []

  useEffect(() => {
    GlobalController.setClassMask(classMask)
  }, [classMask])

  useEffect(() => {
    setClassMask(new Array(labels.length).fill(1))
  }, [capture, labels.length])

  return labels.map((label, index) => (
    <Tooltip
      className="classChipTooltip"
      key={index}
      variant="plain"
      arrow
      title={
        label.image ? (
          <Image
            style={{
              imageRendering: 'pixelated',
            }}
            width={120}
            height={120}
            src={label.image}
            alt=""
          />
        ) : null
      }
      slotProps={{
        root: {
          sx: (theme) => ({
            backgroundColor: 'black',
            padding: 4,
            filter: theme.palette.mode === 'dark' ? 'invert()' : '',
            opacity: label.image ? 100 : 0,
          }),
        },
        arrow: {
          sx: {
            '--joy-palette-background-surface': 'black',
          },
        },
      }}
      onOpen={() =>
        setClassMask(
          Array.from({ length: 10 }, (_, i) => (i === index ? 1 : 0)),
        )
      }
      onClose={() => setClassMask(new Array(classMask.length).fill(1))}
    >
      <div className="px-1">
        <Chip
          key={index}
          size="lg"
          sx={(theme) => {
            const color = buildColormap(colorMap)[index]
            const light = theme.palette.mode == 'light'

            const bg = light ? 'white' : 'black'
            const fg = light ? 'black' : 'white'
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
              opacity: classMask[index] ? '100%' : '40%',
            }
          }}
        >
          {label.name}
          {label.image ? (
            <Image
              style={{
                display: 'none',
              }}
              width={0}
              height={0}
              src={label.image}
              alt=""
            />
          ) : null}
        </Chip>
      </div>
    </Tooltip>
  ))
}
