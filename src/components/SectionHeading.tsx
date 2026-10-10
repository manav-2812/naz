import clsx from 'clsx'
import { Scribble, Underline } from './doodles'

interface Props {
  text: string
  /** the one word that gets the handwriting treatment */
  hand: string
  variant?: 'circle' | 'underline'
  as?: 'h1' | 'h2'
  className?: string
}

/** Heading with one handwritten word, circled or underlined by a stroke that draws itself. */
export default function SectionHeading({ text, hand, variant = 'circle', as = 'h2', className }: Props) {
  const at = text.indexOf(hand)
  const Tag = as
  if (at < 0) return <Tag className={clsx('h-section', className)}>{text}</Tag>
  const before = text.slice(0, at)
  const after = text.slice(at + hand.length)
  return (
    <Tag className={clsx('h-section', className)}>
      {before}
      <span className="relative inline-block px-[0.2em] font-hand text-[1.18em] font-bold leading-none text-rosedeep">
        {hand}
        {variant === 'circle' ? (
          <Scribble className="pointer-events-none absolute -inset-x-[0.15em] -inset-y-[0.12em] h-[calc(100%+0.24em)] w-[calc(100%+0.3em)]" />
        ) : (
          <Underline className="pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.3em] w-full" />
        )}
      </span>
      {after}
    </Tag>
  )
}
