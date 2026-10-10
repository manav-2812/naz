import { motion } from 'framer-motion'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import clsx from 'clsx'
import { heartCopy, phrasesFor } from '../data/heart'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, dprCap, isLowEnd } from '../lib/device'
import { fire } from '../lib/confetti'
import { buildHeart, mix, toCss, type HeartItem, type HeartLayout, type Rgb } from '../lib/heartLayout'
import { sparklePath } from '../lib/shapes'
import { haptics } from '../lib/haptics'
import { Tape } from './doodles'

const FONT_STACK = '"Nunito Variable", sans-serif'
const ANIM_MS = 700
const FLASH: Rgb = [1, 0.56, 0.71]
const screenReaderPhrases = phrasesFor(1000)

export interface LoveHeartCardRef {
  replay: () => void
}

export interface LoveHeartCardProps {
  className?: string
  maxWidth?: number
  autoStart?: boolean
  showTapes?: boolean
  durationMs?: number
  bare?: boolean
  onDone?: () => void
}

const LoveHeartCard = forwardRef<LoveHeartCardRef, LoveHeartCardProps>(function LoveHeartCard(
  { className, maxWidth = 860, autoStart = false, showTapes = true, durationMs, bare = false, onDone },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)
  const replayFnRef = useRef<(() => void) | null>(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useImperativeHandle(ref, () => ({
    replay: () => replayFnRef.current?.(),
  }))

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const low = isLowEnd()
    let disposed = false
    let layout: HeartLayout | null = null
    let settled: HTMLCanvasElement | null = null
    let sctx: CanvasRenderingContext2D | null = null
    let dpr = 1
    let W = 0
    let H = 0
    let raf = 0
    let visible = autoStart
    let started = false
    let finished = false
    let startAt = 0
    let prev = 0
    let lastShimmer = 0
    let resizeTimer = 0
    let lastHapticTick = 0
    let didInitialHaptic = false
    const shimmers: Array<{ item: HeartItem; until: number }> = []
    const measurer = document.createElement('canvas').getContext('2d')

    const fontFor = (size: number): string => `800 ${size.toFixed(1)}px ${FONT_STACK}`
    const measure = (text: string, size: number): number => {
      if (!measurer) return text.length * size * 0.6
      measurer.font = fontFor(size)
      return measurer.measureText(text).width
    }
    const toX = (l: HeartLayout, x: number): number => l.width / 2 + x
    const toY = (l: HeartLayout, y: number): number => l.height / 2 - (y - l.midY)

    const paint = (
      g: CanvasRenderingContext2D,
      l: HeartLayout,
      item: HeartItem,
      x: number,
      y: number,
      color: string,
      shadow: string,
    ): void => {
      g.font = fontFor(item.size)
      g.fillStyle = shadow
      g.fillText(item.text, x + 2, y + 3)
      g.fillStyle = color
      g.fillText(item.text, x, y)
      void l
    }

    const settleItem = (item: HeartItem): void => {
      if (!layout || !sctx) return
      item.done = true
      paint(sctx, layout, item, toX(layout, item.x), toY(layout, item.y), toCss(item.color), 'rgba(242,104,154,0.28)')
    }

    const clearSettled = (): void => {
      if (!sctx || !settled) return
      sctx.setTransform(1, 0, 0, 1, 0, 0)
      sctx.clearRect(0, 0, settled.width, settled.height)
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sctx.textAlign = 'center'
      sctx.textBaseline = 'middle'
    }

    const settleAll = (): void => {
      if (!layout) return
      clearSettled()
      layout.items.forEach(settleItem)
      finished = true
    }

    const resetAnimation = (): void => {
      if (!layout) return
      layout.items.forEach((i) => {
        i.done = false
      })
      clearSettled()
      shimmers.length = 0
      finished = false
      didInitialHaptic = false
      lastHapticTick = 0
      startAt = performance.now()
      prev = 0
      setDone(false)
    }

    const sizeAndBuild = (): void => {
      const containerW = wrap.clientWidth > 0 ? wrap.clientWidth : Math.min(window.innerWidth - 24, maxWidth)
      W = Math.min(containerW, maxWidth)
      if (W < 120) return
      dpr = dprCap()
      const fontScale = clamp(W / 34 / 21, 0.95, 1.35)
      const targetDuration = durationMs ?? (low ? 5000 : 6200)
      layout = buildHeart(W, phrasesFor(W), measure, fontScale, targetDuration)
      H = Math.round(layout.height)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      settled = document.createElement('canvas')
      settled.width = canvas.width
      settled.height = canvas.height
      sctx = settled.getContext('2d')
      clearSettled()
    }

    const frame = (now: number): void => {
      raf = 0
      if (!layout || !settled || !visible || document.hidden) return
      if (prev && now - prev > 250) startAt += now - prev - 16
      prev = now

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(settled, 0, 0, W, H)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (started && !finished) {
        if (!didInitialHaptic && !reduced) {
          didInitialHaptic = true
          haptics.heartbeat()
        }

        const t = now - startAt
        let pending = 0
        const lift = 34 * (layout.sc / 21)
        for (const item of layout.items) {
          if (item.done) continue
          const u = clamp((t - item.spawnAt) / ANIM_MS, 0, 1)
          if (u <= 0) {
            pending++
            continue
          }
          if (u >= 1) {
            settleItem(item)
            if (!reduced && now - lastHapticTick > 140) {
              lastHapticTick = now
              haptics.heartTick()
            }
            continue
          }
          pending++
          if (!reduced && u > 0.1 && now - lastHapticTick > 170) {
            lastHapticTick = now
            haptics.heartTick()
          }
          const e = 1 - (1 - u) ** 3
          const x = toX(layout, item.x) + item.dx * (1 - e)
          const y = toY(layout, item.y) - (1 - e) * lift
          const flash = 0.75 * Math.sin(Math.PI * clamp((u - 0.55) / 0.45, 0, 1))
          const color = mix(item.color, FLASH, flash)
          ctx.globalAlpha = e ** 1.5
          paint(ctx, layout, item, x, y, toCss(color), 'rgba(242,104,154,0.28)')
        }
        ctx.globalAlpha = 1
        if (pending === 0) {
          finished = true
          setDone(true)
          if (!reduced) haptics.heartComplete()
          onDoneRef.current?.()
          if (!reduced) void fire.hearts({ x: 0.5, y: 0.55 }, 24)
        }
      }

      if (finished && reduced) return

      if (finished) {
        if (now - lastShimmer > 140 && layout.items.length > 0) {
          lastShimmer = now
          const item = layout.items[Math.floor(Math.random() * layout.items.length)]
          if (item) shimmers.push({ item, until: now + 300 })
        }
        for (let i = shimmers.length - 1; i >= 0; i--) {
          const s = shimmers[i]
          if (!s) continue
          if (now > s.until) {
            shimmers.splice(i, 1)
            continue
          }
          const k = 1 - (s.until - now) / 300
          const x = toX(layout, s.item.x)
          const y = toY(layout, s.item.y)
          ctx.font = fontFor(s.item.size)
          ctx.fillStyle = toCss(mix(s.item.color, FLASH, 0.65))
          ctx.fillText(s.item.text, x, y)
          ctx.save()
          ctx.globalAlpha = Math.sin(Math.PI * k)
          ctx.translate(x + ctx.measureText(s.item.text).width / 2 + 3, y - s.item.size * 0.5)
          ctx.fillStyle = '#FFEBA8'
          sparklePath(ctx, 4.5)
          ctx.fill()
          ctx.restore()
        }
      }
      raf = requestAnimationFrame(frame)
    }

    const kick = (): void => {
      if (!raf && visible && !document.hidden && layout) raf = requestAnimationFrame(frame)
    }

    const init = async (): Promise<void> => {
      try {
        await document.fonts?.load(`800 12px ${FONT_STACK}`)
      } catch {
        // fall back
      }
      if (disposed) return
      sizeAndBuild()
      if (reduced) {
        settleAll()
        setDone(true)
        onDoneRef.current?.()
      } else if (autoStart) {
        started = true
        startAt = performance.now()
      }
      kick()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting) || autoStart
        if (visible && !started && layout) {
          started = true
          startAt = performance.now()
        }
        kick()
      },
      { threshold: 0.15 },
    )
    io.observe(wrap)

    const onVisibility = (): void => kick()
    const onResize = (): void => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        const wasFinished = finished
        sizeAndBuild()
        if (wasFinished || reduced) settleAll()
        else if (started) startAt = performance.now()
        kick()
      }, 200)
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    replayFnRef.current = () => {
      if (!layout) return
      if (reduced) return
      haptics.heart()
      started = true
      resetAnimation()
      kick()
    }

    void init().then(() => {
      if ((visible || autoStart) && !started && layout) {
        started = true
        startAt = performance.now()
        kick()
      }
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      replayFnRef.current = null
    }
  }, [reduced, autoStart, maxWidth, durationMs])

  const replay = () => {
    haptics.heart()
    replayFnRef.current?.()
  }

  if (bare) {
    return (
      <motion.div
        className={clsx('relative mx-auto w-full flex flex-col items-center justify-center', className)}
        animate={done && !reduced ? { scale: [1, 1.025, 1, 1.018, 1] } : { scale: 1 }}
        transition={done && !reduced ? { duration: 1.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' } : { duration: 0.2 }}
      >
        <div ref={wrapRef} className="w-full flex justify-center">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={heartCopy.label}
            data-cursor="pop"
            onClick={replay}
            className="mx-auto block cursor-pointer filter drop-shadow-md"
          />
        </div>
        <ul className="sr-only">
          {screenReaderPhrases.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={clsx(
        'paper relative mx-auto rounded-blob border-[3px] border-cocoa bg-gradient-to-b from-milk to-blush p-3 sm:p-6 shadow-md',
        className,
      )}
      animate={done && !reduced ? { scale: [1, 1.018, 1, 1.012, 1] } : { scale: 1 }}
      transition={done && !reduced ? { duration: 1.5, repeat: Infinity, repeatDelay: 1.3, ease: 'easeInOut' } : { duration: 0.2 }}
    >
      {showTapes && (
        <>
          <Tape color="butter" className="absolute -top-3 left-[18%] rotate-[-5deg]" />
          <Tape color="petal" className="absolute -top-3 right-[16%] rotate-[6deg]" />
        </>
      )}
      <div ref={wrapRef} className="w-full">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={heartCopy.label}
          data-cursor="pop"
          onClick={replay}
          className="mx-auto block cursor-pointer"
        />
      </div>
      <ul className="sr-only">
        {screenReaderPhrases.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </motion.div>
  )
})

export default LoveHeartCard
