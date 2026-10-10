import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { config } from '../data/config'
import { clamp, dprCap, hasFinePointer, isLowEnd, prefersReducedMotion } from '../lib/device'
import { lookAt } from '../lib/events'
import { haptics } from '../lib/haptics'
import { ParticleField, type ParticleKind } from '../lib/particles'
import { sparklePath } from '../lib/shapes'
import { Sparkle } from './doodles'

interface Wish {
  id: number
  x: number
  y: number
  text: string
}

const colors = [config.palette.petal, config.palette.strawberry, config.palette.bubblegum, config.palette.butter, config.palette.rose]
const kinds: ParticleKind[] = ['heart', 'star', 'sparkle']
const pickColor = (): string => colors[Math.floor(Math.random() * colors.length)] ?? config.palette.petal
const pickKind = (): ParticleKind => kinds[Math.floor(Math.random() * kinds.length)] ?? 'heart'

/** things that already do something when tapped. a tap on them never drops a wish. */
const BUSY = 'button, a, input, textarea, label, canvas, [data-cursor], [data-nowish], [role="dialog"], [role="button"]'

/**
 * Global pointer magic on one canvas: mouse trail and click pop, touch ripples,
 * and a floating wish wherever she taps on empty paper.
 */
export default function Sparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const field = new ParticleField(canvas, 44)
    const fine = hasFinePointer()
    const reduced = prefersReducedMotion()
    const maxTrail = isLowEnd() ? 6 : 12
    let lastTrail = 0
    let lastWish = 0
    let lx = -100
    let ly = -100

    const onMove = (e: PointerEvent): void => {
      if (!fine || reduced || e.pointerType !== 'mouse') return
      const now = performance.now()
      if (now - lastTrail < 55 || Math.hypot(e.clientX - lx, e.clientY - ly) < 10) return
      if (field.trailCount() >= maxTrail) return
      lastTrail = now
      lx = e.clientX
      ly = e.clientY
      field.spawn(pickKind(), e.clientX + (Math.random() - 0.5) * 10, e.clientY + (Math.random() - 0.5) * 10, {
        vx: (Math.random() - 0.5) * 22,
        vy: -(18 + Math.random() * 22),
        life: 0.9 + Math.random() * 0.5,
        size: 4 + Math.random() * 4,
        color: pickColor(),
        trail: true,
      })
    }

    const onDown = (e: PointerEvent): void => {
      lookAt(e.clientX, e.clientY)
      if (!reduced) {
        if (e.pointerType === 'mouse') {
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + Math.random() * 0.5
            const s = 70 + Math.random() * 50
            field.spawn('heart', e.clientX, e.clientY, {
              vx: Math.cos(a) * s,
              vy: Math.sin(a) * s,
              life: 0.65,
              size: 4.5 + Math.random() * 2.5,
              color: pickColor(),
            })
          }
        } else {
          field.spawn('ring', e.clientX, e.clientY, { life: 0.6, size: 30, color: config.palette.bubblegum })
          const n = 3 + Math.round(Math.random())
          for (let i = 0; i < n; i++) {
            const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2
            const s = 60 + Math.random() * 50
            field.spawn('heart', e.clientX, e.clientY, {
              vx: Math.cos(a) * s,
              vy: Math.sin(a) * s,
              life: 0.8,
              size: 5 + Math.random() * 3,
              color: pickColor(),
            })
          }
        }
      }
      const target = e.target instanceof Element ? e.target : null
      const now = performance.now()
      if (target && !target.closest(BUSY) && now - lastWish > 380) {
        lastWish = now
        haptics.light()
        const text = config.wishes[Math.floor(Math.random() * config.wishes.length)] ?? config.wishes[0]
        setWishes((list) => [...list.slice(-3), { id: ++nextId.current, x: e.clientX, y: e.clientY, text }])
      }
    }

    let resizeTimer = 0
    const onResize = (): void => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => field.resize(), 150)
    }
    const onVisibility = (): void => field.setPaused(document.hidden)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      field.destroy()
    }
  }, [])

  const reduced = prefersReducedMotion()
  const maxX = typeof window === 'undefined' ? 400 : window.innerWidth

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9990]" />
      {wishes.map((w) => (
        <motion.div
          key={w.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-[9991] flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgba(255,253,251,0.92)] px-3 py-1 shadow-soft"
          style={{ left: clamp(w.x, 90, Math.max(90, maxX - 90)), top: w.y, translateX: '-50%', translateY: '-50%' }}
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 1], y: reduced ? 0 : -90 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], times: [0, 0.15, 0.7, 1] }}
          onAnimationComplete={() => setWishes((list) => list.filter((i) => i.id !== w.id))}
        >
          <Sparkle className="h-5 w-5" fill="#FFEBA8" />
          <span className="font-hand text-[1.35rem] leading-none text-cocoa">{w.text}</span>
        </motion.div>
      ))}
    </>
  )
}

interface Twinkle {
  x: number
  y: number
  s: number
  phase: number
  speed: number
  color: string
}

/** A handful of tiny twinkles for the hero sky. Count scales with area, pauses off screen and in hidden tabs. */
export function Twinkles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = prefersReducedMotion()
    const low = isLowEnd()
    let w = 0
    let h = 0
    let dpr = 1
    let stars: Twinkle[] = []
    let raf = 0
    let visible = true
    const tints = ['#FFFDFB', '#FFEBA8', '#FF8FB5', '#FFFDFB']

    const build = (): void => {
      dpr = dprCap()
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const count = Math.round(clamp((w * h) / 9000, 14, 60) * (low ? 0.5 : 1))
      stars = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: 3 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.4,
        color: tints[i % tints.length] ?? '#FFFDFB',
      }))
      draw(performance.now())
    }

    const draw = (now: number): void => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const st of stars) {
        const a = reduced ? 0.7 : 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(now / 1000 * st.speed + st.phase))
        ctx.save()
        ctx.globalAlpha = a
        ctx.translate(st.x, st.y)
        ctx.fillStyle = st.color
        sparklePath(ctx, st.s)
        ctx.fill()
        ctx.restore()
      }
    }

    const loop = (now: number): void => {
      raf = 0
      if (!visible || document.hidden) return
      draw(now)
      raf = requestAnimationFrame(loop)
    }
    const kick = (): void => {
      if (!raf && !reduced && visible && !document.hidden) raf = requestAnimationFrame(loop)
    }

    build()
    kick()
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (visible) kick()
    })
    io.observe(parent)
    let t = 0
    const onResize = (): void => {
      window.clearTimeout(t)
      t = window.setTimeout(build, 160)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    document.addEventListener('visibilitychange', kick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      document.removeEventListener('visibilitychange', kick)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
