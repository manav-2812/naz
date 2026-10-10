import { AnimatePresence, motion, useAnimationControls, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { config } from '../data/config'
import { copy } from '../data/copy'
import { useCountdown } from '../hooks/useCountdown'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { Arrow, Blossom, CakeSlice, Heart, Paw, Squiggle, Star, Tape } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

function Digit({ d }: { d: string }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[1ch] overflow-hidden align-top">
      <AnimatePresence initial={false}>
        <motion.span
          key={d}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Digits roll one by one. Only the ones that changed move. */
function Digits({ value, min = 2 }: { value: number; min?: number }) {
  const chars = String(value).padStart(min, '0').split('')
  return (
    <span aria-hidden="true" className="inline-flex tabular-nums">
      {chars.map((c, idx) => (
        <Digit key={chars.length - idx} d={c} />
      ))}
    </span>
  )
}

interface TileProps {
  value: number
  label: string
  tone: string
  rot: number
  radius: string
}

function Tile({ value, label, tone, rot, radius }: TileProps) {
  const controls = useAnimationControls()
  const prev = useRef(value)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    if (!reduced) {
      void controls.start({
        scaleX: [1, 1.07, 0.97, 1],
        scaleY: [1, 0.9, 1.05, 1],
        transition: { duration: 0.5, ease: 'easeOut' },
      })
    }
  }, [value, controls, reduced])

  const handleTileTap = () => {
    sfx.pop()
    haptics.light()
    void controls.start({
      scale: [1, 1.12, 0.94, 1],
      transition: { duration: 0.35, ease: 'easeOut' },
    })
  }

  return (
    <motion.div
      onClick={handleTileTap}
      data-cursor="open"
      animate={controls}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={clsx('relative flex flex-col items-center justify-center border-[3px] border-cocoa px-2 py-4 shadow-sticker sm:py-5 cursor-pointer select-none', tone)}
      style={{ rotate: rot, borderRadius: radius }}
    >
      <div className="font-ui text-[clamp(2.5rem,11.5vw,4.6rem)] font-bold leading-none text-cocoa">
        <Digits value={value} />
      </div>
      <span className="sr-only">{`${value} ${label}`}</span>
      <div aria-hidden="true" className="mt-1.5 font-ui text-[clamp(0.9rem,3.4vw,1.1rem)] font-medium lowercase tracking-wide text-cocoa-soft">
        {label}
      </div>
    </motion.div>
  )
}

export default function Countdown() {
  const c = useCountdown()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const fired = useRef(false)

  useEffect(() => {
    if (c.done && inView && !fired.current) {
      fired.current = true
      void fire.pawsAndHearts()
      sfx.chime()
    }
  }, [c.done, inView])

  const tiles: TileProps[] = [
    { value: c.days, label: config.units.days, tone: 'bg-petal', rot: -2.5, radius: '30px 36px 26px 38px' },
    { value: c.hours, label: config.units.hours, tone: 'bg-strawberry', rot: 1.8, radius: '36px 26px 38px 28px' },
    { value: c.minutes, label: config.units.minutes, tone: 'bg-butter', rot: -1.4, radius: '28px 38px 30px 34px' },
    { value: c.seconds, label: config.units.seconds, tone: 'bg-blush', rot: 2.6, radius: '38px 28px 34px 26px' },
  ]

  return (
    <section ref={ref} id="countdown" className="relative px-[var(--gutter)] pb-16 pt-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Star className="absolute right-[6%] top-[8%] w-8 rotate-12" />
        <Squiggle className="absolute left-[4%] top-[26%] w-20 -rotate-6 opacity-80" />
        <Paw className="absolute bottom-[10%] left-[7%] w-9 rotate-[-18deg] opacity-80" />
        <Blossom className="absolute bottom-[8%] right-[5%] w-12 rotate-12" />
      </div>

      <div className="relative mx-auto max-w-[1100px]">
        <Reveal>
          <SectionHeading
            text={`till your ${c.info.targetAgeOrdinal} birthday, ms. naz`}
            hand={c.info.targetAgeOrdinal}
            className="max-w-[16ch] sm:max-w-none"
          />
        </Reveal>

        {c.done ? (
          <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-4 text-center">
            <CakeSlice className="w-[min(46vw,200px)] animate-bob" />
            <p className="display max-w-[16ch] text-[clamp(2.2rem,8.5vw,4.4rem)] font-extrabold italic leading-[1.02] text-rosedeep">
              {`it’s today!! happy ${c.info.targetAgeOrdinal} birthday, jannnnn`}
            </p>
          </Reveal>
        ) : (
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_300px] lg:gap-12">
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-4">
                {tiles.map((t) => (
                  <Tile key={t.label} {...t} />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25} className="relative mx-auto w-full max-w-[340px] rotate-[2.2deg] lg:mt-6">
              <div className="paper relative rounded-[8px] px-6 pb-6 pt-9">
                <Tape color="butter" className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-5deg]" />
                <Tape color="petal" className="absolute -bottom-2 -right-4 rotate-[32deg] scale-90" />
                <div className="font-ui text-[clamp(3.4rem,14vw,4.8rem)] font-bold leading-none text-rosedeep">
                  <Digits value={c.daysSince} min={1} />
                  <span className="sr-only">{c.daysSince}</span>
                </div>
                <p className="mt-2 font-hand text-[1.55rem] leading-[1.15] text-cocoa">{copy.countdown.note}</p>
                <Heart className="absolute -bottom-4 left-4 w-9 rotate-[-12deg]" />
              </div>
              <Arrow className="pointer-events-none absolute -left-12 top-4 hidden w-16 -scale-x-100 rotate-[-20deg] lg:block" />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}
