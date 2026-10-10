import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { Blossom, Bow, Heart, Paw, Sparkle, Star, Tape } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

interface Coupon {
  id: string
  title: string
  subtitle: string
  badge: string
  icon: typeof Heart
  color: string
}

const COUPONS: Coupon[] = [
  {
    id: 'hug',
    title: '1x Unlimited Emergency Hugs',
    subtitle: 'Valid anytime you are sad, angry, tired, or just need a long warm hug.',
    badge: 'No Expiry',
    icon: Heart,
    color: '#ffe3ec',
  },
  {
    id: 'argument',
    title: '1x Free Pass to Win Any Argument',
    subtitle: 'You are automatically 100% right. Mr. Naz surrenders unconditionally.',
    badge: 'Ultimate Power',
    icon: Star,
    color: '#ffeba8',
  },
  {
    id: 'milkcake',
    title: '1x Midnight Milkcake & Treat Run',
    subtitle: 'Late-night cravings fulfilled on demand with extra sweets and smiles.',
    badge: 'Sweet Tooth',
    icon: Blossom,
    color: '#ffcfe0',
  },
  {
    id: 'headscratch',
    title: '1x Forehead Kisses & Head Scratches',
    subtitle: '30 minutes of complete pampered relaxation. Billi-approved treatment.',
    badge: 'Billi Special',
    icon: Paw,
    color: '#fff0f5',
  },
  {
    id: 'playlist',
    title: '1x Sunset Drive with Your Favorite Songs',
    subtitle: 'You control the aux cord. No skipping your favorite songs.',
    badge: 'Vibe Check',
    icon: Sparkle,
    color: '#ffe8d6',
  },
  {
    id: 'queen',
    title: '1x Day of Complete Royal Pampering',
    subtitle: 'You make every decision for 24 hours. Mr. Naz is at your royal service.',
    badge: 'Birthday Queen',
    icon: Bow,
    color: '#ffd6e0',
  },
]

export default function LoveCoupons() {
  const [redeemed, setRedeemed] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('naz_coupons')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('naz_coupons', JSON.stringify(redeemed))
    } catch (e) {
      void e
    }
  }, [redeemed])

  const handleRedeem = (id: string) => {
    if (redeemed[id]) return

    haptics.celebrate()
    sfx.chime()
    void fire.hearts({ x: 0.5, y: 0.6 }, 25)
    setRedeemed((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section id="coupons" className="relative px-[var(--gutter)] py-20 overflow-hidden">
      <div className="relative mx-auto max-w-[960px]">
        <Reveal className="text-center">
          <SectionHeading text="love vouchers for ms. naz" hand="vouchers" />
          <p className="sub-hand mt-2">
            official coupons redeemable with Mr. Naz anytime. no expiration date!
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COUPONS.map((c, i) => {
              const Icon = c.icon
              const isUsed = Boolean(redeemed[c.id])

              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4, rotate: i % 2 === 0 ? -0.8 : 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="paper relative rounded-2xl border-[3px] border-cocoa p-5 sm:p-6 shadow-md overflow-hidden flex flex-col justify-between"
                  style={{ backgroundColor: c.color }}
                >
                  <Tape
                    color={i % 2 === 0 ? 'butter' : 'petal'}
                    className={`absolute -top-3 ${i % 2 === 0 ? 'left-[10%] rotate-[-4deg]' : 'right-[10%] rotate-[5deg]'}`}
                  />

                  {/* Coupon Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-hand text-sm font-bold text-cocoa-soft uppercase tracking-wider bg-white/70 px-2.5 py-0.5 rounded-full border border-cocoa/20">
                        {c.badge}
                      </span>
                      <Icon className="w-5 h-5 text-cocoa" />
                    </div>

                    <h3 className="font-hand text-2xl font-bold text-cocoa leading-snug">
                      {c.title}
                    </h3>
                    <p className="font-hand text-base text-cocoa-soft mt-1 leading-relaxed">
                      {c.subtitle}
                    </p>
                  </div>

                  {/* Bottom Ticket Perforation & Action */}
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-cocoa/30 flex items-center justify-between">
                    <span className="font-mono text-xs text-cocoa-soft uppercase tracking-wider">
                      COUPON #{String(i + 1).padStart(3, '0')}
                    </span>

                    {isUsed ? (
                      <span className="font-hand text-lg font-bold text-rose uppercase tracking-wider rotate-[-6deg] bg-white/80 border-2 border-rose px-3 py-0.5 rounded-md shadow-sm">
                        ✓ Redeemed ♡
                      </span>
                    ) : (
                      <motion.button
                        type="button"
                        data-cursor="open"
                        onClick={() => handleRedeem(c.id)}
                        className="btn-sticker py-1.5 px-4 text-base font-hand shadow-sm"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                      >
                        Redeem Now ♡
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
