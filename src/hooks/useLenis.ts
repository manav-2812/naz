import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../lib/device'

let instance: Lenis | null = null

export function getLenis(): Lenis | null {
  return instance
}

export function lockScroll(locked: boolean): void {
  document.documentElement.classList.toggle('scroll-locked', locked)
  if (locked) instance?.stop()
  else instance?.start()
}

export function scrollToTop(): void {
  if (instance) instance.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Smooth scroll. Native touch scrolling is left alone, and it stays off for reduced motion. */
export function useLenis(): void {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    })
    instance = lenis
    if (document.documentElement.classList.contains('scroll-locked')) lenis.stop()
    let raf = 0
    const loop = (time: number): void => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instance = null
    }
  }, [])
}
