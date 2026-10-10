import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { config } from '../data/config'
import { copy } from '../data/copy'
import { getBirthdayInfo } from '../lib/birthday'
import { getTimeOfDayInfo } from '../lib/timeOfDay'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { haptics } from '../lib/haptics'
import Billi from './Billi'
import CelestialSky from './CelestialSky'
import { Blossom, Cloud, Heart, Paw, Sparkle, Star, Underline } from './doodles'
import HeroScene from './HeroScene'
import { Twinkles } from './Sparkles'

interface Float {
  Comp: typeof Heart
  top: string
  left: string
  w: string
  rot: number
  delay: string
  hideSmall?: boolean
}

const floats: Float[] = [
  { Comp: Heart, top: '14%', left: '6%', w: '2.4rem', rot: -12, delay: '0s' },
  { Comp: Star, top: '22%', left: '88%', w: '2rem', rot: 14, delay: '-2s' },
  { Comp: Blossom, top: '58%', left: '3%', w: '2.8rem', rot: 8, delay: '-3s', hideSmall: true },
  { Comp: Heart, top: '70%', left: '92%', w: '1.8rem', rot: 18, delay: '-1s' },
  { Comp: Paw, top: '84%', left: '14%', w: '1.9rem', rot: -22, delay: '-4s', hideSmall: true },
  { Comp: Sparkle, top: '38%', left: '48%', w: '1.5rem', rot: 0, delay: '-2.5s', hideSmall: true },
  { Comp: Star, top: '8%', left: '56%', w: '1.5rem', rot: -6, delay: '-5s' },
]

const clouds: Array<{ top: string; w: string; dur: string; delay: string; op: number }> = [
  { top: '9%', w: 'clamp(110px,22vw,230px)', dur: '95s', delay: '-30s', op: 0.95 },
  { top: '46%', w: 'clamp(90px,16vw,170px)', dur: '120s', delay: '-80s', op: 0.8 },
  { top: '72%', w: 'clamp(120px,26vw,260px)', dur: '105s', delay: '-12s', op: 0.9 },
]

