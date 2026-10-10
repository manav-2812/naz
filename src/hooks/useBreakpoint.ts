import { useEffect, useState } from 'react'

export type Breakpoint = 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Viewport {
  width: number
  height: number
  bp: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  landscape: boolean
  coarse: boolean
}

function toBreakpoint(w: number): Breakpoint {
  if (w >= 1536) return '2xl'
  if (w >= 1280) return 'xl'
  if (w >= 1024) return 'lg'
  if (w >= 768) return 'md'
  if (w >= 480) return 'sm'
  if (w >= 360) return 'xs'
  return 'base'
}

function read(): Viewport {
  const width = window.innerWidth
  const height = window.innerHeight
  return {
    width,
    height,
    bp: toBreakpoint(width),
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    landscape: width > height,
    coarse: window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches,
  }
}

/** Debounced viewport info. Re-reads on resize and on orientation change. */
export function useBreakpoint(): Viewport {
  const [vp, setVp] = useState<Viewport>(read)

  useEffect(() => {
    let t = 0
    const update = (): void => {
      window.clearTimeout(t)
      t = window.setTimeout(() => setVp(read()), 120)
    }
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return vp
}
