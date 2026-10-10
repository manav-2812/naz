import { motion } from 'framer-motion'
import { config } from '../data/config'
import { copy } from '../data/copy'
import { scrollToTop } from '../hooks/useLenis'
import Billi from './Billi'
import { Heart, Paw, WavyDivider } from './doodles'

export default function Footer() {
  return (
    <footer className="relative px-[var(--gutter)] pt-10" style={{ paddingBottom: 'calc(var(--safe-bottom) + 7.5rem)' }}>
      <WavyDivider className="mx-auto block h-8 w-full max-w-[1100px]" />
      <div className="mx-auto mt-10 flex max-w-[760px] flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative">
          <p className="max-w-[30ch] font-hand text-[clamp(1.7rem,6vw,2.2rem)] leading-[1.1] text-cocoa">{copy.footer.made}</p>
          <p className="mt-3 flex items-center gap-2 font-display text-xl font-bold italic text-rosedeep">
            {config.myName}
            <Heart className="inline-block w-6 animate-beat" />
          </p>
        </div>
        <div className="flex items-end gap-5 self-end">
          <Billi className="w-[84px]" />
          <motion.button
            type="button"
            data-cursor="open"
            onClick={scrollToTop}
            aria-label={copy.music.backToTop}
            whileHover={{ y: -4, rotate: -6 }}
            whileTap={{ scaleX: 1.1, scaleY: 0.86 }}
            transition={{ type: 'spring', stiffness: 360, damping: 14 }}
            className="flex min-h-[64px] min-w-[64px] flex-col items-center gap-0.5 border-0 bg-transparent"
          >
            <span className="die-cut-sm block">
              <Paw className="w-12" />
            </span>
            <span className="font-hand text-[1.3rem] leading-none text-cocoa">{copy.music.backToTop}</span>
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
