import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { haptics } from '../lib/haptics'
import { sfx } from '../lib/sfx'
import Billi from './Billi'
import { Heart, Sparkle, Tape } from './doodles'

interface Props {
  onSuccess: () => void
}

const CORRECT_PIN = '0909'

export default function PasswordScreen({ onSuccess }: Props) {
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const ref0 = useRef<HTMLInputElement>(null)
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const ref3 = useRef<HTMLInputElement>(null)
  const inputRefs = [ref0, ref1, ref2, ref3]

  useEffect(() => {
    // Focus first input automatically
    const t = window.setTimeout(() => {
      ref0.current?.focus()
    }, 200)
    return () => window.clearTimeout(t)
  }, [])

  const verifyPin = (pin: string) => {
    if (pin === CORRECT_PIN) {
      haptics.celebrate()
      setError(false)
      setUnlocked(true)
      onSuccess()
    } else {
      haptics.doubleTap()
      setError(true)
      setShaking(true)
      sfx.bonk()
      window.setTimeout(() => setShaking(false), 500)
      setDigits(['', '', '', ''])
      ref0.current?.focus()
    }
  }

  const handleChange = (index: number, value: string) => {
    const val = value.slice(-1)
    if (!/^\d*$/.test(val)) return

    const newDigits = [...digits]
    newDigits[index] = val
    setDigits(newDigits)
    setError(false)

    if (val) {
      haptics.light()
      sfx.pop()
      if (index < 3) {
        inputRefs[index + 1]?.current?.focus()
      }
    }

    const fullPin = newDigits.join('')
    if (fullPin.length === 4 && newDigits.every((d) => d !== '')) {
      verifyPin(fullPin)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pasted) return

    const newDigits = ['', '', '', '']
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i] || ''
    }
    setDigits(newDigits)

    if (pasted.length === 4) {
      verifyPin(pasted)
    } else {
      inputRefs[Math.min(pasted.length, 3)]?.current?.focus()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const fullPin = digits.join('')
    verifyPin(fullPin)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: shaking ? 0.45 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 mx-auto w-full max-w-[440px] px-2 sm:px-3"
    >
      <div className="paper relative mx-auto rounded-blob border-[3px] border-cocoa bg-gradient-to-b from-milk to-blush p-5 sm:p-8 shadow-xl">
        <Tape color="butter" className="absolute -top-3 left-[16%] rotate-[-5deg]" />
        <Tape color="petal" className="absolute -top-3 right-[16%] rotate-[6deg]" />

        {/* Billi sitting atop the card */}
        <div className="flex flex-col items-center">
          <Billi className="w-16 h-16 sm:w-20 sm:h-20 -mt-2" />
          <h2 className="font-hand text-[clamp(1.8rem,6vw,2.4rem)] font-bold text-cocoa text-center mt-1 leading-tight">
            secret memory lock ♡
          </h2>
          <p className="font-hand text-[1.1rem] sm:text-[1.15rem] text-cocoa-soft text-center mt-0.5">
            psst. only Ms. Naz knows the code
          </p>
        </div>

        {/* PIN Inputs Form */}
        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 flex flex-col items-center w-full">
          <div className="flex justify-center items-center gap-2 sm:gap-3.5 w-full max-w-full">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                size={1}
                value={digit}
                disabled={unlocked}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                data-cursor="open"
                className={`w-[clamp(44px,14vw,60px)] h-[clamp(54px,16vw,72px)] sm:w-16 sm:h-20 shrink-0 text-center font-hand text-2xl sm:text-4xl font-bold rounded-xl sm:rounded-2xl border-2 transition-all shadow-inner focus:outline-none ${
                  error
                    ? 'border-rose bg-blush text-rose'
                    : unlocked
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                      : 'border-cocoa/40 bg-white/90 text-cocoa focus:border-rose focus:ring-4 focus:ring-rose/25'
                }`}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Error Notice */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 font-hand text-[1.15rem] sm:text-[1.2rem] font-bold text-rose text-center"
            >
              oops, that's not our special day! try again ♡
            </motion.p>
          )}

          {/* Hint */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-dashed border-cocoa/40 bg-butter/80 px-3.5 sm:px-4 py-1 sm:py-1.5 shadow-sm max-w-full">
            <Sparkle className="w-4 h-4 text-cocoa-soft shrink-0" fill="#FFEBA8" />
            <span className="font-hand text-[1.15rem] sm:text-[1.25rem] font-bold text-cocoa whitespace-nowrap">
              hint: the day we met
            </span>
          </div>

          {/* Unlock Button */}
          <motion.button
            type="submit"
            disabled={unlocked}
            data-cursor="open"
            className="btn-sticker mt-5 sm:mt-6 px-5 sm:px-8 py-2.5 text-base sm:text-[1.3rem] shadow-md flex items-center justify-center gap-2 whitespace-nowrap max-w-full"
            whileHover={{ scale: 1.04, rotate: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 14 }}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="#f2689a" />
            <span>open my scrapbook ♡</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
