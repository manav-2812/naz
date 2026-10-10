import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from '../data/config'
import { copy, gameMessage } from '../data/copy'
import { clamp } from '../lib/device'
import { fire } from '../lib/confetti'
import { sfx } from '../lib/sfx'
import Billi from './Billi'
import { createEngine, type Engine } from './game/engine'
import { CakeSlice, Heart, Potato, Squiggle } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

type Phase = 'idle' | 'playing' | 'over'

function sizeFor(wrap: HTMLElement): { w: number; h: number } {
  const w = Math.min(wrap.clientWidth, 640)
  const h = clamp(Math.min(w * 1.25, window.innerHeight * 0.82), 280, 720)
  return { w, h }
}

export default function MilkcakeGame() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const bestRef = useRef(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState({ score: 0, best: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const engine = createEngine(canvas, {
      onEnd: (score) => {
        const isHighScore = score >= 5 || (score > 0 && score >= bestRef.current)
        bestRef.current = Math.max(bestRef.current, score)
        setResult({ score, best: bestRef.current })
        setPhase('over')
        if (isHighScore) {
          try {
            localStorage.setItem('naz_billi_party_hat', 'true')
          } catch (e) {
            void e
          }
          window.dispatchEvent(new CustomEvent('billi_party_hat', { detail: true }))
          sfx.chime()
          void fire.hearts({ x: 0.5, y: 0.5 }, 26)
        }
      },
    })
    engineRef.current = engine
    const fit = (): void => {
      const { w, h } = sizeFor(wrap)
      engine.resize(w, h)
    }
    fit()
    let t = 0
    const onResize = (): void => {
      window.clearTimeout(t)
      t = window.setTimeout(fit, 150)
    }
    const onVisibility = (): void => engine.setPaused(document.hidden)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    setPhase('playing')
    engineRef.current?.start()
    wrapRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section id="game" className="relative px-[var(--gutter)] pb-24 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Squiggle className="absolute right-[5%] top-[8%] w-24 rotate-[-8deg]" />
        <Heart className="absolute left-[4%] top-[30%] w-9 -rotate-12" />
        <Potato className="absolute bottom-[6%] right-[5%] w-16 rotate-12" />
      </div>
      <div className="relative mx-auto max-w-[760px]">
        <Reveal className="text-left lg:text-center">
          <SectionHeading text={copy.game.heading} hand={copy.game.headingHand} />
          <p className="sub-hand mt-3">{copy.game.rules}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div
            ref={wrapRef}
            tabIndex={0}
            data-cursor="catch"
            data-nowish
            aria-label={config.ui.gameCanvas}
            className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-blob border-[3px] border-cocoa bg-gradient-to-b from-milk to-blush shadow-lift"
          >
            <canvas ref={canvasRef} className="canvas-touch block" role="img" aria-label={config.ui.gameCanvas} />
            <AnimatePresence>
              {phase !== 'playing' && (
                <motion.div
                  key={phase}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(255,248,244,0.82)] p-6 text-center"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {phase === 'idle' ? (
                    <>
                      <CakeSlice className="w-24 animate-bob" />
                    </>
                  ) : (
                    <>
                      {/* If High Score: Billi wears party hat! */}
                      {result.score >= 5 || (result.score > 0 && result.score === result.best) ? (
                        <div className="relative flex flex-col items-center mb-1">
                          <Billi partyHat className="w-16 h-16 sm:w-20 sm:h-20" />
                          <span className="font-hand text-xs sm:text-sm font-bold text-rosedeep bg-rose/15 border border-rose/30 px-3 py-0.5 rounded-full mt-1 shadow-2xs">
                            🎉 HIGH SCORE! Billi put on her party hat! 🥳
                          </span>
                        </div>
                      ) : (
                        <p className="font-ui text-lg font-medium text-cocoa-soft">{config.ui.score}</p>
                      )}
                      <p className="display -mt-2 text-[4.4rem] font-extrabold italic leading-none text-rosedeep">{result.score}</p>
                      <p className="font-hand text-[1.8rem] leading-tight text-cocoa">{gameMessage(result.score)}</p>
                      <p className="font-ui text-base text-cocoa-soft">
                        {config.ui.best} {result.best}
                      </p>
                    </>
                  )}
                  <motion.button
                    type="button"
                    data-cursor="catch"
                    className="btn-sticker"
                    onClick={play}
                    whileHover={{ scale: 1.05, rotate: -1.5 }}
                    whileTap={{ scaleX: 1.08, scaleY: 0.88, y: 3 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 14 }}
                  >
                    {phase === 'idle' ? config.ui.start : config.ui.again}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
