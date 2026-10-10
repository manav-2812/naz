import { useEffect, useState } from 'react'
import { copy } from '../data/copy'
import { MilkCarton } from './doodles'

export default function Loader({ className = '' }: { className?: string }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % copy.loader.length), 1400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div role="status" aria-live="polite" className={`flex min-h-[40dvh] flex-col items-center justify-center gap-3 ${className}`}>
      <MilkCarton className="h-20 w-auto animate-bob" />
      <p className="font-hand text-2xl text-cocoa-soft">{copy.loader[i]}</p>
    </div>
  )
}
