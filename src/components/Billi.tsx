import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { config } from '../data/config'
import { copy } from '../data/copy'
import { useIdle } from '../hooks/useIdle'
import { fire } from '../lib/confetti'
import { LOOK_EVENT, type LookDetail } from '../lib/events'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { toast } from '../lib/toast'
import { Bow } from './doodles'

interface Props {
  /** The main Billi reacts to taps, falls asleep and hides the secret message. */
  interactive?: boolean
  className?: string
  partyHat?: boolean
  waving?: boolean
}

const INK = '#5B2A3E'

/** Billi: hand-drawn cat. Blinks, follows the pointer with her eyes, squints when petted, sleeps when idle. */
export default function Billi({ interactive = false, className, partyHat = false, waving = false }: Props) {
  const [unlockedHat, setUnlockedHat] = useState(() => {
    try {
      return localStorage.getItem('naz_billi_party_hat') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const onPartyHat = () => setUnlockedHat(true)
    window.addEventListener('billi_party_hat', onPartyHat)
    return () => window.removeEventListener('billi_party_hat', onPartyHat)
  }, [])

  const showPartyHat = partyHat || unlockedHat
  const svgRef = useRef<SVGSVGElement>(null)
  const lookRef = useRef<SVGGElement>(null)
  const [happy, setHappy] = useState(false)
  const idle = useIdle(20000, interactive)
  const controls = useAnimationControls()
  const taps = useRef(0)
  const tapTimer = useRef(0)
  const happyTimer = useRef(0)
  const sleeping = interactive && idle
  const mood = sleeping ? 'sleep' : happy ? 'happy' : 'open'

  useEffect(() => {
    let raf = 0
    let pending = false
    let px = 0
    let py = 0
    const apply = (): void => {
      pending = false
      const svg = svgRef.current
      const g = lookRef.current
      if (!svg || !g) return
      const r = svg.getBoundingClientRect()
      const cx = r.left + r.width * 0.5
      const cy = r.top + r.height * 0.4
      const dx = px - cx
      const dy = py - cy
      const d = Math.hypot(dx, dy) || 1
      const m = Math.min(1, d / 240)
      g.style.transform = `translate(${(dx / d) * m * 5}px, ${(dy / d) * m * 3.6}px)`
    }
    const schedule = (x: number, y: number): void => {
      px = x
      py = y
      if (!pending) {
        pending = true
        raf = requestAnimationFrame(apply)
      }
    }
    const onMove = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') schedule(e.clientX, e.clientY)
    }
    const onLook = (e: Event): void => {
      const d = (e as CustomEvent<LookDetail>).detail
      schedule(d.x, d.y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener(LOOK_EVENT, onLook)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener(LOOK_EVENT, onLook)
    }
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(tapTimer.current)
      window.clearTimeout(happyTimer.current)
    },
    [],
  )

  const onTap = (): void => {
    sfx.pop()
    haptics.purr()
    setHappy(true)
    window.clearTimeout(happyTimer.current)
    happyTimer.current = window.setTimeout(() => setHappy(false), 1300)
    taps.current += 1
    window.clearTimeout(tapTimer.current)
    tapTimer.current = window.setTimeout(() => {
      taps.current = 0
    }, 1600)
    if (taps.current >= 5) {
      taps.current = 0
      haptics.celebrate()
      toast(copy.billi.egg)
      sfx.chime()
      void controls.start({
        rotate: [0, 360],
        scale: [1, 1.2, 1],
        transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
      })
      const r = svgRef.current?.getBoundingClientRect()
      if (r) {
        void fire.hearts({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }, 34)
      }
    }
  }

  const body = (
    <svg ref={svgRef} viewBox="0 0 150 156" className="block h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      {/* tail */}
      <path d="M112 142c22 2 34-12 26-30-4-9-14-8-12 0 2 7 8 8 6 14" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M112 142c22 2 34-12 26-30-4-9-14-8-12 0 2 7 8 8 6 14" fill="none" stroke="#FFCFE0" strokeWidth="4.5" strokeLinecap="round" />
      {/* body */}
      <g className="animate-breathe" style={{ transformOrigin: '75px 154px' }}>
        <path d="M32 154C22 116 38 92 75 92s53 24 43 62Z" fill="#FFFDFB" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M58 154c-2-18 4-30 17-30s19 12 17 30Z" fill="#FFE3EC" />
        <ellipse cx="54" cy="150" rx="13" ry="7.500" fill="#FFFDFB" stroke={INK} strokeWidth="3" />
        <path d="M50 150v4M58 150v4" stroke="#FFB5CD" strokeWidth="2" strokeLinecap="round" />
        {!waving ? (
          <>
            <ellipse cx="96" cy="150" rx="13" ry="7.500" fill="#FFFDFB" stroke={INK} strokeWidth="3" />
            <path d="M92 150v4M100 150v4" stroke="#FFB5CD" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <g className="animate-wave" style={{ transformOrigin: '96px 125px' }}>
            <ellipse cx="106" cy="118" rx="13" ry="8.5" fill="#FFFDFB" stroke={INK} strokeWidth="3" transform="rotate(-30 106 118)" />
            <ellipse cx="106" cy="118" rx="7" ry="4.5" fill="#FFE3EC" transform="rotate(-30 106 118)" />
            <circle cx="102" cy="114" r="2" fill="#FFB5CD" />
            <circle cx="107" cy="112" r="2" fill="#FFB5CD" />
            <circle cx="112" cy="115" r="2" fill="#FFB5CD" />
          </g>
        )}
      </g>
      {/* head */}
      <path d="M33 46 30 10l31 18Z" fill="#FFFDFB" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M38 38 37 21l15 9Z" fill="#FFB5CD" />
      <path d="M117 46l3-36-31 18Z" fill="#FFFDFB" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M112 38l1-17-15 9Z" fill="#FFB5CD" />
      <ellipse cx="75" cy="66" rx="48" ry="42" fill="#FFFDFB" stroke={INK} strokeWidth="3" />
      <path d="M62 30v9M70 27v12M78 27v12M86 30v9" stroke="#FFB5CD" strokeWidth="3.500" strokeLinecap="round" />
      {/* party hat if high score reached */}
      {showPartyHat && (
        <g className="animate-wiggle" style={{ transformOrigin: '75px 25px' }}>
          <path
            d="M59 28 L75 -6 L91 28 Q75 33 59 28 Z"
            fill="#FF7597"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Party stripes / stars */}
          <path d="M63 21 L87 21" stroke="#FFEBA8" strokeWidth="3" strokeLinecap="round" />
          <path d="M67 12 L83 12" stroke="#FFFDFB" strokeWidth="3" strokeLinecap="round" />
          <path d="M71 4 L79 4" stroke="#FFEBA8" strokeWidth="2.5" strokeLinecap="round" />
          {/* fluffy pom pom on tip */}
          <circle cx="75" cy="-7" r="5.5" fill="#FFEBA8" stroke={INK} strokeWidth="2.5" />
          <circle cx="76.5" cy="-6" r="1.5" fill="#FFFDFB" />
        </g>
      )}
      <ellipse cx="42" cy="80" rx="9" ry="6" fill="#FFB5CD" opacity=".75" />
      <ellipse cx="108" cy="80" rx="9" ry="6" fill="#FFB5CD" opacity=".75" />
      {/* eyes */}
      {mood === 'open' && (
        <g ref={lookRef} style={{ transition: 'transform 0.12s ease-out' }}>
          <g className="animate-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <ellipse cx="55" cy="66" rx="6" ry="7.500" fill={INK} />
            <ellipse cx="95" cy="66" rx="6" ry="7.500" fill={INK} />
            <circle cx="53" cy="63" r="2.200" fill="#FFFDFB" />
            <circle cx="93" cy="63" r="2.200" fill="#FFFDFB" />
          </g>
        </g>
      )}
      {mood === 'happy' && (
        <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
          <path d="M47 70q8-12 16 0" />
          <path d="M87 70q8-12 16 0" />
        </g>
      )}
      {mood === 'sleep' && (
        <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
          <path d="M47 66q8 8 16 0" />
          <path d="M87 66q8 8 16 0" />
        </g>
      )}
      {/* nose and mouth */}
      <path d="M70 76q5-3 10 0-3 6-5 6t-5-6Z" fill="#F2689A" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M75 82q-5 8-12 4M75 82q5 8 12 4" fill="none" stroke={INK} strokeWidth="2.600" strokeLinecap="round" />
      {/* whiskers */}
      <g stroke={INK} strokeWidth="2" strokeLinecap="round" opacity=".7">
        <path d="M30 74 12 70M30 80 12 82M120 74l18-4M120 80l18 2" />
      </g>
    </svg>
  )

  return (
    <motion.div animate={controls} className={clsx('relative inline-block', className)}>
      {sleeping && (
        <div className="pointer-events-none absolute -right-2 -top-4 z-10 flex items-end font-hand text-2xl text-cocoa-soft" aria-hidden="true">
          <span className="animate-zzz">z</span>
          <span className="animate-zzz [animation-delay:0.8s]">z</span>
          <span className="animate-zzz [animation-delay:1.6s]">z</span>
          <span className="ml-1 text-base">{copy.billi.idle}</span>
        </div>
      )}
      {interactive ? (
        <motion.button
          type="button"
          data-cursor="pop"
          aria-label={config.ui.petsBilli}
          onClick={onTap}
          whileTap={{ scaleX: 1.07, scaleY: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
          className="relative block h-full w-full cursor-pointer border-0 bg-transparent p-0 [transform-origin:50%_100%]"
        >
          {body}
          <Bow className="pointer-events-none absolute right-[10%] top-[2%] w-[24%] rotate-[18deg]" />
        </motion.button>
      ) : (
        <div className="relative h-full w-full" aria-hidden="true">
          {body}
          <Bow className="pointer-events-none absolute right-[10%] top-[2%] w-[24%] rotate-[18deg]" />
        </div>
      )}
    </motion.div>
  )
}
