import { motion } from 'framer-motion'
import { Sparkle, Star } from './doodles'

interface Props {
  period: 'midnight' | 'dawn' | 'day' | 'sunset' | 'night'
}

export default function CelestialSky({ period }: Props) {
  const isNightTime = period === 'midnight' || period === 'night'
  const isSunset = period === 'sunset'

  if (isNightTime) {
    return (
      <div className="pointer-events-none absolute top-10 right-[6%] z-5 select-none">
        {/* Soft Ambient Moon Halo */}
        <div className="absolute -inset-4 rounded-full bg-indigo-300/20 blur-xl animate-pulse" />

        {/* Sleeping Kawaii Crescent Moon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [-2, 3, -2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,235,168,0.5)]">
            <defs>
              <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="60%" stopColor="#FFEBA8" />
                <stop offset="100%" stopColor="#FBCFE8" />
              </linearGradient>
            </defs>

            {/* Crescent Moon Path */}
            <path
              d="M 68 12 A 42 42 0 1 0 88 78 A 38 38 0 0 1 68 12 Z"
              fill="url(#moonGrad)"
              stroke="#5B2A3E"
              strokeWidth="2.5"
            />

            {/* Sleeping Face on Moon */}
            {/* Closed Smiling Eyelash */}
            <path
              d="M 44 48 Q 48 53 52 48"
              fill="none"
              stroke="#5B2A3E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Blushing Cheek */}
            <ellipse cx="40" cy="54" rx="4" ry="2.5" fill="#FF8FB5" opacity="0.8" />
            {/* Cute Sleepy Z */}
            <text x="72" y="32" fill="#FFEBA8" fontSize="14" fontFamily="cursive" opacity="0.9" className="animate-pulse">
              z
            </text>
            <text x="82" y="22" fill="#FFEBA8" fontSize="10" fontFamily="cursive" opacity="0.75" className="animate-pulse">
              z
            </text>
          </svg>

          {/* Twinkling Star Buddies */}
          <Sparkle className="absolute -left-2 top-2 w-5 text-butter animate-pulse" fill="#ffeba8" />
          <Star className="absolute right-0 -bottom-1 w-6 text-petal rotate-12" />
        </motion.div>
      </div>
    )
  }

  if (isSunset) {
    return (
      <div className="pointer-events-none absolute top-12 right-[8%] z-5 select-none">
        {/* Golden Hour Sunset Orb */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-orange-400/30 to-rose/30 blur-2xl animate-pulse" />

        <motion.div
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-24 h-24 sm:w-28 sm:h-28"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_16px_rgba(251,146,60,0.6)]">
            <defs>
              <radialGradient id="sunDuskGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF7ED" />
                <stop offset="40%" stopColor="#FDBA74" />
                <stop offset="85%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#F472B6" />
              </radialGradient>
            </defs>

            {/* Glowing Sunset Disc */}
            <circle cx="50" cy="50" r="38" fill="url(#sunDuskGrad)" stroke="#5B2A3E" strokeWidth="2.5" />

            {/* Sunset Horizon Line / Eyelashes */}
            <path
              d="M 38 46 Q 42 41 46 46"
              fill="none"
              stroke="#5B2A3E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 54 46 Q 58 41 62 46"
              fill="none"
              stroke="#5B2A3E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <ellipse cx="34" cy="52" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.6" />
            <ellipse cx="66" cy="52" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.6" />
            {/* Gentle Smile */}
            <path
              d="M 46 54 Q 50 58 54 54"
              fill="none"
              stroke="#5B2A3E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <Sparkle className="absolute -left-3 top-3 w-6 text-butter" fill="#ffeba8" />
        </motion.div>
      </div>
    )
  }

  // Daytime / Dawn Sun
  return (
    <div className="pointer-events-none absolute top-12 right-[8%] z-5 select-none">
      {/* Soft Sunny Aura */}
      <div className="absolute -inset-4 rounded-full bg-amber-300/25 blur-xl animate-pulse" />

      <motion.div
        animate={{
          y: [0, -7, 0],
          rotate: [0, 4, -4, 0],
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-22 h-22 sm:w-26 sm:h-26"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,235,168,0.7)]">
          <defs>
            <radialGradient id="sunDayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FFF9C4" />
              <stop offset="85%" stopColor="#FFE082" />
              <stop offset="100%" stopColor="#FFB74D" />
            </radialGradient>
          </defs>

          {/* Sun Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="8"
              x2="50"
              y2="16"
              stroke="#FFB74D"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}

          {/* Kawaii Sun Disc */}
          <circle cx="50" cy="50" r="32" fill="url(#sunDayGrad)" stroke="#5B2A3E" strokeWidth="2.5" />

          {/* Happy Eyes */}
          <ellipse cx="42" cy="46" rx="2.5" ry="3.5" fill="#5B2A3E" />
          <ellipse cx="58" cy="46" rx="2.5" ry="3.5" fill="#5B2A3E" />
          <circle cx="43" cy="45" r="1" fill="#FFFFFF" />
          <circle cx="59" cy="45" r="1" fill="#FFFFFF" />

          {/* Blushing Cheeks */}
          <ellipse cx="37" cy="52" rx="4" ry="2.2" fill="#FF8FB5" opacity="0.85" />
          <ellipse cx="63" cy="52" rx="4" ry="2.2" fill="#FF8FB5" opacity="0.85" />

          {/* Sweet Smile */}
          <path
            d="M 47 52 Q 50 56 53 52"
            fill="none"
            stroke="#5B2A3E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        <Sparkle className="absolute -left-2 top-0 w-5 text-butter" fill="#ffeba8" />
      </motion.div>
    </div>
  )
}
