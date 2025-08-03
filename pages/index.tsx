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
  IconButton,
  Link,
  useColorScheme,
} from '@mui/joy'
import React, { useEffect, useState } from 'react'
import GlobalController from '@/lib/global_controller'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import captures from '@/lib/captures'
import Head from 'next/head'
import ClassChips from '@/components/class_chips'
import Options from '@/components/options'

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
  const [captureIdx, setCaptureIdx] = useState(0)
  const capture = captures[captureIdx]

  // TODO: Expensive state to handle!
  const [plotCount, setPlotCount] = useState(3)
  const [colorMap, setColorMap] = useState('tab10')
  const [classMask, setClassMask] = useState([] as number[])

  useEffect(() => {
    GlobalController.setClassMask(classMask)
  }, [classMask])

  useEffect(() => {
    const classCount = captures[captureIdx].classes?.length || 0
    setClassMask(new Array(classCount).fill(1))

    GlobalController.capture = capture
  }, [captureIdx, capture])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputField =
        // (target.tagName === 'INPUT' &&
        //   (target as HTMLInputElement).type !== 'number') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        (target as HTMLElement).isContentEditable

      if (isInputField) return

      if (event.code === 'Space') {
        event.preventDefault()
        GlobalController.setIsPlaying(!GlobalController.isPlaying)
      } else if (event.code == 'ArrowRight') {
        event.preventDefault()
        GlobalController.setTime(GlobalController.time + 1)
        GlobalController.setIsPlaying(false)
      } else if (event.code == 'ArrowLeft') {
        event.preventDefault()
        GlobalController.setTime(GlobalController.time - 1)
        GlobalController.setIsPlaying(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
        {/* <Box className="absolute top-5 right-5">
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

        <h1 className="text-2xl mr-4 pt-7">Neural Network Visualizer</h1> */}

        <Box className="flex pt-6">
          <Box className={`flex items-center gap-2 ${geistMono.className}`}>
            by
            <Link
              className={geistMono.className}
              href="https://overshifted.github.io/"
            >
              <div
                className="w-5 h-5 mr-2"
                style={{
                  backgroundColor: 'rgb(74, 153, 255)',
                }}
              />
              OverShifted
            </Link>
          </Box>

          <h1 className="text-2xl m-auto">Neural Network Visualizer</h1>

          <ThemeToggleButton />
        </Box>

        <Options
          plotCount={plotCount}
          setPlotCount={setPlotCount}
          captures={captures}
          captureIdx={captureIdx}
          setCaptureIdx={setCaptureIdx}
          colorMaps={colorMapKeys}
          colorMap={colorMap}
          setColorMap={setColorMap}
        />

        <Box className="flex flex-wrap justify-center pt-8">
          <ClassChips capture={capture} colorMap={colorMap} />
        </Box>

        <Box className="pt-4">
          <PlaybackControl maxFrame={capture.frameCount} />
        </Box>
      </Box>

      <div className={`px-4 pb-8 ${geistMono.className}`}>
        <div className="flex flex-row justify-around flex-wrap gap-2">
          {Array.from({ length: plotCount }).map((_, index) => (
            <React.Fragment key={index}>
              <VisScatterBlock
                variations={capture.variations}
                colorMap={colorMap}
              />
              {index < plotCount - 1 ? (
                <Divider orientation="vertical" />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </CssVarsProvider>
  )
}
