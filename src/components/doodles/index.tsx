import { motion } from 'framer-motion'
import { useId, type CSSProperties, type ReactNode } from 'react'
import { mulberry32, range } from '../../lib/seed'

export const INK = '#5B2A3E'

export interface DoodleProps {
  className?: string
  style?: CSSProperties
}

interface FillProps extends DoodleProps {
  fill?: string
  stroke?: string
}

const svgProps = { 'aria-hidden': true, focusable: false } as const

export function Heart({ className, style, fill = '#FF8FB5', stroke = INK }: FillProps) {
  return (
    <svg viewBox="0 0 64 60" className={className} style={style} {...svgProps}>
      <path
        d="M32 56C10 40 4 28 4 19 4 11 10 6 17 6c6 0 12 3 15 9 3-6 9-9 15-9 7 0 13 5 13 13 0 9-6 21-28 37Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M14 18c1-4 4-6 8-6" fill="none" stroke="#FFFDFB" strokeWidth="3" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

export function Star({ className, style, fill = '#FFEBA8', stroke = INK }: FillProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} {...svgProps}>
      <path
        d="M32 5l7.6 15.6 17.2 2.4-12.5 12 3 17.1L32 44.2 16.7 52.1l3-17.1L7.2 23l17.2-2.4Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ className, style, fill = '#FFFDFB', stroke = INK }: FillProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} {...svgProps}>
      <path
        d="M20 2C21.500 12 28 18.500 38 20 28 21.500 21.500 28 20 38 18.500 28 12 21.500 2 20 12 18.500 18.500 12 20 2Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Paw({ className, style, fill = '#FF8FB5', stroke = INK }: FillProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} {...svgProps}>
      <g fill={fill} stroke={stroke} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M32 31c-8 0-15 8-15 15 0 6 5 9 10 8 3-1 4-2 5-2s2 1 5 2c5 1 10-2 10-8 0-7-7-15-15-15Z" />
        <ellipse cx="12" cy="30" rx="6" ry="8" transform="rotate(-18 12 30)" />
        <ellipse cx="25" cy="17" rx="6" ry="8.500" transform="rotate(-6 25 17)" />
        <ellipse cx="39" cy="17" rx="6" ry="8.500" transform="rotate(6 39 17)" />
        <ellipse cx="52" cy="30" rx="6" ry="8" transform="rotate(18 52 30)" />
      </g>
    </svg>
  )
}

