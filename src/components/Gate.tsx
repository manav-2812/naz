import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { copy } from '../data/copy'
import { useMusic } from '../hooks/useMusic'
import { fire } from '../lib/confetti'
import { sfx } from '../lib/sfx'
import Billi from './Billi'
import { Blossom, Bow, Heart, Paw, Scallop, Scribble, Sparkle, Star } from './doodles'
import LoveHeartCard from './LoveHeartCard'
import PasswordScreen from './PasswordScreen'

type Phase = 'closed' | 'lifting'
type GateStep = 'heart' | 'password'

interface Bit {
  Comp: typeof Heart
  top: string
  left: string
  w: string
  rot: number
  delay: string
}

const bits: Bit[] = [
  { Comp: Heart, top: '8%', left: '8%', w: '2.6rem', rot: -14, delay: '0s' },
  { Comp: Star, top: '12%', left: '78%', w: '2.2rem', rot: 12, delay: '-2s' },
  { Comp: Paw, top: '70%', left: '6%', w: '2.4rem', rot: -20, delay: '-1s' },
  { Comp: Blossom, top: '78%', left: '82%', w: '3rem', rot: 10, delay: '-3s' },
  { Comp: Sparkle, top: '30%', left: '90%', w: '1.6rem', rot: 0, delay: '-4s' },
  { Comp: Bow, top: '6%', left: '44%', w: '3.2rem', rot: -8, delay: '-5s' },
  { Comp: Heart, top: '88%', left: '40%', w: '1.8rem', rot: 16, delay: '-2.5s' },
  { Comp: Sparkle, top: '44%', left: '4%', w: '1.5rem', rot: 0, delay: '-1.5s' },
  { Comp: Paw, top: '22%', left: '24%', w: '1.6rem', rot: 24, delay: '-3.5s' },
]

/** Fullscreen startup gate: Love Heart forms, then transitions to a protected password screen (0909). */
export default function Gate({ onOpened }: { onOpened: () => void }) {
  const music = useMusic()
  const musicRef = useRef(music)
  musicRef.current = music

  const [step, setStep] = useState<GateStep>('heart')
  const [phase, setPhase] = useState<Phase>('closed')
  const openedRef = useRef(false)
  const onOpenedRef = useRef(onOpened)
  onOpenedRef.current = onOpened

  // Called when the heart finishes its drawing animation -> transitions to password page
  const handleHeartDone = useCallback((): void => {
    window.setTimeout(() => {
      setStep('password')
    }, 700)
  }, [])

  // Called ONLY when the user enters the correct password '0909'
  const handlePasswordSuccess = useCallback((): void => {
    if (openedRef.current) return
    openedRef.current = true

    try {
      void musicRef.current.start()
    } catch (e) {
      void e
    }

    try {
      sfx.chime()
    } catch (e) {
      void e
    }

    try {
      void fire.petals({ x: 0.5, y: 0.55 })
      void fire.hearts({ x: 0.5, y: 0.55 }, 25)
    } catch (e) {
      void e
    }

    setPhase('lifting')

    window.setTimeout(() => {
      onOpenedRef.current()
    }, 850)
  }, [])

  return (
    <motion.section
      aria-label="welcome gate"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-blush overflow-y-auto overflow-x-hidden select-none px-4 py-5 sm:py-7"
      initial={false}
      animate={{ y: phase === 'lifting' ? '-112%' : '0%' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Floating background decorative stickers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {bits.map(({ Comp, top, left, w, rot, delay }, i) => (
          <div
            key={i}
            className="absolute animate-floaty"
            style={{ top, left, width: w, animationDelay: delay, ['--r' as string]: `${rot}deg` }}
          >
            <div className="die-cut-sm">
              <Comp className="block w-full" />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'heart' ? (
          <motion.div
            key="heart-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className="relative flex min-h-full w-full flex-col items-center justify-between"
          >
            {/* Top Header: Billi & "psst. billi." */}
            <div className="relative z-20 flex flex-col items-center text-center pt-2 sm:pt-4">
              <p className="relative font-hand text-[clamp(2.1rem,6vw,2.8rem)] font-bold leading-none text-cocoa">
                <span className="relative inline-block px-3 py-1">
                  {copy.gate.kicker}
                  <Scribble className="pointer-events-none absolute -inset-x-2 -inset-y-1 h-[calc(100%+10px)] w-[calc(100%+12px)]" delay={0.6} />
                </span>
              </p>
              <Billi className="w-14 h-14 sm:w-16 sm:h-16 -mt-1 opacity-90" />
            </div>

            {/* Center: Grand borderless animated Love Heart */}
            <div className="relative z-10 my-auto flex w-full max-w-[860px] items-center justify-center px-2">
              <LoveHeartCard
                bare={true}
                maxWidth={860}
                autoStart={true}
                durationMs={5000}
                onDone={handleHeartDone}
              />
            </div>

            {/* Bottom Subtitle / sound hint */}
            <div className="relative z-20 pb-2 text-center">
              <p className="font-hand text-[1.3rem] leading-tight text-cocoa-soft opacity-80">
                {copy.gate.small}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="password-step"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto flex min-h-full w-full flex-col items-center justify-center py-6"
          >
            <PasswordScreen onSuccess={handlePasswordSuccess} />
          </motion.div>
        )}
      </AnimatePresence>

      <Scallop className="pointer-events-none absolute left-0 top-full" fill="#FFE3EC" />
    </motion.section>
  )
}
