import Capture from '@/lib/capture'
import { evaluateColorMap } from '@/lib/colormaps'
import config from '@/lib/config'
import { linspace, mixColors } from '@/lib/utils'
import { Box, Divider, FormLabel, Input, Option, Select } from '@mui/joy'

interface OptionsProps {
  plotCount: number
  setPlotCount: (v: number) => void

  captures: Capture[]
  captureIdx: number
  setCaptureIdx: (v: number) => void

  colorMaps: string[]
  colorMap: string
  setColorMap: (v: string) => void
}

export default function Options({
  plotCount,
  setPlotCount,
  captures,
  captureIdx,
  setCaptureIdx,
  colorMaps,
  colorMap,
  setColorMap,
}: OptionsProps) {
  return (
    <Box className="w-full flex gap-4 px-5 pt-7 justify-center items-center">
      <FormLabel>Figures</FormLabel>
      <Input
        type="number"
        value={Math.max(plotCount, 1)}
        onChange={(e) => setPlotCount(parseInt(e.target.value) || plotCount)}
        sx={{ width: 120, textAlign: 'center' }}
        slotProps={{ input: { min: 0 } }}
      />

      <Divider orientation="vertical" />

      <FormLabel>Capture</FormLabel>
      <Select
        value={captureIdx}
        onChange={(_e, idx: number | null) => {
          setCaptureIdx(idx as number)
        }}
      >
        {captures.map((cap, idx) => (
          <Option key={idx} value={idx}>
            {cap.name}
          </Option>
        ))}
      </Select>

      <Divider orientation="vertical" />
      <FormLabel>Colormap</FormLabel>
      <Select
        // className="grow-1"
        value={colorMap}
        placeholder="Color map"
        onChange={(_e: object | null, value: string | null) => {
          setColorMap(value as string)
          // vis.current?.setColorMap(buildColormap(value as string))
        }}
      >
        {colorMaps.map((v) => (
          <Option key={v} value={v}>
            <Box className="flex gap-5 justify-between w-full">
              <Box
                className={
                  'flex' + (config.SQUARE_COLORMAP_PREVIEWS ? '' : ' gap-1')
                }
              >
                {linspace(0, 1, 10).map((x, i) => {
                  const color = 'rgb({0},{1},{2})'.replace(
                    /{(\d)}/g,
                    (_, key) =>
                      evaluateColorMap(x, v)[parseInt(key)].toString(),
                  )

                  return (
                    <Box
                      key={i}
                      sx={(theme) => {
                        const light = theme.palette.mode == 'light'
                        const fg = light ? 'black' : 'white'
                        return {
                          width: 20,
                          height: 20,
                          borderRadius: config.SQUARE_COLORMAP_PREVIEWS
                            ? 0
                            : 10,
                          flexShrink: 0,
                          backgroundColor: color,
                          borderColor: mixColors(color, fg, 0.3),
                          // borderWidth: config.SQUARE_COLORMAP_PREVIEWS ? 0 : 2
                        }
                      }}
                    />
                  )
                })}
              </Box>
              {v}
            </Box>
          </Option>
        ))}
      </Select>
    </Box>
  )
}
