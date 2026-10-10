import { mulberry32, range } from './seed'

export type Rgb = readonly [number, number, number]

export interface HeartItem {
  /** position in heart space: x right, y up, origin at the heart's centre line */
  x: number
  y: number
  text: string
  size: number
  edge: boolean
  color: Rgb
  /** sideways drift that settles to 0 while it floats in */
  dx: number
  /** when (ms after start) it begins floating in */
  spawnAt: number
  done: boolean
}

export interface HeartLayout {
  items: HeartItem[]
  width: number
  height: number
  /** vertical centre of the heart in heart space */
  midY: number
  /** scale (px per heart unit) */
  sc: number
}

export type Measure = (text: string, size: number) => number

const WINE: Rgb = [0.44, 0.07, 0.22]
const CRIMSON: Rgb = [0.78, 0.16, 0.36]
const ROSE: Rgb = [0.95, 0.3, 0.52]

export const mix = (a: Rgb, b: Rgb, k: number): Rgb => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
export const toCss = (c: Rgb, alpha = 1): string =>
  `rgba(${Math.round(Math.max(0, Math.min(1, c[0])) * 255)},${Math.round(Math.max(0, Math.min(1, c[1])) * 255)},${Math.round(Math.max(0, Math.min(1, c[2])) * 255)},${alpha})`

const SHORT_FILLERS = [
  '사랑해 Ms. Naz',
  '我爱你 Ms. Naz',
  'Te amo Ms. Naz',
  'Ti amo Ms. Naz',
  '爱 Ms. Naz',
  'Te amo',
  'Ti amo',
  '사랑해',
  '愛してる',
  '我爱你',
  'Je t’aime',
  'I love you',
  'Eu te amo',
  'Σ’ αγαπώ',
  'Naz ♡',
  '♡',
]

/**
 * Packs phrases into a heart silhouette, row by row, using exact scanline spans of the
 * parametric heart curve. Eliminates voids and blank gaps by dynamic phrase fitting and balanced justification.
 */
