import { motion } from 'framer-motion'
import { useState } from 'react'
import { config } from '../data/config'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { toast } from '../lib/toast'
import { scrollToTop } from '../hooks/useLenis'
import Billi from './Billi'
import { CakeSlice, Heart, Sparkle, Star } from './doodles'
import Reveal from './Reveal'

export default function LastLineGoodbye() {
  const [hugged, setHugged] = useState(false)

  const sendHug = (e: React.MouseEvent) => {
    sfx.chime()
    haptics.heart()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    void fire.hearts(
      {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      32
    )
    toast('hug received! sending 1,000,000 kisses back to you ♡')
    setHugged(true)
  }

  return (
    <section
      id="goodbye"
      aria-label="Last-line goodbye"
      className="relative min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center px-[var(--gutter)] py-20 text-center overflow-hidden bg-[#241620] text-[#FFFDF8] select-none"
    >
      {/* Quiet Ambient Starlight in the background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden="true">
        <Star className="absolute left-[10%] top-[15%] w-7 text-butter animate-pulse" />
        <Sparkle className="absolute right-[12%] top-[20%] w-8 text-rose" fill="#FFEBA8" />
        <Heart className="absolute left-[15%] bottom-[20%] w-8 text-rose opacity-60" />
        <Star className="absolute right-[18%] bottom-[25%] w-6 text-butter" />
        <Sparkle className="absolute left-[50%] top-[8%] w-5 text-butter opacity-50" fill="#FFEBA8" />
      </div>

      <div className="relative z-10 mx-auto max-w-[680px] flex flex-col items-center">
        {/* Sleeping Billi curled beside a slice of cake */}
        <Reveal>
          <div className="relative mb-6 flex items-end justify-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="relative"
            >
              <CakeSlice className="w-24 sm:w-28 drop-shadow-[0_8px_20px_rgba(255,181,205,0.25)]" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-butter shadow-[0_0_12px_#FFEBA8] animate-pulse" />
            </motion.div>

            <motion.div
              className="relative -ml-4 cursor-pointer"
              data-cursor="pop"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sfx.pop()
                haptics.light()
                toast('shhh, billi is full of cake and dreaming of you ♡ 🍰🐾')
              }}
            >
              <Billi className="w-20 sm:w-24" />
              <div className="pointer-events-none absolute -right-2 -top-3 flex items-end font-hand text-xl text-rose/80">
                <span className="animate-zzz">z</span>
                <span className="animate-zzz [animation-delay:0.8s]">z</span>
                <span className="animate-zzz [animation-delay:1.6s]">z</span>
              </div>
            </motion.div>
          </div>
        </Reveal>

        {/* The requested iconic last line */}
        <Reveal delay={0.1}>
          <motion.div
            initial={{ scale: 0.96 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-3"
          >
            <h2 className="font-hand text-[clamp(2.5rem,8.5vw,4.4rem)] font-bold tracking-tight text-[#FFFDF8] leading-[1.05] drop-shadow-sm">
              “ok that’s everything. go eat cake.”
            </h2>

            <p className="font-hand text-[clamp(1.4rem,4.5vw,1.9rem)] text-[#FFCFE0] italic font-normal leading-tight">
              (and remember to save the sweetest slice for me ♡)
            </p>
          </motion.div>
        </Reveal>

        {/* Gentle Closing Note */}
        <Reveal delay={0.2} className="mt-6">
          <p className="font-ui text-sm sm:text-base text-[#FFFDF8]/70 max-w-[42ch] mx-auto leading-relaxed">
            Every pixel, memory, letter, and note here was crafted with pure love. Thank you for existing, Ms. Naz.
          </p>
        </Reveal>

        {/* Sweet Final Actions */}
        <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <motion.button
            type="button"
            data-cursor="pop"
            onClick={sendHug}
            whileHover={{ scale: 1.06, rotate: -1.5 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#FF8FB5] bg-[#FF8FB5]/20 px-5 py-2.5 font-hand text-lg sm:text-xl font-bold text-[#FFFDF8] shadow-md backdrop-blur-sm transition-colors hover:bg-[#FF8FB5]/30"
          >
            <Heart className="w-5 h-5 text-rose inline-block" />
            <span>{hugged ? 'hug sent! send another? 💖' : 'send a hug to him 💌'}</span>
          </motion.button>

          <motion.button
            type="button"
            data-cursor="open"
            onClick={scrollToTop}
            whileHover={{ scale: 1.06, rotate: 1.5 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-hand text-lg sm:text-xl font-bold text-[#FFFDF8]/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <span>back to the start 🎈</span>
          </motion.button>
        </Reveal>

        {/* Final signature stamp */}
        <div className="mt-12 inline-flex items-center gap-2 border-t border-white/10 pt-4 font-hand text-sm text-[#FFFDF8]/50">
          <span>forever yours, {config.myName}</span>
          <span>•</span>
          <span>happy birthday, jannnnn ♡</span>
        </div>
      </div>
    </section>
  )
}
