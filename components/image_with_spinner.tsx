'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CircularProgress } from '@mui/joy'

type ImageWithSpinnerProps = {
  src: string
  alt: string
  width?: number
  height?: number
  style?: React.CSSProperties
  loading?: 'lazy' | 'eager'
}

export default function ImageWithSpinner({
  src,
  alt,
  width,
  height,
  style,
  loading = 'lazy',
}: ImageWithSpinnerProps) {
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const showSpinner = isLoading === true

  // Only show spinner if the image is not loaded in 60ms to avoid glitches
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading((isLoading) => (isLoading === null ? true : false))
    }, 60)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
        ...style,
      }}
    >
      {showSpinner && <CircularProgress />}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          opacity: showSpinner ? 0 : 1,
          position: showSpinner ? 'absolute' : 'relative',
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  )
}
