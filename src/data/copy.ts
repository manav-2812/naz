/** Microcopy, word for word. Edit freely. */
export const copy = {
  gate: {
    kicker: 'psst. billi.',
    button: 'open me',
    small: '(sound on, please. it’s worth it)',
  },
  loader: ['warming up the milk…', 'peeling the potatoes…', 'asking billi to hurry…'],
  hero: { scrollHint: 'keep going, there’s more' },
  countdown: {
    heading: 'till your day, ms. naz',
    headingHand: 'ms. naz',
    note: 'days since 9 sept (not that i’m counting. i am.)',
    today: 'it’s today!! happy birthday, jannnnn',
  },
  notes: {
    heading: '18 reasons, in no particular order',
    headingHand: 'reasons',
    sub: 'tap a note. they’re a bit shy',
  },
  scrapbook: {
    heading: 'things i don’t want to forget',
    headingHand: 'forget',
    hint: 'drag them around, make it yours',
  },
  letter: {
    heading: 'a letter',
    headingHand: 'letter',
    sub: '(written by me, delivered by code, sorry)',
    hint: 'tap to open. it’s not a bill',
  },
  game: {
    heading: 'catch the milkcakes',
    headingHand: 'milkcakes',
    rules: 'catch cakes and hearts. avoid the potatoes. (sorry, potato)',
    bonk: 'bonk.',
    low: 'cute effort, billi',
    mid: 'okay okay, nice hands',
    high: 'ungrateful? no. legend.',
  },
  gift: {
    heading: 'one more thing',
    headingHand: 'more',
    hint: 'don’t shake it. ok, shake it.',
    intro: 'this one’s for you',
  },
  footer: { made: 'made with way too much love (and a few bugs i fixed) by Mr. Naz' },
  music: { tooltip: 'music', muted: 'shh', backToTop: 'up we go' },
  cursor: { open: 'open', flip: 'flip', catch: 'catch', drag: 'drag', pop: 'pop' },
  billi: { idle: 'zzz…', egg: 'ok you found me. i love you.' },
  errorBoundary: 'oops. a potato rolled over something. refresh?',
  cakeRain: 'cake rain!!',
} as const

export function gameMessage(score: number): string {
  if (score < 10) return copy.game.low
  if (score < 25) return copy.game.mid
  return copy.game.high
}
