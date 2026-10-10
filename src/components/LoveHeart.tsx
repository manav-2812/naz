import { motion } from 'framer-motion'
import { useRef } from 'react'
import { heartCopy } from '../data/heart'
import { Blossom, Heart, Paw, Sparkle } from './doodles'
import LoveHeartCard, { type LoveHeartCardRef } from './LoveHeartCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/**
 * "I love you, Ms. Naz" in twenty languages, packed into a heart.
 */
export default function LoveHeart() {
  const cardRef = useRef<LoveHeartCardRef>(null)

  return (
    <section id="heart" className="relative px-[var(--gutter)] pb-24 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Blossom className="absolute right-[4%] top-[2%] w-12 rotate-[14deg]" />
        <Sparkle className="absolute left-[6%] top-[12%] hidden w-8 sm:block" fill="#FFEBA8" />
        <Paw className="absolute bottom-[5%] left-[8%] w-9 rotate-[18deg] opacity-80" />
        <Heart className="absolute bottom-[8%] right-[5%] w-10 rotate-12" />
      </div>
      <div className="relative mx-auto max-w-[940px]">
        <Reveal className="text-left md:text-center">
          <SectionHeading text={heartCopy.heading} hand={heartCopy.headingHand} />
          <p className="sub-hand mt-3">{heartCopy.sub}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <LoveHeartCard ref={cardRef} />
          <div className="mt-8 flex justify-center">
            <motion.button
              type="button"
              data-cursor="pop"
              onClick={() => cardRef.current?.replay()}
              className="btn-sticker"
              whileHover={{ scale: 1.05, rotate: -1.5 }}
              whileTap={{ scaleX: 1.08, scaleY: 0.88, y: 3 }}
              transition={{ type: 'spring', stiffness: 360, damping: 14 }}
            >
              <Heart className="h-5 w-5" />
              {heartCopy.replay}
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
