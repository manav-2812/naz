import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { config } from '../data/config'
import { useReducedMotion } from '../hooks/useReducedMotion'

const INK = '#5B2A3E'

function BilliMini({ moving, waving }: { moving: boolean; waving: boolean }) {
  return (
    <svg viewBox="0 0 36 34" className={`block h-[30px] w-[32px] overflow-visible ${moving ? 'animate-walk' : ''}`} aria-hidden="true" focusable="false">
      <path d="M26 26c8 0 9-8 5-10" fill="none" stroke={INK} strokeWidth="2.600" strokeLinecap="round" />
      <ellipse cx="17" cy="24" rx="10" ry="7" fill="#FFFDFB" stroke={INK} strokeWidth="2" />
      <path d="M8 14 7 5l7 4ZM28 14l1-9-7 4Z" fill="#FFFDFB" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="18" cy="16" rx="11" ry="9" fill="#FFFDFB" stroke={INK} strokeWidth="2" />
      <circle cx="14" cy="16" r="1.500" fill={INK} />
      <circle cx="22" cy="16" r="1.500" fill={INK} />
      <path d="M17 19q1 1.500 2 0" fill="none" stroke="#F2689A" strokeWidth="1.600" strokeLinecap="round" />
      <path d="M12 30v3M22 30v3" stroke={INK} strokeWidth="2.600" strokeLinecap="round" className={moving ? 'animate-walk' : ''} />
      {waving && (
        <motion.path
          d="M27 22 33 12"
          stroke={INK}
          strokeWidth="2.600"
          strokeLinecap="round"
          style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}
          animate={{ rotate: [0, 24, -8, 24, 0] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      )}
    </svg>
  )
}

/** Bunting along the top. Billi walks along it as she scrolls and waves at the end. */
export default function ScrollRibbon() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })
  const barRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(360)
  const [moving, setMoving] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef(0)
  const patternId = useId().replace(/:/g, '')

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setDone(v >= 0.985)
    setMoving(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMoving(false), 180)
  })

  const x = useTransform(reduced ? scrollYProgress : smooth, (v) => v * Math.max(0, width - 34))

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label={config.ui.scrollProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70]"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <svg width="100%" height="26" className="block" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="48" height="26">
            <path d="M0 3Q24 9 48 3" fill="none" stroke={INK} strokeWidth="1.500" />
            <path d="M6 5 24 22 38 7Z" fill="#FFB5CD" stroke={INK} strokeWidth="1.500" strokeLinejoin="round" />
          </pattern>
        </defs>
        <rect width="100%" height="26" fill={`url(#${patternId})`} opacity=".9" />
      </svg>
      <motion.div className="absolute inset-x-0 h-[3px] origin-left bg-rose" style={{ scaleX: smooth, top: 'calc(var(--safe-top) + 2px)' }} />
      <motion.div className="absolute left-0" style={{ x, top: 'calc(var(--safe-top) + 6px)' }}>
        <BilliMini moving={moving && !reduced} waving={done} />
      </motion.div>
    </div>
  )
}
