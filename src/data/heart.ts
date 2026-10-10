import { config } from './config'

/** "I love you" in 20 languages. Her name gets added to the end of each one. */
export const lovePhrases: readonly string[] = [
  'I love you',
  'Seni seviyorum',
  'Te amo',
  'Je t’aime',
  'Ich liebe dich',
  'Ti amo',
  'Eu te amo',
  'Я тебя люблю',
  '사랑해',
  '愛してる',
  '我爱你',
  'मैं तुमसे प्यार करता हूँ',
  'Σ’ αγαπώ',
  'Ik hou van jou',
  'Jag älskar dig',
  'Kocham cię',
  'ฉันรักเธอ',
  'Anh yêu em',
  'Aku cinta kamu',
  'Я тебе кохаю',
]

/** Appended to every phrase, e.g. "Te amo Ms. Naz" */
export const phraseSuffix = config.herName

/**
 * On narrow screens the long "... Ms. Naz" phrases leave the heart too sparse to read,
 * so only every 4th phrase carries her name (the first, "I love you Ms. Naz", always does).
 */
export function phrasesFor(width: number): readonly string[] {
  if (width >= 520) return lovePhrases.map((p) => `${p} ${phraseSuffix}`)
  return lovePhrases.map((p, i) => (i % 4 === 0 ? `${p} ${phraseSuffix}` : p))
}

export const heartCopy = {
  heading: 'i love you, in every language i could find',
  headingHand: 'every',
  sub: '(google helped. billi checked)',
  replay: 'again',
  label: `I love you ${config.herName}, in twenty languages`,
} as const
