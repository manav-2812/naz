export type LetterKind = 'greeting' | 'aside' | 'body' | 'sign' | 'ps'

export interface LetterLine {
  kind: LetterKind
  text: string
}

/** The letter, word for word. Each entry appears as its own handwritten line. */
export const letter: readonly LetterLine[] = [
  { kind: 'greeting', text: 'Dear Ms. Naz,' },
  { kind: 'aside', text: '(billi. milkcake.jannnnn. ungrateful potato. pick whichever one you are today.)' },
  { kind: 'body', text: 'Happy 18th birthday.' },
  {
    kind: 'body',
    text: 'I tried writing this about six times and deleted it every time, because it either sounded too serious or too cringe. So this is the version where I just say it how I’d say it to you.',
  },
  {
    kind: 'body',
    text: 'I met you on 9 September. It was a normal day and I had no idea. Now I check my phone more than I’d like to admit, I smile at things that aren’t even funny, and my friends have started noticing. (they’re annoying about it. don’t tell them I said that.)',
  },
  {
    kind: 'body',
    text: 'You’re turning 18 and I hope this year is kind to you. I hope you get the big things you want and a lot of tiny good days in between. I hope people love you the way you love people, which is loudly, and then you act like you didn’t.',
  },
  {
    kind: 'body',
    text: 'I’m not perfect. I’ll tease you too much, I’ll say the wrong thing sometimes, and I’ll probably forget something important at the worst time. But I’ll keep showing up. That part I can promise.',
  },
  { kind: 'body', text: 'Thank you for being you. Thank you for letting me be around.' },
  { kind: 'body', text: 'Happy birthday, Naz. I’m really glad it’s you.' },
  { kind: 'sign', text: 'yours,\nMr. Naz' },
  { kind: 'ps', text: 'p.s. you owe me a cake. or i owe you one. we’ll figure it out.' },
]
