import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { Star, Tape } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const COMPLIMENTS = [
  'The way your laughter instantly turns my bad days around.',
  'How you pretend to be mad but end up smiling within two seconds.',
  'The cute way you say "hmmm" when thinking about what to eat.',
  'Your voice notes that I secretly replay more than once.',
  'How your eyes light up whenever you talk about things you love.',
  'That adorable little ungrateful potato face you make.',
  'How effortlessly you make me feel calm just by existing.',
  'The sweet way you care, even when you try to act tough.',
  'Your sense of humor and how we laugh at the silliest inside jokes.',
  'How pretty you look without even trying for a second.',
  'The warmth you bring to my life every single day since 9 September.',
  'How you make hours feel like minutes whenever we talk.',
  'Your adorable stubbornness that I wouldn’t trade for the world.',
  'The way you type in all caps when you get excited about something.',
  'How safe and peaceful my heart feels whenever I am with you.',
  'The little sleepy texts you send before going to bed.',
  'How genuine, kind, and pure your heart is.',
  'The fact that out of 8 billion people, I got to meet you.',
  'How you look cute even when you are giving me attitude.',
  'The way my phone lighting up with your name gives me butterflies.',
  'How you deserve every ounce of love, sweetness, and happiness today, jannnnn.',
]

export default function LoveJar() {
  const [openedCount, setOpenedCount] = useState(0)
  const [currentStar, setCurrentStar] = useState<string | null>(null)
  const [jarBounce, setJarBounce] = useState(false)

  const pullStar = () => {
    sfx.pop()
    haptics.heart()
    setJarBounce(true)
    setTimeout(() => setJarBounce(false), 400)

    const random = COMPLIMENTS[openedCount % COMPLIMENTS.length] ?? COMPLIMENTS[0]!
    setCurrentStar(random)
    setOpenedCount((c) => c + 1)
    void fire.hearts({ x: 0.5, y: 0.55 }, 12)
  }

  return (
    <section id="jar" className="relative px-[var(--gutter)] py-20 overflow-hidden">
      <div className="relative mx-auto max-w-[800px]">
        <Reveal className="text-center">
          <SectionHeading text="infinite origami love jar" hand="love jar" />
          <p className="sub-hand mt-2">
            tap the jar to catch a glowing paper star with a sweet truth inside ♡
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="paper relative mx-auto max-w-[580px] rounded-blob border-[3px] border-cocoa bg-gradient-to-b from-milk to-blush p-6 sm:p-10 shadow-lg flex flex-col items-center">
            <Tape color="butter" className="absolute -top-3 left-[16%] rotate-[-4deg]" />
            <Tape color="petal" className="absolute -top-3 right-[16%] rotate-[5deg]" />

            {/* Clickable Glass Jar Graphic */}
            <motion.button
              type="button"
              onClick={pullStar}
              data-cursor="open"
              animate={jarBounce ? { scale: [1, 1.12, 0.94, 1.05, 1], rotate: [-2, 2, -1, 1, 0] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col items-center focus:outline-none"
            >
              {/* Wooden Cork Lid */}
              <div className="h-6 w-28 rounded-t-lg border-[3px] border-cocoa bg-[#deb887] shadow-sm" />
              {/* Jar Neck */}
              <div className="h-4 w-32 border-x-[3px] border-cocoa bg-white/40" />
              {/* Glass Body */}
              <div className="relative h-56 w-52 rounded-3xl border-[3px] border-cocoa bg-gradient-to-b from-white/60 to-blush/80 backdrop-blur-xs shadow-inner flex flex-col items-center justify-center overflow-hidden">
                {/* Floating Origami Stars inside */}
                <div className="flex flex-wrap justify-center gap-2 px-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-2, 3, -2],
                        rotate: [i * 30, i * 30 + 10, i * 30],
                      }}
                      transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
                      className="text-2xl select-none"
                    >
                      {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '🌟' : '✨'}
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-4 font-hand text-sm font-bold text-cocoa/70 bg-white/70 px-3 py-0.5 rounded-full border border-cocoa/20">
                  tap me! ♡
                </div>
              </div>
            </motion.button>

            {/* Counter */}
            <p className="font-hand text-base text-cocoa-soft mt-4">
              {openedCount === 0
                ? 'the jar is filled with infinite love notes'
                : `you’ve caught ${openedCount} origami stars from Mr. Naz!`}
            </p>

            {/* Star Pop Modal */}
            <AnimatePresence>
              {currentStar && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="mt-6 w-full rounded-2xl border-2 border-dashed border-rose/60 bg-white/95 p-5 text-center shadow-md"
                >
                  <div className="flex items-center justify-center gap-1.5 text-rose mb-1">
                    <Star className="w-5 h-5 fill-butter" />
                    <span className="font-hand text-lg font-bold">Origami Star #{openedCount}</span>
                    <Star className="w-5 h-5 fill-butter" />
                  </div>
                  <p className="font-hand text-xl font-bold text-cocoa leading-relaxed">
                    “{currentStar}”
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light()
                      setCurrentStar(null)
                    }}
                    className="font-hand text-sm text-cocoa-soft underline mt-2 hover:text-cocoa"
                  >
                    keep reading more stars ♡
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
