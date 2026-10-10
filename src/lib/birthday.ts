/**
 * Perpetual Birthday & Age Engine
 * Runs forever:
 * - Calculates upcoming birthday, target age, days since met.
 * - When a birthday year ends (Nov 13 passes in IST), automatically flips
 *   to count down for the next year (18 -> 19 -> 20 -> 21 -> ... forever!).
 * - Dynamically distributes candles across the cake tiers.
 * - Formats ordinals (18th, 19th, 20th, 21st, 22nd, etc.).
 */

export const BIRTH_YEAR = 2008
export const BIRTH_MONTH = 11 // November (1-12)
export const BIRTH_DAY = 13 // 13th
export const MET_DATE_ISO = '2026-09-09T00:00:00+05:30'

const IST_OFFSET_MS = 330 * 60 * 1000 // UTC+5:30 in milliseconds
const DAY_MS = 86_400_000

export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export interface BirthdayInfo {
  targetAge: number
  targetAgeOrdinal: string
  targetDateISO: string
  targetTimestamp: number
  isToday: boolean
  currentYear: number
  targetYear: number
}

export interface CandleData {
  id: number
  tier: 'top' | 'mid-left' | 'mid-right' | 'bot-left' | 'bot-right'
  color: 'pink' | 'butter' | 'berry'
}

/** Check query params for instant testing: ?birthday=1 or ?age=19 or ?year=2027 */
function getQueryOverride(): { forceBirthday?: boolean; forceAge?: number; forceYear?: number } {
  try {
    const params = new URLSearchParams(window.location.search)
    return {
      forceBirthday: params.get('birthday') === '1',
      forceAge: params.get('age') ? parseInt(params.get('age')!, 10) : undefined,
      forceYear: params.get('year') ? parseInt(params.get('year')!, 10) : undefined,
    }
  } catch {
    return {}
  }
}

/** Calculate current and upcoming birthday information in IST timezone */
export function getBirthdayInfo(nowMs: number = Date.now()): BirthdayInfo {
  const overrides = getQueryOverride()

  // Current date in IST
  const istTime = new Date(nowMs + IST_OFFSET_MS)
  const currentYear = overrides.forceYear ?? istTime.getUTCFullYear()

  const monthStr = String(BIRTH_MONTH).padStart(2, '0')
  const dayStr = String(BIRTH_DAY).padStart(2, '0')

  // Birthday in current year starts at 00:00:00 IST and ends at 23:59:59.999 IST
  const currentYearBirthdayStart = Date.parse(`${currentYear}-${monthStr}-${dayStr}T00:00:00+05:30`)
  const currentYearBirthdayEnd = currentYearBirthdayStart + DAY_MS

  let targetYear = currentYear
  let isToday = false

  if (nowMs < currentYearBirthdayStart) {
    // Before this year's birthday: count down to this year
    targetYear = currentYear
    isToday = false
  } else if (nowMs >= currentYearBirthdayStart && nowMs < currentYearBirthdayEnd) {
    // On birthday today!
    targetYear = currentYear
    isToday = true
  } else {
    // This year's birthday is over: run forever and count down to NEXT year's birthday!
    targetYear = currentYear + 1
    isToday = false
  }

  if (overrides.forceBirthday) {
    isToday = true
  }

  let targetAge = targetYear - BIRTH_YEAR
  if (overrides.forceAge && !isNaN(overrides.forceAge)) {
    targetAge = overrides.forceAge
  }

  const targetDateISO = `${targetYear}-${monthStr}-${dayStr}T00:00:00+05:30`
  const targetTimestamp = Date.parse(targetDateISO)

  return {
    targetAge,
    targetAgeOrdinal: getOrdinal(targetAge),
    targetDateISO,
    targetTimestamp,
    isToday,
    currentYear,
    targetYear,
  }
}

/**
 * Dynamically distribute N candles across cake tiers:
 * - Top tier
 * - Mid tier left & right shoulders
 * - Bottom tier left & right shoulders
 */
export function generateCandles(count: number): CandleData[] {
  const safeCount = Math.max(1, count)
  const colors: ('pink' | 'butter' | 'berry')[] = ['pink', 'butter', 'berry']

  // For 18: top 6, mid-left 3, mid-right 3, bot-left 3, bot-right 3
  const topCount = Math.max(4, Math.round(safeCount * 0.35))
  const remaining = safeCount - topCount
  const midLeft = Math.floor(remaining / 4)
  const midRight = Math.floor(remaining / 4)
  const botLeft = Math.floor((remaining - midLeft - midRight) / 2)
  const botRight = remaining - midLeft - midRight - botLeft

  const candles: CandleData[] = []
  let id = 0

  for (let i = 0; i < topCount; i++) {
    candles.push({ id: id++, tier: 'top', color: colors[i % 3] })
  }
  for (let i = 0; i < midLeft; i++) {
    candles.push({ id: id++, tier: 'mid-left', color: colors[i % 3] })
  }
  for (let i = 0; i < midRight; i++) {
    candles.push({ id: id++, tier: 'mid-right', color: colors[(i + 1) % 3] })
  }
  for (let i = 0; i < botLeft; i++) {
    candles.push({ id: id++, tier: 'bot-left', color: colors[i % 3] })
  }
  for (let i = 0; i < botRight; i++) {
    candles.push({ id: id++, tier: 'bot-right', color: colors[(i + 1) % 3] })
  }

  return candles
}
