import type confettiNS from 'canvas-confetti'
import { config } from '../data/config'
import { isLowEnd } from './device'
import { haptics } from './haptics'

type Confetti = typeof confettiNS
type Shape = confettiNS.Shape

interface Kit {
  confetti: Confetti
  heart?: Shape
  paw?: Shape
  petal?: Shape
  cake?: Shape
}

const HEART =
  'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'
const PETAL = 'M50 0C84 28 84 72 50 100 16 72 16 28 50 0Z'
const circle = (cx: number, cy: number, r: number): string =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`
const PAW = [circle(50, 68, 21), circle(20, 42, 9), circle(40, 24, 9), circle(60, 24, 9), circle(80, 42, 9)].join('')
const CAKE = 'M4 84V54C4 54 30 14 96 40V84Z'

let kitPromise: Promise<Kit> | null = null

function safeShape(confetti: Confetti, path: string): Shape | undefined {
  try {
    return confetti.shapeFromPath({ path })
  } catch {
    return undefined
  }
}

function loadKit(): Promise<Kit> {
  if (!kitPromise) {
    kitPromise = import('canvas-confetti').then((mod) => {
      const confetti = mod.default
      return {
        confetti,
        heart: safeShape(confetti, HEART),
        paw: safeShape(confetti, PAW),
        petal: safeShape(confetti, PETAL),
        cake: safeShape(confetti, CAKE),
      }
    })
  }
  return kitPromise
}

const scale = (n: number): number => (isLowEnd() ? Math.ceil(n * 0.55) : n)
const colors = [
  config.palette.petal,
  config.palette.strawberry,
  config.palette.bubblegum,
  config.palette.rose,
  config.palette.butter,
]
const shapesOf = (...list: Array<Shape | undefined>): Shape[] => list.filter((s): s is Shape => Boolean(s))

export interface Origin {
  x: number
  y: number
}

async function run(job: (kit: Kit) => void): Promise<void> {
  try {
    job(await loadKit())
  } catch {
    // confetti is a bonus. never let it break the page.
  }
}

export const fire = {
  petals: (origin: Origin = { x: 0.5, y: 0.6 }) =>
    run(({ confetti, petal }) => {
      void confetti({
        particleCount: scale(70),
        spread: 100,
        startVelocity: 38,
        gravity: 0.7,
        ticks: 260,
        scalar: 1.5,
        origin,
        colors,
        shapes: shapesOf(petal, 'circle'),
        disableForReducedMotion: true,
      })
    }),

  hearts: (origin: Origin = { x: 0.5, y: 0.6 }, count = 26) => {
    haptics.heart()
    return run(({ confetti, heart }) => {
      void confetti({
        particleCount: scale(count),
        spread: 80,
        startVelocity: 30,
        scalar: 1.4,
        ticks: 200,
        origin,
        colors,
        shapes: shapesOf(heart, 'star'),
        disableForReducedMotion: true,
      })
    })
  },

  pawsAndHearts: () =>
    run(({ confetti, heart, paw }) => {
      const shapes = shapesOf(heart, paw)
      const base = { colors, shapes, scalar: 1.5, ticks: 320, gravity: 0.8, disableForReducedMotion: true }
      void confetti({ ...base, particleCount: scale(60), spread: 70, angle: 60, origin: { x: 0, y: 0.75 }, startVelocity: 60 })
      void confetti({ ...base, particleCount: scale(60), spread: 70, angle: 120, origin: { x: 1, y: 0.75 }, startVelocity: 60 })
      window.setTimeout(() => {
        void confetti({ ...base, particleCount: scale(50), spread: 120, startVelocity: 35, origin: { x: 0.5, y: 0.4 } })
      }, 350)
    }),

  cakeRain: () =>
    run(({ confetti, cake, heart }) => {
      const shapes = shapesOf(cake, heart)
      const end = Date.now() + 2600
      const drop = (): void => {
        void confetti({
          particleCount: scale(5),
          angle: 270,
          spread: 160,
          startVelocity: 8,
          gravity: 0.55,
          ticks: 420,
          scalar: 2.1,
          origin: { x: Math.random(), y: -0.05 },
          colors,
          shapes,
          disableForReducedMotion: true,
        })
        if (Date.now() < end) window.setTimeout(drop, 110)
      }
      drop()
    }),
}