export function buildHeart(
  width: number,
  phrases: readonly string[],
  measure: Measure,
  fontScale: number,
  durationMs: number,
  seed = 11,
): HeartLayout {
  const rng = mulberry32(seed)
  const sc = width / 34
  const heart = (a: number): [number, number] => [
    16 * Math.sin(a) ** 3 * sc,
    (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * sc,
  ]

  const poly = Array.from({ length: 720 }, (_, i) => heart((2 * Math.PI * i) / 720))
  const edges = poly.map((p, i) => [p, poly[(i + 1) % poly.length] as [number, number]] as const)
  const ys = poly.map((p) => p[1])
  const yMax = Math.max(...ys)
  const yMin = Math.min(...ys)
  const totalCurveH = yMax - yMin

  const spans = (y: number): Array<[number, number]> => {
    const xs: number[] = []
    for (const [[x1, y1], [x2, y2]] of edges) {
      if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) xs.push(x1 + ((y - y1) * (x2 - x1)) / (y2 - y1))
    }
    xs.sort((a, b) => a - b)
    const out: Array<[number, number]> = []
    for (let i = 0; i + 1 < xs.length; i += 2) out.push([xs[i] as number, xs[i + 1] as number])
    return out
  }

  const intersect = (a: Array<[number, number]>, b: Array<[number, number]>, minOv: number): Array<[number, number]> => {
    const out: Array<[number, number]> = []
    for (const p of a)
      for (const q of b) {
        const lo = Math.max(p[0], q[0])
        const hi = Math.min(p[1], q[1])
        if (hi - lo > minOv) out.push([lo, hi])
      }
    return out
  }

  let queue: string[] = []
  const nextPhrase = (): string => {
    if (queue.length === 0) {
      queue = [...phrases]
      for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        const tmp = queue[i] as string
        queue[i] = queue[j] as string
        queue[j] = tmp
      }
    }
    return queue.shift() as string
  }

  const sizes = [9.5, 10.5, 11.5, 12.5].map((s) => s * fontScale)
  const gap = 7 * fontScale
  const rowH = Math.max(...sizes) * 1.28 + 3 * fontScale
  const half = rowH / 2

  interface Raw {
    x: number
    y: number
    text: string
    size: number
    edge: boolean
  }
  const placed: Raw[] = []

  // Step from top lobes down close to the very bottom tip
  for (let y = yMax - half; y > yMin + 2; y -= rowH) {
    const isNearBottom = y < yMin + totalCurveH * 0.32
    const isVeryTip = y < yMin + totalCurveH * 0.16
    const minOverlap = isVeryTip ? 4 * (sc / 21) : isNearBottom ? 8 * (sc / 21) : 12 * (sc / 21)

    let row = intersect(spans(y + half), spans(y - half), minOverlap)
    if (row.length === 0 && (isNearBottom || y > yMax - rowH * 1.5)) {
      row = spans(y).filter(([lo, hi]) => hi - lo > minOverlap)
    }

    const rowSizes = isVeryTip
      ? [8, 9, 10].map((s) => s * fontScale)
      : isNearBottom
        ? [8.5, 9.5, 10.5].map((s) => s * fontScale)
        : sizes

    for (const [rawLo, rawHi] of row) {
      const lo = rawLo + 3
      const hi = rawHi - 3
      const spanW = hi - lo
      if (spanW < 12 * fontScale) continue

      let cur = lo + (isNearBottom ? 0 : range(rng, 0, 4))
      const line: Array<{ x: number; text: string; size: number; w: number }> = []

      // Pack phrases into the span until no more space
      for (;;) {
        const availableW = hi - cur
        if (availableW < 14 * fontScale) break

        let fit: { text: string; size: number; w: number } | null = null

        // Pass 1: Try random phrases from main queue
        for (let k = 0; k < 12; k++) {
          const text = nextPhrase()
          const size = rowSizes[Math.floor(rng() * rowSizes.length)] as number
          const w = measure(text, size)
          if (w <= availableW) {
            fit = { text, size, w }
            break
          }
        }

        // Pass 2: If main phrase didn't fit, search all main phrases for one that fits
        if (!fit && availableW >= 30 * fontScale) {
          for (const cand of phrases) {
            for (const size of rowSizes) {
              const w = measure(cand, size)
              if (w <= availableW) {
                fit = { text: cand, size, w }
                break
              }
            }
            if (fit) break
          }
        }

        // Pass 3: If still no fit, use compact fillers so NO blank holes are left!
        if (!fit) {
          for (const filler of SHORT_FILLERS) {
            for (const size of [rowSizes[0] ?? 9 * fontScale, 8.5 * fontScale]) {
              const w = measure(filler, size)
              if (w <= availableW) {
                fit = { text: filler, size, w }
                break
              }
            }
            if (fit) break
          }
        }

        if (!fit) break
        line.push({ x: cur + fit.w / 2, text: fit.text, size: fit.size, w: fit.w })
        cur += fit.w + gap
      }

      if (line.length === 0) continue

      if (line.length === 1) {
        ;(line[0] as (typeof line)[number]).x = (lo + hi) / 2
      } else {
        const last = line[line.length - 1] as (typeof line)[number]
        const remaining = hi - (last.x + last.w / 2)
        const maxExtraPerGap = 9 * fontScale

        if (remaining > 0) {
          const extraPerGap = remaining / (line.length - 1)
          if (extraPerGap <= maxExtraPerGap) {
            // Natural stretch: evenly distribute small remaining space
            line.forEach((it, i) => {
              it.x += (remaining * i) / (line.length - 1)
            })
          } else {
            // Remaining space is too big to stretch without creating awkward holes:
            // Center the entire line within [lo, hi] so words remain naturally grouped!
            const shift = remaining / 2
            line.forEach((it) => {
              it.x += shift
            })
          }
        }
      }

      line.forEach((it, i) =>
        placed.push({
          x: it.x,
          y,
          text: it.text,
          size: it.size,
          edge: i === 0 || i === line.length - 1 || isNearBottom,
        }),
      )
    }
  }

  // Calculate actual bounding box of all placed text so there is no dead space under or around the heart
  const placedYs = placed.map((p) => p.y)
  const minPlacedY = placedYs.length > 0 ? Math.min(...placedYs) : yMin
  const maxPlacedY = placedYs.length > 0 ? Math.max(...placedYs) : yMax
  const midY = (maxPlacedY + minPlacedY) / 2
  const pad = 10 * fontScale
  const height = maxPlacedY - minPlacedY + pad * 2 + Math.max(...sizes) * 0.75

  const radOf = (x: number, y: number): number => Math.hypot(x / (16 * sc), (y - midY) / (14.5 * sc))
  const decorated = placed.map((p) => {
    const rad = Math.min(1, radOf(p.x, p.y))
    let base = mix(WINE, CRIMSON, 0.25 + 0.75 * rad)
    base = mix(base, ROSE, range(rng, 0, 0.35) + (p.edge ? 0.3 : 0))
    return { p, rad, color: base }
  })

  const edgeList = decorated
    .filter((d) => d.p.edge)
    .sort(
      (a, b) =>
        (((Math.atan2(a.p.x, a.p.y - midY) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) -
        (((Math.atan2(b.p.x, b.p.y - midY) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)),
    )
  const inner = decorated
    .filter((d) => !d.p.edge)
    .map((d) => ({ d, k: -d.rad + range(rng, 0, 0.08) }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.d)
  const ordered = [...edgeList, ...inner]

  const step = durationMs / Math.max(1, ordered.length)
  const items: HeartItem[] = ordered.map((d, i) => ({
    x: d.p.x,
    y: d.p.y,
    text: d.p.text,
    size: d.p.size,
    edge: d.p.edge,
    color: d.color,
    dx: range(rng, -10, 10) * (sc / 21),
    spawnAt: i * step,
    done: false,
  }))

  return { items, width, height, midY, sc }
}
