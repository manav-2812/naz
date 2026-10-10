/** Soft UI sounds, synthesised with WebAudio. Off by default. No audio files needed. */
let ctx: AudioContext | null = null
let enabled = false

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }

function ensure(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext
    if (!AC) return null
    try {
      ctx = new AC()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined)
  return ctx
}

export function setSfx(on: boolean): void {
  enabled = on
  if (on) ensure()
}

export function isSfx(): boolean {
  return enabled
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0, slideTo?: number): void {
  if (!enabled) return
  const c = ensure()
  if (!c) return
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const sfx = {
  pop: () => tone(480, 0.1, 'sine', 0.12, 0, 900),
  chime: () => [784, 988, 1319].forEach((f, i) => tone(f, 0.28, 'triangle', 0.08, i * 0.08)),
  bonk: () => tone(180, 0.18, 'square', 0.06, 0, 70),
  catch: () => tone(660, 0.08, 'sine', 0.09, 0, 990),
  blow: () => {
    tone(380, 0.28, 'sine', 0.12, 0, 90)
    tone(240, 0.32, 'triangle', 0.08, 0.02, 70)
  },
  ignite: () => {
    tone(560, 0.12, 'sine', 0.1, 0, 1100)
  },
}

