import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { onToast } from '../lib/toast'
import { Heart, Tape } from './doodles'

interface Item {
  id: number
  text: string
}

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([])
  const counter = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const off = onToast((text) => {
      const id = ++counter.current
      setItems((list) => [...list.slice(-1), { id, text }])
      timers.current.push(
        window.setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), 3200),
      )
    })
    const pending = timers.current
    return () => {
      off()
      pending.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[90] flex flex-col items-center gap-2 px-4"
      style={{ bottom: 'calc(var(--safe-bottom) + 92px)' }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="paper relative max-w-[min(92vw,360px)] rounded-blob-2 border-2 border-cocoa px-5 py-3 text-center"
          >
            <Tape color="butter" className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg] scale-75" />
            <p className="flex items-center justify-center gap-2 font-hand text-[1.5rem] leading-tight text-cocoa">
              <Heart className="h-5 w-5 shrink-0" />
              {item.text}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
