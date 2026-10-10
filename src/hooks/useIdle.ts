import { useEffect, useState } from 'react'

/** true once nothing has happened for `ms`. Any pointer, key or scroll wakes it up. */
export function useIdle(ms: number, enabled = true): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIdle(false)
      return
    }
    let last = Date.now()
    const wake = (): void => {
      last = Date.now()
      setIdle((v) => (v ? false : v))
    }
    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    const id = window.setInterval(() => {
      if (Date.now() - last >= ms) setIdle((v) => (v ? v : true))
    }, 1000)
    return () => {
      events.forEach((e) => window.removeEventListener(e, wake))
      window.clearInterval(id)
    }
  }, [ms, enabled])

  return idle
}
