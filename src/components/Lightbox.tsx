import { animate, motion, useMotionValue } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { config } from '../data/config'
import type { Memory } from '../data/memories'
import { lockScroll } from '../hooks/useLenis'
import { clamp } from '../lib/device'
import Photo from './Photo'

interface Props {
  items: Memory[]
  index: number
  onClose: () => void
  onIndex: (i: number) => void
}

/** Full-size view: swipe, pinch, double-tap to zoom, arrow keys, Esc. */
export default function Lightbox({ items, index, onClose, onIndex }: Props) {
  const memory = items[index]
  const scale = useMotionValue(1)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useMotionValue(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const count = items.length

  const resetZoom = useCallback(() => {
    scale.set(1)
    px.set(0)
    py.set(0)
    sx.set(0)
  }, [scale, px, py, sx])

  const go = useCallback(
    (dir: number) => {
      resetZoom()
      onIndex((index + dir + count) % count)
    },
    [count, index, onIndex, resetZoom],
  )

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      lockScroll(false)
      previous?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const nodes = rootRef.current?.querySelectorAll<HTMLElement>('button')
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (!first || !last) return
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  const bind = useGesture(
    {
      onDrag: ({ offset: [ox, oy], movement: [mx], velocity: [vx], last, pinching, cancel }) => {
        if (pinching) {
          cancel()
          return
        }
        if (scale.get() > 1.02) {
          px.set(ox)
          py.set(oy)
          return
        }
        if (!last) {
          sx.set(mx)
          return
        }
        if (Math.abs(mx) > 80 || (vx > 0.5 && Math.abs(mx) > 30)) {
          sx.set(0)
          go(mx < 0 ? 1 : -1)
        } else {
          void animate(sx, 0, { type: 'spring', stiffness: 300, damping: 24 })
        }
      },
      onPinch: ({ offset: [s], last }) => {
        scale.set(clamp(s, 1, 4))
        if (last && scale.get() < 1.05) {
          void animate(scale, 1, { duration: 0.2 })
          px.set(0)
          py.set(0)
        }
      },
    },
    {
      drag: { from: () => [px.get(), py.get()], filterTaps: true },
      pinch: { scaleBounds: { min: 1, max: 4 }, from: () => [scale.get(), 0], rubberband: true },
      eventOptions: { passive: false },
    },
  )

  const toggleZoom = (): void => {
    if (scale.get() > 1.1) {
      void animate(scale, 1, { duration: 0.25 })
      px.set(0)
      py.set(0)
    } else {
      void animate(scale, 2.5, { duration: 0.25 })
    }
  }

  if (!memory) return null

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={memory.caption}
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[rgba(255,227,236,0.94)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
    >
      <button
        ref={closeRef}
        type="button"
        data-cursor="open"
        aria-label={config.ui.close}
        onClick={onClose}
        className="absolute right-4 top-[calc(var(--safe-top)+14px)] z-20 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-cocoa bg-milk shadow-sticker-sm"
      >
        <X aria-hidden="true" className="h-6 w-6" />
      </button>

      <div className="relative flex w-full flex-1 items-center justify-center px-3 pt-16 short:pt-4">
        <button
          type="button"
          aria-label={config.ui.prev}
          onClick={() => go(-1)}
          className="absolute left-2 z-20 hidden h-12 w-12 items-center justify-center rounded-full border-[3px] border-cocoa bg-milk shadow-sticker-sm sm:flex"
        >
          <ChevronLeft aria-hidden="true" className="h-6 w-6" />
        </button>

        <div {...bind()} key={memory.id} className="canvas-touch relative" style={{ touchAction: 'none' }} onDoubleClick={toggleZoom}>
          <motion.div className="relative" style={{ x: sx }}>
            <motion.div
              layoutId={`mem-${memory.id}`}
              className="paper rounded-[6px] bg-milk p-3 pb-14"
              style={{ x: px, y: py, scale }}
            >
              <div className="relative aspect-[4/5] h-[min(64dvh,640px)] max-w-[88vw] overflow-hidden rounded-[3px] short:h-[62dvh]">
                <Photo memory={memory} fit="contain" eager />
              </div>
              <p className="absolute inset-x-4 bottom-3 text-center font-hand text-[1.6rem] leading-tight text-cocoa">{memory.caption}</p>
            </motion.div>
          </motion.div>
        </div>

        <button
          type="button"
          aria-label={config.ui.next}
          onClick={() => go(1)}
          className="absolute right-2 z-20 hidden h-12 w-12 items-center justify-center rounded-full border-[3px] border-cocoa bg-milk shadow-sticker-sm sm:flex"
        >
          <ChevronRight aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      <p className="pb-4 font-ui text-lg font-medium text-cocoa-soft" aria-live="polite">
        {index + 1} / {count}
      </p>
    </motion.div>
  )
}
