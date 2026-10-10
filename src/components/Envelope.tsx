import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Heart, INK, WaxSeal } from './doodles'

interface Props {
  /** flap lifted and card peeking out */
  open: boolean
  /** wax seal broken */
  cracked: boolean
  className?: string
}

/** Pink envelope with a wax-heart seal, built from divs and svgs so the flap can really swing in 3D. */
export default function Envelope({ open, cracked, className }: Props) {
  const [flapBehind, setFlapBehind] = useState(false)

  useEffect(() => {
    if (!open) {
      setFlapBehind(false)
      return
    }
    const t = window.setTimeout(() => setFlapBehind(true), 330)
    return () => window.clearTimeout(t)
  }, [open])

  return (
    <div className={clsx('relative aspect-[8/5] w-full', className)} style={{ perspective: 1000 }}>
      <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="316" height="196" rx="12" fill="#FFCFE0" stroke={INK} strokeWidth="3" />
      </svg>

      <motion.div
        className="paper absolute left-[7%] right-[7%] top-[9%] z-[1] flex h-[82%] flex-col justify-center gap-[9%] rounded-[6px] px-[8%]"
        animate={{ y: open ? '-34%' : '0%' }}
        transition={{ type: 'spring', stiffness: 130, damping: 16, delay: open ? 0.25 : 0 }}
        aria-hidden="true"
      >
        <span className="block h-[3px] w-[70%] rounded bg-petal" />
        <span className="block h-[3px] w-[90%] rounded bg-petal" />
        <span className="block h-[3px] w-[55%] rounded bg-petal" />
        <Heart className="absolute bottom-[10%] right-[8%] w-[12%]" fill="#FFB5CD" />
      </motion.div>

      <svg viewBox="0 0 320 200" className="absolute inset-0 z-[2] h-full w-full overflow-visible" aria-hidden="true" focusable="false">
        <path
          d="M2 186V14C2 7 8 3 14 5L160 118 306 5c6-2 12 2 12 9V186c0 7-5 12-12 12H14c-7 0-12-5-12-12Z"
          fill="#FFB5CD"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M6 192 112 118M314 192 208 118" fill="none" stroke={INK} strokeWidth="2.400" strokeLinecap="round" opacity=".55" />
        <path d="M60 176c6-3 11-3 16 0M240 176c6-3 11-3 16 0" fill="none" stroke="#FFFDFB" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      </svg>

      <motion.svg
        viewBox="0 0 320 120"
        className="absolute left-0 top-0 h-[60%] w-full overflow-visible"
        style={{ transformOrigin: '50% 0%', zIndex: flapBehind ? 0 : 3 }}
        animate={{ rotateX: open ? -178 : 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M2 4H318L160 118Z" fill="#FF8FB5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M30 14 160 100 290 14" fill="none" stroke="#FFFDFB" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" opacity=".9" />
      </motion.svg>

      <motion.div
        className="absolute left-1/2 top-[59%] z-[4] w-[17%] -translate-x-1/2 -translate-y-1/2"
        animate={cracked ? { scale: [1, 1.18, 1], rotate: [0, -6, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WaxSeal cracked={cracked} />
      </motion.div>
    </div>
  )
}
