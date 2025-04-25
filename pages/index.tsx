import { Geist_Mono } from "next/font/google"
import PlaybackControl from "../components/playback_control"
import VisScatterBlock from "../components/vis_scatter_block"
import { colorMapData } from "@/lib/colormaps"
import { CssBaseline, CssVarsProvider, extendTheme, Option, Select, useColorScheme } from "@mui/joy"
import { useEffect, useState } from "react"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// })

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const customTheme = extendTheme({
  fontFamily: {
    display: geistMono.style.fontFamily, // applies to `h1`–`h4`
    body: geistMono.style.fontFamily, // applies to `title-*` and `body-*`
  }
})

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
    // <div className="fixed right-1 top-1.5 w-30">
    <div className="absolute left-1 top-1.5 w-30">
      <Select
        variant="soft"
        value={mode}
        onChange={(_event, newMode) => {
          setMode(newMode)
        }}
      >
        <Option value="system">System</Option>
        <Option value="light">Light</Option>
        <Option value="dark">Dark</Option>
      </Select>
    </div>
  )
}

export default function Home() {
  const smoothnessOptions = new Map([
    // ['50-0.01', '/embeddings/embedding-smoothed-50-0.01.np'],
    // ['50-0.05', '/embeddings/embedding-smoothed-50-0.05.np'],
    ['50-0.1', '/embeddings/embedding-smoothed-50-0.1.np'],
    ['50-0.2', '/embeddings/embedding-smoothed-50-0.2.np'],
    // ['50-0.4', '/embeddings/embedding-smoothed-50-0.4.np'],
    // ['100-0.01', '/embeddings/embedding-smoothed-100-0.01.np'],
    // ['100-0.05', '/embeddings/embedding-smoothed-100-0.05.np'],
    ['100-0.1', '/embeddings/embedding-smoothed-100-0.1.np'],
    ['100-0.2', '/embeddings/embedding-smoothed-100-0.2.np'],
    // ['100-0.4', '/embeddings/embedding-smoothed-100-0.4.np'],
    // ['200-0.01', '/embeddings/embedding-smoothed-200-0.01.np'],
    // ['200-0.05', '/embeddings/embedding-smoothed-200-0.05.np'],
    ['200-0.1', '/embeddings/embedding-smoothed-200-0.1.np'],
    ['200-0.2', '/embeddings/embedding-smoothed-200-0.2.np'],
    // ['200-0.4', '/embeddings/embedding-smoothed-200-0.4.np'],
  ])

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange modeStorageKey="mode-toggle-demo">
      <CssBaseline />
      <ModeSwitcher />

      <div className={`px-4 py-8 ${geistMono.className}`}>
      {/* <div className={`px-10 py-8`}> */}
        <PlaybackControl maxFrame={363}/>

        <div className="flex flex-row justify-around flex-wrap gap-2">
          <VisScatterBlock smoothnessOptions={smoothnessOptions} channels={['fc-0', 'fc-1']} colorMaps={Object.keys(colorMapData)} />
          <VisScatterBlock smoothnessOptions={smoothnessOptions} channels={['fc-0', 'fc-1']} colorMaps={Object.keys(colorMapData)} />
          <VisScatterBlock smoothnessOptions={smoothnessOptions} channels={['fc-0', 'fc-1']} colorMaps={Object.keys(colorMapData)} />
        </div>
      </div>
    </CssVarsProvider>
  )
}
