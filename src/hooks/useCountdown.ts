import { useEffect, useState } from 'react'
import { config } from '../data/config'
import { getBirthdayInfo, type BirthdayInfo } from '../lib/birthday'

const IST_OFFSET_MS = 330 * 60 * 1000
const DAY_MS = 86_400_000

/** Calendar day number in IST. IST has no daylight saving, so this flips exactly at IST midnight. */
const istDay = (t: number): number => Math.floor((t + IST_OFFSET_MS) / DAY_MS)

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    const onVisible = (): void => {
      if (!document.hidden) setNow(Date.now())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs])

  return now
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
  daysSince: number
  info: BirthdayInfo
}

export function useCountdown(): Countdown {
  const now = useNow(1000)
  const info = getBirthdayInfo(now)
  const met = Date.parse(config.metISO)
  const diff = Math.max(0, info.targetTimestamp - now)
  const total = Math.floor(diff / 1000)

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: info.isToday,
    daysSince: Math.max(0, istDay(now) - istDay(met)),
    info,
  }
}