export function Bow({ className, style, fill = '#FF8FB5', stroke = INK }: FillProps) {
  return (
    <svg viewBox="0 0 80 58" className={className} style={style} {...svgProps}>
      <g fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <path d="M40 28C30 8 8 2 5 14c-3 14 17 26 35 14Z" />
        <path d="M40 28C50 8 72 2 75 14c3 14-17 26-35 14Z" />
        <path d="M36 36 24 54l14-6Z" />
        <path d="M44 36l12 18-14-6Z" />
        <ellipse cx="40" cy="28" rx="8" ry="9" fill="#F2689A" />
      </g>
      <path d="M14 14c4-3 9-3 13 0M66 14c-4-3-9-3-13 0" fill="none" stroke="#FFFDFB" strokeWidth="2.600" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

export function CakeSlice({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 74" className={className} style={style} {...svgProps}>
      <path d="M9 36 71 28v30c0 4-2 6-6 6H15c-4 0-6-2-6-6Z" fill="#FFE3EC" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M9 48h62" stroke={INK} strokeWidth="2.400" strokeDasharray="1 7" strokeLinecap="round" />
      <path d="M9 38C9 28 16 26 22 33c2-9 12-10 17-3 4-9 14-9 18-1 5-6 13-4 14 3 0 4-1 6-2 7L9 44Z" fill="#FFB5CD" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="40" cy="20" r="8" fill="#F2689A" stroke={INK} strokeWidth="3" />
      <path d="M40 12c0-5 4-8 9-8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M36 17c1-2 3-3 5-3" fill="none" stroke="#FFFDFB" strokeWidth="2.400" strokeLinecap="round" />
    </svg>
  )
}

export function MilkCarton({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 84" className={className} style={style} {...svgProps}>
      <path d="M10 26h40v50c0 3-2 5-5 5H15c-3 0-5-2-5-5Z" fill="#FFFDFB" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M10 26 17 8h26l7 18Z" fill="#FFCFE0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M17 8 22 2h16l5 6" fill="#FFB5CD" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M10 40h40" stroke="#FFB5CD" strokeWidth="6" />
      <path d="M30 70c-8-6-11-11-11-15 0-4 3-6 6-6 2 0 4 1 5 3 1-2 3-3 5-3 3 0 6 2 6 6 0 4-3 9-11 15Z" fill="#FF8FB5" stroke={INK} strokeWidth="2.400" strokeLinejoin="round" />
    </svg>
  )
}

export function Potato({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 84 74" className={className} style={style} {...svgProps}>
      <path
        d="M12 42C8 22 26 8 46 8s34 14 28 34c-5 18-22 24-37 22C22 62 15 54 12 42Z"
        fill="#F2D3A9"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <g fill="#E3B98A">
        <ellipse cx="26" cy="22" rx="3.500" ry="2.400" />
        <ellipse cx="62" cy="50" rx="3.200" ry="2.200" />
        <ellipse cx="55" cy="18" rx="2.600" ry="1.800" />
      </g>
      <circle cx="33" cy="38" r="3.400" fill={INK} />
      <circle cx="55" cy="38" r="3.400" fill={INK} />
      <circle cx="32" cy="37" r="1" fill="#FFFDFB" />
      <circle cx="54" cy="37" r="1" fill="#FFFDFB" />
      <ellipse cx="25" cy="47" rx="5" ry="3.200" fill="#FFB5CD" opacity=".9" />
      <ellipse cx="63" cy="47" rx="5" ry="3.200" fill="#FFB5CD" opacity=".9" />
      <path d="M40 48c2 3 6 3 8 0" fill="none" stroke={INK} strokeWidth="2.800" strokeLinecap="round" />
      <path d="M44 9c-1-6 2-9 7-9 1 5-1 8-7 9Z" fill="#D3EBCB" stroke={INK} strokeWidth="2.400" strokeLinejoin="round" />
    </svg>
  )
}

export function Blossom({ className, style, fill = '#FFCFE0' }: FillProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} {...svgProps}>
      <g fill={fill} stroke={INK} strokeWidth="2.600" strokeLinejoin="round">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d="M32 31C22 24 20 10 28 4l4 5 4-5c8 6 6 20-4 27Z" transform={`rotate(${a} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" r="5" fill="#FFEBA8" stroke={INK} strokeWidth="2.400" />
    </svg>
  )
}

export function PressedFlower({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style} {...svgProps}>
      <path d="M30 98C28 76 32 56 30 36" fill="none" stroke="#8BB98A" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 78c-10-2-16-8-17-16 10 0 16 6 17 16ZM31 64c9-2 15-7 17-14-9-1-16 4-17 14Z" fill="#D3EBCB" stroke="#8BB98A" strokeWidth="2" strokeLinejoin="round" />
      <g transform="translate(30 24) scale(.62) translate(-32 -32)">
        <g fill="#FFCFE0" stroke="#F2689A" strokeWidth="2.600" strokeLinejoin="round">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M32 31C22 24 20 10 28 4l4 5 4-5c8 6 6 20-4 27Z" transform={`rotate(${a} 32 32)`} />
          ))}
        </g>
        <circle cx="32" cy="32" r="5" fill="#FFEBA8" stroke="#F2689A" strokeWidth="2.400" />
      </g>
    </svg>
  )
}

export function Squiggle({ className, style, stroke = '#F2689A' }: FillProps) {
  return (
    <svg viewBox="0 0 90 16" className={className} style={style} {...svgProps}>
      <path d="M2 8q6-9 12 0t12 0 12 0 12 0 12 0 12 0 12 0" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Arrow({ className, style, stroke = INK }: FillProps) {
  return (
    <svg viewBox="0 0 90 56" className={className} style={style} {...svgProps}>
      <path d="M4 46C20 10 54 4 80 26" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M66 22 81 27 74 40" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Cloud({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 170 84" className={className} style={style} {...svgProps}>
      <path
        d="M34 72C12 72 6 52 24 46 22 26 44 16 60 28 66 8 98 6 108 26c20-10 44 6 36 24 20 4 18 22-2 22Z"
        fill="#FFFDFB"
        stroke={INK}
        strokeWidth="2.600"
        strokeLinejoin="round"
        opacity=".95"
      />
      <path d="M44 58c6 2 12 2 18 0M88 60c6 2 12 1 17-1" fill="none" stroke="#FFCFE0" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function CatHeart({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} {...svgProps}>
      <path d="M9 15 12 2l13 9ZM55 15 52 2 39 11Z" fill="#F2689A" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M32 58C12 44 5 33 5 23 5 15 11 10 18 10c6 0 11 3 14 8 3-5 8-8 14-8 7 0 13 5 13 13 0 10-7 21-27 35Z"
        fill="#FF8FB5"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="28" r="3" fill={INK} />
      <circle cx="40" cy="28" r="3" fill={INK} />
      <path d="M29 34c1.500 2 4.500 2 6 0" fill="none" stroke={INK} strokeWidth="2.400" strokeLinecap="round" />
    </svg>
  )
}

export function Pen({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} {...svgProps}>
      <path d="M6 34 8 26 28 6l6 6L14 32Z" fill="#FFEBA8" stroke={INK} strokeWidth="2.600" strokeLinejoin="round" />
      <path d="M6 34 8 26l6 6Z" fill="#FF8FB5" stroke={INK} strokeWidth="2.600" strokeLinejoin="round" />
      <path d="M26 8l6 6" stroke={INK} strokeWidth="2.600" />
    </svg>
  )
}

export function Pin({ className, style, fill = '#F2689A' }: FillProps) {
  return (
    <svg viewBox="0 0 30 36" className={className} style={style} {...svgProps}>
      <path d="M15 20v14" stroke={INK} strokeWidth="2.600" strokeLinecap="round" />
      <circle cx="15" cy="12" r="10" fill={fill} stroke={INK} strokeWidth="2.800" />
      <path d="M10 9c1-2 3-3 5-3" fill="none" stroke="#FFFDFB" strokeWidth="2.600" strokeLinecap="round" />
    </svg>
  )
}

export function Clip({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 30 70" className={className} style={style} {...svgProps}>
      <path
        d="M10 40V18c0-7 10-7 10 0v38c0 9-14 9-14 0V14C6 2 24 2 24 14v32"
        fill="none"
        stroke="#B2899A"
        strokeWidth="3.200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function RibbonCurl({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 130 44" className={className} style={style} {...svgProps}>
      <path d="M4 22C24 2 44 40 66 22S108 4 126 22" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M4 22C24 2 44 40 66 22S108 4 126 22" fill="none" stroke="#FF8FB5" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

/** Hand-drawn underline that draws itself on when scrolled into view. */
export function Underline({ className, color = '#F2689A', delay = 0.2 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 200 18" preserveAspectRatio="none" className={className} {...svgProps}>
      <motion.path
        d="M3 11C34 4 62 15 98 9s64-5 99 2"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/** Hand-drawn loop around a word. */
export function Scribble({ className, color = '#F2689A', delay = 0.2 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 200 70" preserveAspectRatio="none" className={className} {...svgProps}>
      <motion.path
        d="M104 6C152 3 197 17 193 36 188 56 132 66 96 64 48 62 5 52 8 32 11 12 62 7 112 9"
        fill="none"
        stroke={color}
        strokeWidth="3.500"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/** Washi tape strip with torn ends. */
export type TapeColor = 'butter' | 'petal' | 'strawberry' | 'matcha' | 'lavender' | 'milk'

const tapeColors: Record<TapeColor, string> = {
  butter: '#FFEBA8',
  petal: '#FFCFE0',
  strawberry: '#FFB5CD',
  matcha: '#D3EBCB',
  lavender: '#E8DCFF',
  milk: '#FFFDFB',
}

export function Tape({ color = 'butter', className, style }: { color?: TapeColor; className?: string; style?: CSSProperties }) {
  const c = tapeColors[color]
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: '5.5rem',
        height: '1.65rem',
        background: `repeating-linear-gradient(135deg, ${c} 0 7px, rgba(255,253,251,0.55) 7px 11px)`,
        opacity: 0.92,
        clipPath:
          'polygon(0 8%, 3% 0, 6% 10%, 9% 0, 12% 8%, 100% 0, 97% 12%, 100% 24%, 97% 36%, 100% 50%, 97% 62%, 100% 76%, 97% 88%, 100% 100%, 12% 92%, 9% 100%, 6% 90%, 3% 100%, 0 92%, 2% 76%, 0 60%, 2% 44%, 0 28%, 2% 16%)',
        boxShadow: '0 1px 0 rgba(242,104,154,0.2)',
        ...style,
      }}
    />
  )
}

/** Wax seal with a heart. `cracked` splits it in two. */
export function WaxSeal({ cracked = false, className }: { cracked?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '')
  const art: ReactNode = (
    <>
      <path
        d="M50 3C62 1 70 9 80 11c12 4 17 16 15 28 4 12-2 24-6 34-8 17-24 25-39 23-15 2-31-5-39-19-6-10-9-21-7-33C2 31 7 17 19 12 29 9 38 5 50 3Z"
        fill="#F2689A"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#FF8FB5" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
      <path
        d="M50 71C34 59 28 51 28 44c0-6 4-10 10-10 5 0 9 3 12 8 3-5 7-8 12-8 6 0 10 4 10 10 0 7-6 15-22 27Z"
        fill="#FFB5CD"
        stroke={INK}
        strokeWidth="2.800"
        strokeLinejoin="round"
      />
      <path d="M36 42c1-3 3-5 6-5" fill="none" stroke="#FFFDFB" strokeWidth="2.600" strokeLinecap="round" />
    </>
  )
  return (
    <svg viewBox="0 0 100 100" className={className} {...svgProps}>
      <defs>
        <clipPath id={`${id}l`}>
          <path d="M-10 -10H54L47 24 57 42 45 62 55 110H-10Z" />
        </clipPath>
        <clipPath id={`${id}r`}>
          <path d="M54 -10H110V110H55L45 62 57 42 47 24Z" />
        </clipPath>
      </defs>
      <motion.g
        clipPath={`url(#${id}l)`}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={cracked ? { x: -14, y: 10, rotate: -22, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {art}
      </motion.g>
      <motion.g
        clipPath={`url(#${id}r)`}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={cracked ? { x: 14, y: 12, rotate: 24, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {art}
      </motion.g>
    </svg>
  )
}

/** A wobbly hand-drawn wavy line that draws on. */
export function WavyDivider({ className, color = '#F2689A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className={className} {...svgProps}>
      <motion.path
        d="M0 22C40 6 80 36 120 20S200 6 240 22 320 36 360 20 440 6 480 22 560 36 600 20 680 6 720 22 800 36 840 20 920 6 960 22s80 14 120-2 80-14 120 2"
        fill="none"
        stroke={color}
        strokeWidth="3.500"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/** Scalloped paper edge, hangs down from the element it is placed under. */
export function Scallop({ className, fill = '#FFE3EC' }: { className?: string; fill?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width="100%" height="26" className={className} {...svgProps}>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="44" height="26">
          <path d="M0 0H44V4A22 22 0 0 1 0 4Z" fill={fill} />
        </pattern>
      </defs>
      <rect width="100%" height="26" fill={`url(#${id})`} />
    </svg>
  )
}

/** Torn paper edge. Seeded, so it always tears the same way. */
export function TornEdge({ className, fill = '#FFFDFB', seed = 7, flip = false }: { className?: string; fill?: string; seed?: number; flip?: boolean }) {
  const rnd = mulberry32(seed)
  const pts: string[] = ['0,0']
  const steps = 48
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 1000},${range(rnd, 4, 22).toFixed(1)}`)
  pts.push('1000,0')
  return (
    <svg viewBox="0 0 1000 24" preserveAspectRatio="none" className={className} style={flip ? { transform: 'scaleY(-1)' } : undefined} {...svgProps}>
      <polygon points={pts.join(' ')} fill={fill} />
    </svg>
  )
}
