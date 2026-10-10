import type { CSSProperties, ReactNode } from 'react'
import { Blossom, Bow, CakeSlice, Heart, MilkCarton, Paw, Potato, RibbonCurl, Sparkle, Star } from './doodles'

interface Bit {
  node: ReactNode
  style: CSSProperties
  delay: string
  rot: number
}

const sticker = (node: ReactNode, style: CSSProperties, delay: string, rot: number): Bit => ({ node, style, delay, rot })

const bits: Bit[] = [
  sticker(<CakeSlice className="w-full" />, { left: '24%', top: '30%', width: '52%' }, '0s', -6),
  sticker(<MilkCarton className="w-full" />, { left: '4%', top: '12%', width: '23%' }, '-2s', -12),
  sticker(<Potato className="w-full" />, { left: '64%', top: '60%', width: '32%' }, '-1s', 8),
  sticker(<Bow className="w-full" />, { left: '66%', top: '8%', width: '26%' }, '-3s', 14),
  sticker(<Blossom className="w-full" />, { left: '8%', top: '66%', width: '20%' }, '-4s', -18),
  sticker(<Heart className="w-full" />, { left: '42%', top: '4%', width: '13%' }, '-2.5s', 10),
  sticker(<Star className="w-full" />, { left: '82%', top: '40%', width: '11%' }, '-1.5s', -8),
  sticker(<Paw className="w-full" />, { left: '36%', top: '80%', width: '12%' }, '-3.5s', 20),
  sticker(<Paw className="w-full" />, { left: '50%', top: '88%', width: '9%' }, '-0.5s', 8),
]

/** A little pile of her favourite things, stuck down like stickers. */
export default function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        <RibbonCurl className="absolute left-[2%] top-[48%] w-[96%] rotate-[-14deg] opacity-90" />
        {bits.map((b, i) => (
          <div
            key={i}
            className="absolute animate-floaty"
            style={{ ...b.style, animationDelay: b.delay, ['--r' as string]: `${b.rot}deg` }}
          >
            <div className="die-cut">{b.node}</div>
          </div>
        ))}
        <Sparkle className="absolute left-[18%] top-[48%] w-[7%] animate-floaty" style={{ animationDelay: '-2s' }} fill="#FFEBA8" />
        <Sparkle className="absolute left-[78%] top-[26%] w-[6%] animate-floaty" style={{ animationDelay: '-4s' }} />
      </div>
    </div>
  )
}
