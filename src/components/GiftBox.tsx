import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { config } from '../data/config'
import { copy } from '../data/copy'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { INK, Heart, Sparkle, Star, Tape } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function GiftBox() {
  const [taps, setTaps] = useState(0)
  const controls = useAnimationControls()
  const open = taps >= 3

  useEffect(() => {
    if (taps > 0) return
    const id = window.setInterval(() => {
      void controls.start({ rotate: [0, -4, 4, -3, 3, 0], transition: { duration: 0.8 } })
    }, 3200)
    return () => window.clearInterval(id)
  }, [taps, controls])

  const tap = (): void => {
    if (open) return
    const n = taps + 1
    setTaps(n)
    sfx.pop()
    if (n === 1) {
      haptics.tap()
      void controls.start({ rotate: [0, -7, 7, -7, 7, 0], scale: [1, 1.04, 0.97, 1.03, 1], transition: { duration: 0.6 } })
    } else if (n === 2) {
      haptics.doubleTap()
      void controls.start({ rotate: [0, -12, 12, -12, 12, -8, 8, 0], scale: [1, 1.08, 0.94, 1.08, 1], y: [0, -8, 0, -6, 0], transition: { duration: 0.75 } })
      void fire.hearts({ x: 0.5, y: 0.7 }, 14)
    } else {
      haptics.celebrate()
      void controls.start({ scale: [1, 0.88, 1.12, 1], transition: { duration: 0.5 } })
      void fire.pawsAndHearts()
      sfx.chime()
    }
  }

  return (
    <section id="gift" className="relative overflow-hidden px-[var(--gutter)] pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Star className="absolute left-[8%] top-[18%] w-8 rotate-[-10deg]" />
        <Sparkle className="absolute right-[10%] top-[30%] w-8" fill="#FFEBA8" />
        <Heart className="absolute bottom-[3%] right-[10%] w-8 rotate-12" />
      </div>
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
        <Reveal>
          <SectionHeading text={copy.gift.heading} hand={copy.gift.headingHand} variant="underline" />
        </Reveal>

        <Reveal delay={0.1} className="mt-8 w-full">
          <motion.button
            type="button"
            data-cursor="pop"
            aria-label={config.ui.openGift}
            disabled={open}
            onClick={tap}
            animate={controls}
            whileTap={open ? undefined : { scaleX: 1.05, scaleY: 0.94 }}
            className="relative mx-auto block w-[min(78vw,300px)] border-0 bg-transparent p-0 disabled:cursor-default"
          >
            <svg viewBox="0 0 240 250" className="block w-full overflow-visible" aria-hidden="true" focusable="false">
              <ellipse cx="120" cy="238" rx="86" ry="9" fill="#FFB5CD" opacity=".55" />
              <rect x="30" y="112" width="180" height="120" rx="8" fill="#FFCFE0" stroke={INK} strokeWidth="3.5" />
              <rect x="104" y="112" width="32" height="120" fill="#F2689A" stroke={INK} strokeWidth="3.5" />
              <path d="M44 128c0 20 0 56 0 80M60 128v80" stroke="#FFFDFB" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" opacity=".9" />
              <motion.g
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={open ? { y: -150, x: -52, rotate: -26, opacity: 0 } : taps === 2 ? { y: -12 } : { y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                <rect x="20" y="76" width="200" height="44" rx="10" fill="#FF8FB5" stroke={INK} strokeWidth="3.5" />
                <rect x="104" y="76" width="32" height="44" fill="#F2689A" stroke={INK} strokeWidth="3.5" />
                <g fill="#F2689A" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
                  <path d="M120 76C104 46 66 40 62 58c-4 18 30 24 58 18Z" />
                  <path d="M120 76c16-30 54-36 58-18 4 18-30 24-58 18Z" />
                  <circle cx="120" cy="74" r="9" fill="#FFB5CD" />
                </g>
              </motion.g>
            </svg>
          </motion.button>
          {!open && <p className="mt-5 font-hand text-[1.7rem] text-cocoa-soft">{copy.gift.hint}</p>}
        </Reveal>

        <AnimatePresence>
          {open && (
            <motion.div
              key="card"
              className="paper relative z-10 -mt-24 w-[min(92vw,420px)] rounded-[8px] px-7 pb-8 pt-10"
              initial={{ y: -150, scale: 0.4, opacity: 0, rotate: 8 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotate: -2.5 }}
              transition={{ type: 'spring', stiffness: 110, damping: 12, delay: 0.25 }}
            >
              <Tape color="butter" className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
              <p className="font-hand text-[1.9rem] leading-none text-cocoa-soft">{copy.gift.intro}</p>
              <p className="display mt-3 text-[clamp(1.7rem,6.5vw,2.3rem)] font-bold italic leading-[1.12] text-cocoa">{config.surpriseText}</p>
              <p className="mt-4 font-hand text-[1.8rem] text-rosedeep">{config.myName}</p>
              <Heart className="absolute -bottom-4 -right-3 w-10 rotate-12" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
