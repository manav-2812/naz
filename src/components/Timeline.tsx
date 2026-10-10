import { motion } from 'framer-motion'
import { getBirthdayInfo } from '../lib/birthday'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { Blossom, Heart, Paw, Sparkle, Star, Tape } from './doodles'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

interface Milestone {
  date: string
  title: string
  description: string
  icon: typeof Heart
  color: string
}

export default function Timeline() {
  const bInfo = getBirthdayInfo()

  const milestones: Milestone[] = [
    {
      date: '9 September',
      title: 'The Day We Met',
      description: 'The exact day the universe brought us into each other’s story. The day that started everything.',
      icon: Heart,
      color: '#ffe3ec',
    },
    {
      date: 'Late Nights',
      title: 'Hours That Felt Like Seconds',
      description: 'Talking about everything and nothing until 3 AM. Realizing how effortlessly you make me smile.',
      icon: Sparkle,
      color: '#ffeba8',
    },
    {
      date: 'Inside Jokes',
      title: 'Becoming "Billi" & "Jannnnn"',
      description: 'The first time you made that sassy, adorable face and officially earned your cat ears and potato status.',
      icon: Paw,
      color: '#ffcfe0',
    },
    {
      date: 'Every Single Day',
      title: 'The Sweet Little Moments',
      description: 'Every random text, shared laugh, and sweet voice note that turned ordinary days into my favorite ones.',
      icon: Blossom,
      color: '#ffd6e0',
    },
    {
      date: `Today: ${bInfo.targetAgeOrdinal} Birthday`,
      title: `Happy ${bInfo.targetAgeOrdinal}, Ms. Naz!`,
      description: `${bInfo.targetAge} years of the most wonderful soul in the world. And I get to be here celebrating with you.`,
      icon: Star,
      color: '#ffe8d6',
    },
  ]

  return (
    <section id="timeline" className="relative px-[var(--gutter)] py-20 overflow-hidden">
      <div className="relative mx-auto max-w-[840px]">
        <Reveal className="text-center">
          <SectionHeading text="our little story so far" hand="our story" />
          <p className="sub-hand mt-2">
            a few of my favorite chapters with you, leading right up to today ♡
          </p>
        </Reveal>

        {/* Story ribbon timeline cards */}
        <div className="relative mt-12 sm:mt-16">
          {/* Vertical ribbon connecting line */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-rose/60 via-butter to-petal/80 rounded-full border-r border-dashed border-cocoa/30" />

          <div className="flex flex-col gap-8 sm:gap-12">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0
              const IconComp = item.icon

              return (
                <Reveal key={item.title} delay={index * 0.1}>
                  <div
                    className={`relative flex items-center ${
                      isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    } flex-row pl-12 sm:pl-0`}
                  >
                    {/* Center Icon node */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-white shadow-md">
                      <IconComp className="w-6 h-6 text-rosedeep" />
                    </div>

                    {/* Content Paper Card */}
                    <div
                      className={`w-full sm:w-[45%] ${
                        isEven ? 'sm:pr-8 text-left' : 'sm:pl-8 text-left'
                      }`}
                    >
                      <motion.div
                        onClick={() => {
                          sfx.pop()
                          haptics.light()
                        }}
                        data-cursor="open"
                        whileHover={{ scale: 1.02, rotate: isEven ? -1 : 1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="paper relative rounded-blob border-[3px] border-cocoa p-5 shadow-sm cursor-pointer select-none"
                        style={{ backgroundColor: item.color }}
                      >
                        <Tape
                          color={isEven ? 'butter' : 'petal'}
                          className={`absolute -top-3 ${
                            isEven ? 'left-6 rotate-[-5deg]' : 'right-6 rotate-[6deg]'
                          }`}
                        />

                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-hand text-base font-bold text-rosedeep uppercase tracking-wider bg-white/70 px-2.5 py-0.5 rounded-full border border-cocoa/15 shadow-2xs">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="font-hand text-2xl sm:text-3xl font-bold text-cocoa leading-tight mt-1">
                          {item.title}
                        </h3>

                        <p className="font-hand text-lg text-cocoa-soft leading-snug mt-1">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
