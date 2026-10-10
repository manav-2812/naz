import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'

export default function ThemeToggle() {
  const [starlight, setStarlight] = useState(false)

  useEffect(() => {
    if (starlight) {
      document.documentElement.setAttribute('data-theme', 'starlight')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [starlight])

  const toggle = () => {
    haptics.light()
    sfx.pop()
    const next = !starlight
    setStarlight(next)
    if (next) {
      void fire.hearts({ x: 0.88, y: 0.1 }, 10)
    }
  }

  return (
    <div
      className="fixed z-[85] select-none"
      style={{ top: 'calc(var(--safe-top) + 14px)', right: 'calc(var(--safe-right) + 16px)' }}
    >
      <motion.button
        type="button"
        data-cursor="open"
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title={starlight ? 'Switch to daylight ♡' : 'Switch to romantic starlight mode ✨'}
        className="flex items-center gap-1.5 rounded-full border-2 border-cocoa bg-milk px-3.5 py-1.5 shadow-md text-cocoa transition-colors"
      >
        {starlight ? (
          <>
            <Moon className="h-4 w-4 text-butter fill-butter" />
            <span className="font-hand text-sm font-bold">starlight</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4 text-rose" />
            <span className="font-hand text-sm font-bold">daylight</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
