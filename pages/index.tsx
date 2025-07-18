import { Geist_Mono } from 'next/font/google'
import PlaybackControl from '../components/playback_control'
import VisScatterBlock from '../components/vis_scatter_block'
import { colorMapKeys } from '@/lib/colormaps'
import {
  Box,
  CssBaseline,
  CssVarsProvider,
  Divider,
  extendTheme,
  FormLabel,
  IconButton,
  Input,
  Link,
  Option,
  Select,
  useColorScheme,
} from '@mui/joy'
import { useEffect, useState } from 'react'
import GlobalController from '@/lib/global_controller'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import captures from '@/lib/captures'
import Head from 'next/head'
import ClassChips from '@/components/class_chips'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const customTheme = extendTheme({
  fontFamily: {
    display: geistMono.style.fontFamily, // applies to `h1`–`h4`
    body: geistMono.style.fontFamily, // applies to `title-*` and `body-*`
  },
})

/*
function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography>Light</Typography>
      <Switch
        checked={mode === 'dark'}
        onChange={(event) => {
          setMode(event.target.checked ? 'dark' : 'light')
        }}
      />
      <Typography>Dark</Typography>
    </Box>
  )
}

function ModeSwitcher() {
    const { mode, setMode } = useColorScheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <Select
            // variant="soft"
            value={mode}
            onChange={(_event, newMode) => {
                setMode(newMode)
            }}
        >
            <Option value="system">System</Option>
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
        </Select>
    )
}
*/

const ThemeToggleButton = () => {
  const { mode, setMode } = useColorScheme()

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <IconButton
      variant="outlined"
      color="neutral"
      onClick={toggleTheme}
      sx={{
        width: 50,
        height: 50,
        borderRadius: '100%',
        borderWidth: 2,
        '& svg': {
          fontSize: '1.5rem',
        },
      }}
    >
      {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  )
}

export default function Home() {
  // State for selected capture
  const [captureIdx, setSelectedCaptureIdx] = useState(0)
  const capture = captures[captureIdx]

  GlobalController.frameCount = capture.frameCount
  const colorMaps = colorMapKeys

  // TODO: Expensive state to handle!
  const [plotCount, setPlotCount] = useState(3)
  const [colorMap, setColorMap] = useState('tab10')
  const [classMask, setClassMask] = useState([] as number[])

  useEffect(() => {
    GlobalController.setClassMask(classMask)
  }, [classMask])

  useEffect(() => {
    const classCount = captures[captureIdx].labels?.length || 0
    setClassMask(new Array(classCount).fill(1))
  }, [captureIdx])

  return (
    <CssVarsProvider
      theme={customTheme}
      disableTransitionOnChange
      modeStorageKey="mode-toggle-demo"
    >
      <CssBaseline />

      <Head>
        <title>NNVis</title>
      </Head>

      <Box
        className="w-full px-15 pt-0 pb-3 mb-10 text-center"
        sx={(theme) => ({
          // backgroundColor: theme.vars.palette.primary[200],
          // color: theme.vars.palette.primary[900]

          backgroundColor:
            theme.palette.mode == 'light' ? 'rgb(227, 239, 251)' : '#19283b',
          color: theme.vars.palette.primary.softColor,
        })}
      >
        <Box className="absolute top-5 right-5">
          <ThemeToggleButton />
        </Box>

        <Box className="absolute top-8 left-8 flex items-center gap-2">
          by
          <Link href="https://overshifted.github.io/">
            <div
              className="w-5 h-5 mr-2"
              style={{
                backgroundColor: 'rgb(74, 153, 255)',
              }}
            />
            OverShifted
          </Link>
        </Box>

        <h1 className="text-2xl mr-4 pt-7">Neural Network Visualizer</h1>

        <Box className="w-full flex gap-5 px-5 pt-7 justify-center items-center">
          {/* <h1 classNames"text-2xl mr-4">Neural Network Visualizer</h1> */}
          {/* <span className="content-center">by</span>
                    <Link href="https://overshifted.github.io/">OverShifted</Link> */}
          <span className="flex gap-2.5">
            <FormLabel>Capture</FormLabel>
            <Select
              value={captureIdx}
              onChange={(_e, idx: number | null) => {
                setSelectedCaptureIdx(idx as number)
                // const classCount = captures[idx as number].labels?.length || 0
                // setClassMask(new Array(classCount).fill(1))
              }}
            >
              {captures.map((cap, idx) => (
                <Option key={idx} value={idx}>
                  {cap.name}
                </Option>
              ))}
            </Select>
          </span>

          <Divider orientation="vertical" />

          <span className="flex gap-2.5">
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
                <Option value={v} key={v}>
                  {v}
                </Option>
              ))}
            </Select>
          </span>

          <Divider orientation="vertical" />

          <span className="flex gap-2.5">
            <FormLabel>Figures</FormLabel>
            <Input
              type="number"
              value={plotCount}
              onChange={(e) => setPlotCount(parseInt(e.target.value))}
              sx={{ width: 80, textAlign: 'center' }}
              slotProps={{ input: { min: 0 } }}
            />
          </span>
        </Box>

        <Box className="flex gap-2 justify-center pt-8">
          <ClassChips capture={capture} colorMap={colorMap} />
        </Box>

        <Box className="pt-4">
          <PlaybackControl maxFrame={capture.frameCount} />
        </Box>
      </Box>

      {/* <div className="absolute left-1 top-1.5 w-90 flex gap-2"> */}
      {/* <div className="left-1 top-1.5 w-90 flex gap-2 px-5"> */}
      {/* <div className="w-90 flex gap-2 px-5 pt-5">
                <Select
                    value={captureIdx}
                    onChange={(_e, idx: number | null) => {
                        setSelectedCaptureIdx(idx as number)
                    }}
                >
                    {captures.map((cap, idx) => (<Option key={idx} value={idx}>{cap.name}</Option>))}
                </Select>

                <Input
                    type="number"
                    value={plotCount}
                    onChange={(e) => setPlotCount(parseInt(e.target.value))}
                    sx={{ width: 80, textAlign: 'center' }}
                    slotProps={{ input: { min: 0 } }}
                />
            </div> */}

      <div className={`px-4 pb-8 ${geistMono.className}`}>
        {/* <PlaybackControl maxFrame={capture.frameCount}/> */}

        <div className="flex flex-row justify-around flex-wrap gap-2">
          {Array.from({ length: plotCount }).map((_, index) => (
            <>
              <VisScatterBlock
                key={index}
                variations={capture.variations}
                colorMaps={colorMapKeys}
                colorMap={colorMap}
              />
              {index < plotCount - 1 ? (
                <Divider key={index} orientation="vertical" />
              ) : (
                <></>
              )}
            </>
          ))}
        </div>
      </div>
    </CssVarsProvider>
  )
}
