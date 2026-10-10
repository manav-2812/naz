import { useEffect } from 'react'
import { copy } from '../data/copy'
import { fire } from '../lib/confetti'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import { toast } from '../lib/toast'

const WORDS = ['jannnnn', 'milkcake', 'billi', 'naz']

/** Type "jannnnn", "milkcake", "billi", or "naz" on a keyboard. */
export default function EasterEggs() {
  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-20)
      if (WORDS.some((w) => buffer.endsWith(w))) {
        buffer = ''
        haptics.celebrate()
        void fire.cakeRain()
        toast(copy.cakeRain)
        sfx.chime()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
