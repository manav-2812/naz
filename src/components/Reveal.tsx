import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}

/** Soft overshoot entrance, once. Reduced motion gets a plain fade. */
export default function Reveal({ children, delay = 0, y = 26, className, style }: Props) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: reduced ? 0 : y, scale: reduced ? 1 : 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{
        y: { type: 'spring', stiffness: 220, damping: 17, delay },
        scale: { type: 'spring', stiffness: 220, damping: 17, delay },
        opacity: { duration: 0.45, delay },
      }}
    >
      {children}
    </motion.div>
  )
}