export default function Hero({ ready }: { ready: boolean }) {
  const bInfo = getBirthdayInfo()
  const tod = getTimeOfDayInfo()
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const vp = useBreakpoint()
  const [i, setI] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const cloudsY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 70])
  const bitsY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -110])

  useEffect(() => {
    if (!ready) return
    const id = window.setInterval(() => setI((n) => (n + 1) % config.nicknames.length), 2600)
    return () => window.clearInterval(id)
  }, [ready])

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.92 },
    animate: ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.92 },
    transition: {
      y: { type: 'spring' as const, stiffness: 200, damping: 15, delay },
      scale: { type: 'spring' as const, stiffness: 200, damping: 15, delay },
      opacity: { duration: 0.5, delay },
    },
  })

  const nick = config.nicknames[i] ?? config.nicknames[0]
  const showFloat = (f: Float): boolean => !(f.hideSmall && vp.width < 480)

  return (
    <section
      id="hero"
      ref={ref}
      aria-labelledby="hero-title"
      className={`relative isolate min-h-dvh overflow-hidden ${tod.skyGradient} transition-colors duration-1000`}
    >
      <CelestialSky period={tod.period} />
      <Twinkles className="pointer-events-none absolute inset-0 -z-0" />

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ y: cloudsY }}>
        {clouds.map((c, k) => (
          <div
            key={k}
            className="absolute left-0 animate-drift will-change-transform"
            style={{ top: c.top, width: c.w, animationDuration: c.dur, animationDelay: c.delay, opacity: c.op }}
          >
            <Cloud className="w-full" />
          </div>
        ))}
      </motion.div>

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ y: bitsY }}>
        {floats.filter(showFloat).map(({ Comp, top, left, w, rot, delay }, k) => (
          <div
            key={k}
            className="absolute animate-floaty"
            style={{ top, left, width: w, animationDelay: delay, ['--r' as string]: `${rot}deg` } as CSSProperties}
          >
            <div className="die-cut-sm">
              <Comp className="block w-full" />
            </div>
          </div>
        ))}
      </motion.div>

      <div
        className="relative z-10 mx-auto grid min-h-dvh w-full max-w-[1280px] items-center gap-4 px-[var(--gutter)] pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8"
        style={{ paddingTop: 'calc(var(--safe-top) + 72px)' }}
      >
        <div className="relative">
          <motion.div className="relative" {...enter(0.1)}>
            <div className="pointer-events-auto absolute -top-[22%] right-[2%] z-20 w-[clamp(84px,24vw,140px)] short:-top-[10%] lg:right-[8%] lg:w-[clamp(110px,11vw,150px)]">
              <Billi interactive className="w-full" />
            </div>

            {/* Romantic Time-of-Day Greeting Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 inline-flex flex-col items-start gap-1"
            >
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-cocoa/20 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
                <span className="text-base select-none">{tod.icon}</span>
                <span className="font-hand text-xl sm:text-2xl font-bold text-rosedeep tracking-wide">
                  {tod.greeting}
                </span>
              </div>
              <p className="font-hand text-base sm:text-lg text-cocoa-soft italic pl-2.5 leading-none">
                {tod.whisper}
              </p>
            </motion.div>

            <h1 id="hero-title" className="font-display font-extrabold leading-[0.92] tracking-[-0.02em] text-cocoa">
              <span className="block text-[clamp(3rem,15vw,6.6rem)]">{config.title.happy}</span>
              <span className="relative -ml-1 block w-max py-1 lg:-ml-3">
                <motion.span
                  className="relative inline-block will-change-transform"
                  animate={reduced ? undefined : { rotate: [-4, 3, -4], scale: [1, 1.035, 1] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="die-cut block">
                    <span className="block text-[clamp(5.4rem,30vw,12rem)] font-black italic leading-[0.82] text-rosedeep">
                      {bInfo.targetAgeOrdinal}
                    </span>
                  </span>
                </motion.span>
              </span>
              <span className="block text-[clamp(2.7rem,13.5vw,6rem)]">{config.title.birthday}</span>
              <span className="mt-1 block text-[clamp(2.7rem,13.5vw,6rem)]">
                {config.title.name}{' '}
                <span className="relative inline-block italic">
                  {config.title.nameItalic}
                  <Underline className="pointer-events-none absolute -bottom-[0.08em] left-0 h-[0.24em] w-full" delay={1.1} />
                </span>
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mt-6 flex flex-wrap items-baseline gap-x-3 font-hand text-[clamp(1.8rem,6.6vw,2.6rem)] leading-none text-cocoa-soft"
            aria-label={`${config.heroPrefix} ${nick}`}
            {...enter(0.35)}
          >
            <span aria-hidden="true">{config.heroPrefix}</span>
            <span className="relative inline-grid h-[1.25em] min-w-[7ch]" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={nick}
                  className="display col-start-1 row-start-1 text-[1.15em] font-bold italic text-rosedeep"
                  initial={{ opacity: 0, y: reduced ? 0 : 16, rotate: reduced ? 0 : -3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -16, rotate: reduced ? 0 : 3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                >
                  {nick}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.p>
        </div>

        <motion.div {...enter(0.5)} className="mx-auto w-full max-w-[420px] lg:max-w-none">
          <HeroScene />
        </motion.div>
      </div>

      <button
        type="button"
        data-cursor="open"
        onClick={() => {
          haptics.light()
          document.getElementById('countdown')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
        }}
        className="absolute inset-x-0 bottom-4 z-20 mx-auto flex min-h-[52px] w-max flex-col items-center gap-0.5 border-0 bg-transparent px-4"
        style={{ bottom: 'calc(var(--safe-bottom) + 14px)' }}
      >
        <Paw className="h-8 w-8 animate-bob" />
        <span className="font-hand text-[1.4rem] leading-none text-cocoa">{copy.hero.scrollHint}</span>
      </button>
    </section>
  )
}
