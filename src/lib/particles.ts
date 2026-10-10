import { dprCap } from './device'
import { heartPath, sparklePath, starPath } from './shapes'

export type ParticleKind = 'heart' | 'star' | 'sparkle' | 'ring'

interface Particle {
  active: boolean
  trail: boolean
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  rot: number
  vr: number
  color: string
}

export interface SpawnOptions {
  vx?: number
  vy?: number
  life?: number
  size?: number
  color: string
  trail?: boolean
}

/** One canvas, one pool, nothing allocated while it runs. The loop only runs while something is alive. */
export class ParticleField {
  private ctx: CanvasRenderingContext2D | null
  private pool: Particle[]
  private raf = 0
  private last = 0
  private paused = false
  private w = 0
  private h = 0
  private dpr = 1

  constructor(
    private canvas: HTMLCanvasElement,
    size = 40,
  ) {
    this.ctx = canvas.getContext('2d')
    this.pool = Array.from({ length: size }, () => ({
      active: false,
      trail: false,
      kind: 'heart' as ParticleKind,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      max: 1,
      size: 8,
      rot: 0,
      vr: 0,
      color: '#FF8FB5',
    }))
    this.resize()
  }

  resize(): void {
    this.dpr = dprCap()
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    this.canvas.style.width = `${this.w}px`
    this.canvas.style.height = `${this.h}px`
  }

  trailCount(): number {
    let n = 0
    for (const p of this.pool) if (p.active && p.trail) n++
    return n
  }

  spawn(kind: ParticleKind, x: number, y: number, o: SpawnOptions): boolean {
    const p = this.pool.find((q) => !q.active)
    if (!p) return false
    p.active = true
    p.trail = o.trail ?? false
    p.kind = kind
    p.x = x
    p.y = y
    p.vx = o.vx ?? 0
    p.vy = o.vy ?? 0
    p.life = 0
    p.max = o.life ?? 0.9
    p.size = o.size ?? 8
    p.rot = (Math.random() - 0.5) * 0.8
    p.vr = (Math.random() - 0.5) * 2
    p.color = o.color
    this.start()
    return true
  }

  setPaused(paused: boolean): void {
    this.paused = paused
    if (paused) {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    } else {
      this.start()
    }
  }

  private start(): void {
    if (this.raf || this.paused) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private tick = (now: number): void => {
    this.raf = 0
    const ctx = this.ctx
    if (!ctx) return
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.w, this.h)
    let alive = 0
    for (const p of this.pool) {
      if (!p.active) continue
      p.life += dt
      if (p.life >= p.max) {
        p.active = false
        continue
      }
      alive++
      const t = p.life / p.max
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy -= 18 * dt
      p.rot += p.vr * dt
      const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
      ctx.save()
      ctx.globalAlpha = Math.max(0, alpha)
      ctx.translate(p.x, p.y)
      if (p.kind === 'ring') {
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(0, 0, p.size * (0.3 + t * 1.7), 0, Math.PI * 2)
        ctx.stroke()
      } else {
        ctx.rotate(p.rot)
        const s = p.size * (1 - t * 0.3)
        ctx.fillStyle = p.color
        if (p.kind === 'heart') heartPath(ctx, s * 2)
        else if (p.kind === 'star') starPath(ctx, s)
        else sparklePath(ctx, s)
        ctx.fill()
      }
      ctx.restore()
    }
    if (alive > 0) this.raf = requestAnimationFrame(this.tick)
    else ctx.clearRect(0, 0, this.w, this.h)
  }

  destroy(): void {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.pool.forEach((p) => {
      p.active = false
    })
  }
}
