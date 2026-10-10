import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { generateCandles, getBirthdayInfo } from '../lib/birthday'
import Billi from './Billi'
import { Blossom, Heart, Sparkle, Tape } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function BirthdayCake() {
  const bInfo = getBirthdayInfo()
  const candles = useMemo(() => generateCandles(bInfo.targetAge), [bInfo.targetAge])
  const candleCount = candles.length

  const [blown, setBlown] = useState<Record<number, boolean>>({})
  const [wishGranted, setWishGranted] = useState(false)

  const blownCount = Object.values(blown).filter(Boolean).length
  const allBlown = blownCount === candleCount

  const toggleCandle = (id: number) => {
    if (blown[id]) {
      // Relight candle
      sfx.ignite()
      const next = { ...blown, [id]: false }
      setBlown(next)
      if (allBlown) {
        setWishGranted(false)
      }
    } else {
      // Blow candle
      haptics.light()
      sfx.blow()
      const next = { ...blown, [id]: true }
      setBlown(next)

      if (Object.values(next).filter(Boolean).length === candleCount && !wishGranted) {
        celebrateWish()
      }
    }
  }

  const blowAll = () => {
    if (allBlown) {
      // Relight all
      haptics.light()
      setBlown({})
      setWishGranted(false)
      sfx.ignite()
      return
    }

    const allMap: Record<number, boolean> = {}
    for (let i = 0; i < candleCount; i++) allMap[i] = true
    setBlown(allMap)
    sfx.blow()
    celebrateWish()
  }

  const celebrateWish = () => {
    haptics.celebrate()
    setWishGranted(true)
    sfx.chime()
    void fire.hearts({ x: 0.5, y: 0.5 }, 30)
    void fire.petals({ x: 0.5, y: 0.55 })
  }

  return (
    <section id="cake" className="relative px-[var(--gutter)] py-20 overflow-hidden select-none">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Sparkle className="absolute left-[7%] top-[14%] w-8 opacity-75" fill="#FFEBA8" />
        <Blossom className="absolute right-[6%] top-[18%] w-10 rotate-12 opacity-80" />
        <Heart className="absolute bottom-[8%] left-[6%] w-8 rotate-[-15deg] opacity-70" />
      </div>

      <div className="relative mx-auto max-w-[860px]">
        <Reveal className="text-center">
          <SectionHeading
            text={`make an ${bInfo.targetAgeOrdinal} birthday wish`}
            hand="birthday wish"
          />
          <p className="sub-hand mt-2">
            {`${candleCount} candles for ${candleCount} years of you. tap any candle to blow it out! ♡`}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <div className="paper relative mx-auto max-w-[680px] rounded-blob border-[3px] border-cocoa bg-gradient-to-b from-milk to-blush p-4 sm:p-9 shadow-xl flex flex-col items-center">
            <Tape color="butter" className="absolute -top-3 left-[15%] rotate-[-4deg]" />
            <Tape color="petal" className="absolute -top-3 right-[15%] rotate-[5deg]" />

            {/* Cake Scene Container */}
            <div className="relative w-full max-w-[520px] flex flex-col items-center pt-8 pb-4">
              {/* Billi with Party Cone Hat */}
              <div className="absolute left-1 sm:left-4 -top-3 z-30 flex flex-col items-center">
                <div className="relative z-10 -mb-2 flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-butter shadow-xs" />
                  <div
                    className="h-7 w-6 bg-gradient-to-b from-rose to-petal"
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                  />
                </div>
                <Billi className="w-16 h-16 sm:w-20 sm:h-20" />
                <span className="font-hand text-xs font-bold text-cocoa bg-white/85 px-2 py-0.5 rounded-full border border-cocoa/20 -mt-1 shadow-xs">
                  billi ♡
                </span>
              </div>

              {/* TOP TIER CANDLES */}
              <div className="relative z-30 h-13 w-48 sm:w-56 flex justify-around px-1 mb-[-6px]">
                {candles.filter((c) => c.tier === 'top').map((c) => (
                  <Candle
                    key={c.id}
                    id={c.id}
                    blown={Boolean(blown[c.id])}
                    color={c.color}
                    onClick={() => toggleCandle(c.id)}
                  />
                ))}
              </div>

              {/* TIER 1: TOP TIER */}
              <div className="relative z-20 w-52 sm:w-60 h-20 rounded-t-3xl border-[3px] border-cocoa bg-[#ffcfe0] shadow-sm flex flex-col items-center justify-between pt-1 overflow-hidden">
                {/* Vanilla Cream Drips */}
                <svg className="w-full h-5 text-white/95" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0 0 H100 V8 Q92 18 84 9 Q76 2 68 11 Q58 20 48 8 Q38 17 28 8 Q18 19 8 7 Q4 2 0 6 Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Cake Badge: Age Topper */}
                <div className="relative -mt-2 flex items-center justify-center gap-1.5 rounded-full bg-rose/90 px-3.5 py-0.5 border border-white text-white shadow-xs">
                  <Sparkle className="w-3 h-3 text-butter" fill="#ffeba8" />
                  <span className="font-hand text-lg font-bold leading-none">{bInfo.targetAge} ♡</span>
                  <Sparkle className="w-3 h-3 text-butter" fill="#ffeba8" />
                </div>

                {/* Frosting Base Dots */}
                <div className="w-full flex justify-around px-2 pb-1 text-white/90 text-[10px]">
                  ● ● ● ● ● ● ●
                </div>
              </div>

              {/* TIER 2: MIDDLE TIER */}
              <div className="relative z-15 -mt-1 w-[310px] sm:w-[380px]">
                {/* Mid Tier Shoulder Candles */}
                <div className="absolute -top-[42px] inset-x-0 h-14 flex justify-between px-3 sm:px-5 pointer-events-none z-30">
                  {/* Left Shoulder Candles */}
                  <div className="flex gap-2 sm:gap-3 pointer-events-auto">
                    {candles.filter((c) => c.tier === 'mid-left').map((c) => (
                      <Candle
                        key={c.id}
                        id={c.id}
                        blown={Boolean(blown[c.id])}
                        color={c.color}
                        onClick={() => toggleCandle(c.id)}
                      />
                    ))}
                  </div>

                  {/* Right Shoulder Candles */}
                  <div className="flex gap-2 sm:gap-3 pointer-events-auto">
                    {candles.filter((c) => c.tier === 'mid-right').map((c) => (
                      <Candle
                        key={c.id}
                        id={c.id}
                        blown={Boolean(blown[c.id])}
                        color={c.color}
                        onClick={() => toggleCandle(c.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Mid Tier Body */}
                <div className="relative w-full h-24 rounded-t-3xl border-[3px] border-cocoa bg-[#ffb5cd] shadow-sm flex flex-col items-center justify-between pt-1 overflow-hidden">
                  {/* Whipped Cream Drips */}
                  <svg className="w-full h-6 text-white/95" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d="M0 0 H100 V9 Q90 20 80 8 Q70 19 60 7 Q50 20 40 8 Q30 18 20 8 Q10 19 0 7 Z"
                      fill="currentColor"
                    />
                  </svg>

                  {/* Cake Inscription: "Ms. Naz" */}
                  <div className="relative -mt-1 flex items-center justify-center gap-2">
                    <span className="font-hand text-2xl sm:text-3xl font-extrabold text-cocoa tracking-wide drop-shadow-xs">
                      Ms. Naz
                    </span>
                  </div>

                  {/* Pearl Border */}
                  <div className="w-full flex justify-around px-3 pb-1 text-white/90 text-xs">
                    ● ● ● ● ● ● ● ● ● ●
                  </div>
                </div>
              </div>

              {/* TIER 3: BOTTOM BASE TIER */}
              <div className="relative z-10 -mt-1 w-[370px] sm:w-[460px]">
                {/* Bottom Tier Shoulder Candles */}
                <div className="absolute -top-[42px] inset-x-0 h-14 flex justify-between px-3 sm:px-5 pointer-events-none z-30">
                  {/* Left Shoulder Candles */}
                  <div className="flex gap-2 sm:gap-3 pointer-events-auto">
                    {candles.filter((c) => c.tier === 'bot-left').map((c) => (
                      <Candle
                        key={c.id}
                        id={c.id}
                        blown={Boolean(blown[c.id])}
                        color={c.color}
                        onClick={() => toggleCandle(c.id)}
                      />
                    ))}
                  </div>

                  {/* Right Shoulder Candles */}
                  <div className="flex gap-2 sm:gap-3 pointer-events-auto">
                    {candles.filter((c) => c.tier === 'bot-right').map((c) => (
                      <Candle
                        key={c.id}
                        id={c.id}
                        blown={Boolean(blown[c.id])}
                        color={c.color}
                        onClick={() => toggleCandle(c.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Tier Body */}
                <div className="relative w-full h-26 rounded-t-3xl border-[3px] border-cocoa bg-[#ffa1c1] shadow-md flex flex-col items-center justify-between pt-1 overflow-hidden">
                  {/* Thick Luscious Glaze Drips */}
                  <svg className="w-full h-7 text-white/95" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d="M0 0 H100 V10 Q92 20 84 9 Q75 22 66 8 Q56 21 46 8 Q36 21 26 8 Q16 22 6 9 Q3 4 0 7 Z"
                      fill="currentColor"
                    />
                  </svg>

                  {/* Strawberry Sprinkles & Ribbon Band: "happy birthday, jannnnn" */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <span className="text-xl select-none">🍓</span>
                    <span className="font-hand text-xl sm:text-2xl font-bold text-cocoa bg-white/90 px-5 py-0.5 rounded-full border border-cocoa/20 shadow-xs tracking-wide">
                      happy birthday, jannnnn
                    </span>
                    <span className="text-xl select-none">🍓</span>
                  </div>

                  {/* Sprinkles decoration */}
                  <div className="w-full flex justify-around px-4 pb-1 text-white text-xs">
                    ★ ● ★ ● ★ ● ★ ● ★ ● ★
                  </div>
                </div>
              </div>

              {/* PORCELAIN PEDESTAL CAKE STAND */}
              <div className="relative z-0 -mt-1 flex flex-col items-center w-full">
                {/* Round Plate */}
                <div className="h-6 w-[390px] sm:w-[490px] rounded-full border-[3px] border-cocoa bg-milk shadow-md flex items-center justify-between px-6" />
                {/* Pedestal Stem */}
                <div className="h-7 w-24 border-x-[3px] border-cocoa bg-[#ffe3ec] shadow-inner" />
                {/* Pedestal Base */}
                <div className="h-5 w-48 rounded-t-full border-[3px] border-cocoa bg-milk shadow-md" />
              </div>
            </div>

            {/* ACTION BUTTON & STATUS */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <motion.button
                type="button"
                data-cursor="open"
                onClick={blowAll}
                className="btn-sticker px-8 sm:px-10 py-3 text-xl font-hand shadow-md flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 360, damping: 14 }}
              >
                <span>{allBlown ? `🎂 light all ${candleCount} candles again` : `✨ blow all ${candleCount} candles & make a wish`}</span>
              </motion.button>
              <p className="font-hand text-base text-cocoa-soft text-center">
                {allBlown
                  ? '✨ all wishes are locked in the stars! ♡'
                  : `${candleCount - blownCount} candles burning (tap any candle to blow it out!)`}
              </p>
            </div>

            {/* GORGEOUS WISH SCROLL REVEAL */}
            <AnimatePresence>
              {wishGranted && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="paper relative mt-6 w-full max-w-[560px] rounded-2xl border-[3px] border-cocoa bg-gradient-to-b from-white via-milk to-blush/60 p-6 sm:p-7 text-center shadow-lg"
                >
                  <Tape color="butter" className="absolute -top-3 left-[12%] rotate-[-4deg]" />
                  <Tape color="petal" className="absolute -top-3 right-[12%] rotate-[5deg]" />

                  {/* Sparkle Header */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkle className="w-5 h-5 text-rose" fill="#f2689a" />
                    <h4 className="font-hand text-2xl sm:text-3xl font-bold text-cocoa">
                      Your {bInfo.targetAgeOrdinal} Birthday Wish is Locked
                    </h4>
                    <Sparkle className="w-5 h-5 text-rose" fill="#f2689a" />
                  </div>

                  <p className="font-hand text-lg sm:text-xl text-cocoa-soft leading-relaxed px-2">
                    “May every single secret wish you whisper today come true, Ms. Naz. You bring so much sweetness,
                    laughter, and light to my world. Thank you for existing and being you. Happy {bInfo.targetAgeOrdinal} Birthday, my favorite potato.” ♡
                  </p>

                  <div className="mt-4 flex justify-center">
                    <span className="font-hand text-sm font-bold text-rose uppercase tracking-wider bg-rose/10 border border-rose/30 px-3.5 py-1 rounded-full">
                      ✓ sent with way too much love from Mr. Naz
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Individual Striped Birthday Candle with Gentle Glowing Flame and 3-4s Billowing Smoke */
function Candle({
  id,
  blown,
  color,
  onClick,
}: {
  id: number
  blown: boolean
  color: 'pink' | 'butter' | 'berry'
  onClick: () => void
}) {
  const [smoking, setSmoking] = useState(false)
  const prevBlownRef = useRef(blown)

  useEffect(() => {
    if (blown && !prevBlownRef.current) {
      // Just blown out: trigger smoke animation for 3.5 seconds
      setSmoking(true)
      const timer = setTimeout(() => {
        setSmoking(false)
      }, 3500)
      return () => clearTimeout(timer)
    } else if (!blown) {
      setSmoking(false)
    }
    prevBlownRef.current = blown
  }, [blown])

  const stripeBg =
    color === 'pink'
      ? 'bg-gradient-to-b from-[#ff8fb5] to-[#f2689a]'
      : color === 'butter'
        ? 'bg-gradient-to-b from-[#ffdf73] to-[#f59e0b]'
        : 'bg-gradient-to-b from-[#ff5480] to-[#c92055]'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={blown ? 'Blown out (tap to relight! ♡)' : 'Tap to blow out candle! ♡'}
      data-cursor="pop"
      className="group relative flex flex-col items-center justify-end p-1.5 -m-1.5 min-w-[34px] sm:min-w-[38px] min-h-[62px] cursor-pointer touch-manipulation z-30 select-none focus:outline-none transition-transform hover:scale-115 active:scale-95"
    >
      {/* Top Flame / Billowing Smoke Container */}
      <div className="relative w-7 h-7 flex items-end justify-center mb-0.5">
        <AnimatePresence>
          {!blown && (
            <motion.div
              key="flame"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
            >
              <RealisticFlame id={id} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {blown && smoking && (
            <motion.div
              key="smoke"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <RealisticSmoke id={id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Candle Wick */}
      <div className="relative flex flex-col items-center">
        {blown && smoking && (
          /* Smoldering Ember on Wick Tip while smoking */
          <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#ff3b00] shadow-[0_0_5px_#ff3b00,0_0_8px_#ff7700] animate-pulse" />
        )}
        {blown && !smoking && (
          /* Cooled Wick Tip */
          <div className="absolute -top-0.5 w-1.5 h-1 rounded-full bg-neutral-700" />
        )}
        <div className={`h-2 w-0.5 ${blown ? 'bg-neutral-600' : 'bg-cocoa'}`} />
      </div>

      {/* Striped Candle Body */}
      <div
        className={`relative h-7 w-3 rounded-xs border border-cocoa/40 shadow-xs overflow-hidden ${stripeBg}`}
      >
        {/* Spiral candy stripes */}
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.7) 3px, rgba(255,255,255,0.7) 6px)',
          }}
        />
      </div>

      {/* Cream Frosting Dollop at base */}
      <div className="h-1.5 w-3.5 rounded-full bg-white/95 border border-cocoa/20 -mt-0.5 shadow-2xs" />
    </button>
  )
}

/** Soft, delicate, natural candle flame (gentle glow, not overly bright) */
function RealisticFlame({ id }: { id: number }) {
  const gradientId = `flame-grad-${id}`

  return (
    <div className="relative w-7 h-7 flex items-end justify-center pointer-events-none">
      {/* Flickering Flame Body with Framer Motion */}
      <motion.div
        animate={{
          scaleY: [1, 1.15, 0.95, 1.12, 0.98, 1],
          scaleX: [1, 0.94, 1.06, 0.96, 1.03, 1],
          rotate: [-3, 2, -2, 3, -1, 0],
          skewX: [-2, 1.5, -1, 2, 0],
        }}
        transition={{
          duration: 0.9 + ((id * 3) % 4) * 0.15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: (id * 0.13) % 0.6,
        }}
        className="relative origin-bottom filter drop-shadow-[0_0_2.5px_rgba(255,235,168,0.75)] drop-shadow-[0_0_5px_rgba(255,140,50,0.35)]"
      >
        <svg viewBox="0 0 24 34" className="w-3.5 h-5.5 overflow-visible">
          <defs>
            <radialGradient id={`${gradientId}-outer`} cx="50%" cy="65%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fff7a8" />
              <stop offset="65%" stopColor="#ff9f1c" />
              <stop offset="92%" stopColor="#f54b64" />
              <stop offset="100%" stopColor="#e91e63" />
            </radialGradient>
            <radialGradient id={`${gradientId}-inner`} cx="50%" cy="70%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#fffde7" />
              <stop offset="100%" stopColor="#ffe57f" />
            </radialGradient>
          </defs>

          {/* Outer gentle teardrop flame */}
          <path
            d="M 12 1 C 15.5 7, 21 14, 18.5 23 C 16.5 29, 7.5 29, 5.5 23 C 3 14, 8.5 7, 12 1 Z"
            fill={`url(#${gradientId}-outer)`}
          />

          {/* Inner soft white-hot core */}
          <path
            d="M 12 9 C 13.5 13, 16 17, 14.5 23 C 13.5 26, 10.5 26, 9.5 23 C 8 17, 10.5 13, 12 9 Z"
            fill={`url(#${gradientId}-inner)`}
          />

          {/* Subtle blue oxygen combustion crescent at base */}
          <ellipse cx="12" cy="25" rx="2.8" ry="1.3" fill="#60a5fa" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  )
}

/** Realistic billowing candle smoke wisps that disperse and stop after ~3.5 seconds */
function RealisticSmoke({ id }: { id: number }) {
  return (
    <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-12 h-16 pointer-events-none flex items-end justify-center overflow-visible">
      {/* Primary curling smoke trail */}
      <motion.svg
        viewBox="0 0 30 50"
        className="absolute bottom-0 w-8 h-13 text-slate-500/75 dark:text-slate-300/75 filter blur-[0.6px]"
        initial={{ opacity: 0, scale: 0.4, y: 0 }}
        animate={{
          opacity: [0, 0.85, 0.55, 0.15, 0],
          y: [0, -12, -26, -42, -56],
          x: [0, 3, -4, 3, -1],
          scale: [0.5, 1.0, 1.5, 2.0, 2.4],
        }}
        transition={{
          duration: 3.2,
          ease: 'easeOut',
          delay: (id * 0.08) % 0.25,
        }}
      >
        <path
          d="M 15 48 Q 11 36 19 26 T 12 12 T 17 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Secondary intertwining wisp */}
      <motion.svg
        viewBox="0 0 30 50"
        className="absolute bottom-0 w-7 h-12 text-slate-400/65 dark:text-slate-200/65 filter blur-[0.9px]"
        initial={{ opacity: 0, scale: 0.3, y: 0 }}
        animate={{
          opacity: [0, 0.75, 0.45, 0.12, 0],
          y: [2, -10, -22, -38, -50],
          x: [0, -4, 4, -2, 1],
          scale: [0.4, 0.9, 1.4, 1.9, 2.2],
        }}
        transition={{
          duration: 3.2,
          ease: 'easeOut',
          delay: 0.35 + ((id * 0.11) % 0.35),
        }}
      >
        <path
          d="M 15 48 Q 20 38 10 28 T 19 14 T 13 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Expanding soft cloud puff */}
      <motion.div
        className="absolute bottom-1 w-4 h-4 rounded-full bg-slate-400/40 dark:bg-slate-200/35 filter blur-[2px]"
        initial={{ opacity: 0, scale: 0.3, y: 0 }}
        animate={{
          opacity: [0, 0.7, 0.35, 0],
          scale: [0.3, 1.2, 2.2],
          y: [0, -16, -36],
          x: [0, 3, -2],
        }}
        transition={{
          duration: 2.8,
          ease: 'easeOut',
          delay: 0.15 + ((id * 0.09) % 0.25),
        }}
      />
    </div>
  )
}
