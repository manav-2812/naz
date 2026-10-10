import { config } from '../../data/config'
import { copy } from '../../data/copy'
import { clamp, dprCap, isLowEnd, prefersReducedMotion } from '../../lib/device'
import { heartPath, pawPath, sparklePath } from '../../lib/shapes'
import { sfx } from '../../lib/sfx'

const P = config.palette
const GAME_SECONDS = 30
const ENTITY_POOL = 36
const SPARK_POOL = 48
const POP_POOL = 8

type Kind = 'cake' | 'heart' | 'paw' | 'potato'

interface Entity {
  active: boolean
  kind: Kind
  x: number
  y: number
  vy: number
  rot: number
  vr: number
  wob: number
  phase: number
}

interface Spark {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
}

interface Pop {
  active: boolean
  text: string
  x: number
  y: number
  life: number
  color: string
}

export interface Engine {
  start: () => void
  resize: (w: number, h: number) => void
  setPaused: (paused: boolean) => void
  destroy: () => void
}

export interface EngineEvents {
  onEnd: (score: number) => void
}

type Draw = (ctx: CanvasRenderingContext2D, s: number) => void

function makeSprite(w: number, h: number, dpr: number, draw: Draw): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = Math.ceil(w * dpr)
  c.height = Math.ceil(h * dpr)
  const ctx = c.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
    ctx.translate(w / 2, h / 2)
    draw(ctx, Math.min(w, h))
  }
  return c
}

const stroke = (ctx: CanvasRenderingContext2D, width = 3): void => {
  ctx.lineWidth = width
  ctx.strokeStyle = P.cocoa
  ctx.lineJoin = 'round'
  ctx.stroke()
}

const drawHeart: Draw = (ctx, s) => {
  heartPath(ctx, s * 0.86)
  ctx.fillStyle = P.bubblegum
  ctx.fill()
  stroke(ctx)
  ctx.beginPath()
  ctx.arc(-s * 0.2, -s * 0.12, s * 0.06, 0, Math.PI * 2)
  ctx.fillStyle = P.milk
  ctx.fill()
}

const drawCake: Draw = (ctx, s) => {
  const w = s * 0.82
  const h = s * 0.5
  ctx.beginPath()
  ctx.roundRect(-w / 2, -h / 2 + s * 0.08, w, h, s * 0.08)
  ctx.fillStyle = P.blush
  ctx.fill()
  stroke(ctx)
  ctx.beginPath()
  ctx.moveTo(-w / 2, -h / 2 + s * 0.12)
  for (let i = 0; i < 4; i++) {
    const x0 = -w / 2 + (w / 4) * i
    ctx.quadraticCurveTo(x0 + w / 8, -h / 2 - s * 0.14, x0 + w / 4, -h / 2 + s * 0.12)
  }
  ctx.closePath()
  ctx.fillStyle = P.strawberry
  ctx.fill()
  stroke(ctx)
  ctx.beginPath()
  ctx.arc(0, -h / 2 - s * 0.08, s * 0.1, 0, Math.PI * 2)
  ctx.fillStyle = P.rose
  ctx.fill()
  stroke(ctx, 2.5)
}

const drawPaw: Draw = (ctx, s) => {
  ctx.beginPath()
  ctx.arc(0, 0, s * 0.46, 0, Math.PI * 2)
  ctx.fillStyle = P.butter
  ctx.fill()
  stroke(ctx)
  pawPath(ctx, s * 0.62)
  ctx.fillStyle = P.rose
  ctx.fill()
}

const drawPotato: Draw = (ctx, s) => {
  ctx.beginPath()
  ctx.ellipse(0, 0, s * 0.44, s * 0.36, -0.12, 0, Math.PI * 2)
  ctx.fillStyle = '#F2D3A9'
  ctx.fill()
  stroke(ctx)
  ctx.fillStyle = '#E3B98A'
  ctx.beginPath()
  ctx.ellipse(-s * 0.2, -s * 0.16, s * 0.05, s * 0.03, 0, 0, Math.PI * 2)
  ctx.ellipse(s * 0.2, s * 0.17, s * 0.05, s * 0.03, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = P.cocoa
  ctx.beginPath()
  ctx.arc(-s * 0.13, -s * 0.02, s * 0.04, 0, Math.PI * 2)
  ctx.arc(s * 0.13, -s * 0.02, s * 0.04, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-s * 0.1, s * 0.12)
  ctx.quadraticCurveTo(0, s * 0.2, s * 0.1, s * 0.12)
  ctx.lineWidth = 2.5
  ctx.strokeStyle = P.cocoa
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.fillStyle = P.strawberry
  ctx.beginPath()
  ctx.ellipse(-s * 0.26, s * 0.08, s * 0.06, s * 0.04, 0, 0, Math.PI * 2)
  ctx.ellipse(s * 0.26, s * 0.08, s * 0.06, s * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()
}

type Mood = 'open' | 'happy' | 'dizzy'

/** Billi holding a woven basket. Mouth of the basket is at 58% of the height. */
function drawBilli(mood: Mood): Draw {
  return (ctx, s) => {
    void s
    const w = 120
    const h = 110
    ctx.translate(-w / 2, -h / 2)
    // ears
    ctx.beginPath()
    ctx.moveTo(24, 40)
    ctx.lineTo(20, 8)
    ctx.lineTo(48, 24)
    ctx.closePath()
    ctx.moveTo(96, 40)
    ctx.lineTo(100, 8)
    ctx.lineTo(72, 24)
    ctx.closePath()
    ctx.fillStyle = P.milk
    ctx.fill()
    stroke(ctx)
    ctx.fillStyle = P.strawberry
    ctx.beginPath()
    ctx.moveTo(27, 34)
    ctx.lineTo(25, 17)
    ctx.lineTo(40, 26)
    ctx.closePath()
    ctx.moveTo(93, 34)
    ctx.lineTo(95, 17)
    ctx.lineTo(80, 26)
    ctx.closePath()
    ctx.fill()
    // head
    ctx.beginPath()
    ctx.ellipse(60, 46, 40, 34, 0, 0, Math.PI * 2)
    ctx.fillStyle = P.milk
    ctx.fill()
    stroke(ctx)
    ctx.fillStyle = P.strawberry
    ctx.globalAlpha = 0.75
    ctx.beginPath()
    ctx.ellipse(33, 56, 7, 4.5, 0, 0, Math.PI * 2)
    ctx.ellipse(87, 56, 7, 4.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    // eyes
    ctx.strokeStyle = P.cocoa
    ctx.fillStyle = P.cocoa
    ctx.lineWidth = 3.5
    ctx.lineCap = 'round'
    if (mood === 'open') {
      ctx.beginPath()
      ctx.ellipse(44, 45, 4.5, 6, 0, 0, Math.PI * 2)
      ctx.ellipse(76, 45, 4.5, 6, 0, 0, Math.PI * 2)
      ctx.fill()
    } else if (mood === 'happy') {
      ctx.beginPath()
      ctx.moveTo(38, 49)
      ctx.quadraticCurveTo(44, 38, 50, 49)
      ctx.moveTo(70, 49)
      ctx.quadraticCurveTo(76, 38, 82, 49)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(39, 40)
      ctx.lineTo(49, 50)
      ctx.moveTo(49, 40)
      ctx.lineTo(39, 50)
      ctx.moveTo(71, 40)
      ctx.lineTo(81, 50)
      ctx.moveTo(81, 40)
      ctx.lineTo(71, 50)
      ctx.stroke()
    }
    // nose and mouth
    ctx.fillStyle = P.rose
    ctx.beginPath()
    ctx.moveTo(56, 55)
    ctx.quadraticCurveTo(60, 52, 64, 55)
    ctx.quadraticCurveTo(62, 60, 60, 60)
    ctx.quadraticCurveTo(58, 60, 56, 55)
    ctx.fill()
    ctx.lineWidth = 2.2
    ctx.strokeStyle = P.cocoa
    ctx.beginPath()
    if (mood === 'dizzy') {
      ctx.ellipse(60, 66, 4, 3, 0, 0, Math.PI * 2)
    } else {
      ctx.moveTo(60, 60)
      ctx.quadraticCurveTo(55, 67, 49, 63)
      ctx.moveTo(60, 60)
      ctx.quadraticCurveTo(65, 67, 71, 63)
    }
    ctx.stroke()
    // paws on the rim
    ctx.fillStyle = P.milk
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(26, 66, 10, 7, 0, 0, Math.PI * 2)
    ctx.ellipse(94, 66, 10, 7, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // basket
    ctx.beginPath()
    ctx.moveTo(8, 64)
    ctx.lineTo(112, 64)
    ctx.lineTo(102, 106)
    ctx.quadraticCurveTo(60, 112, 18, 106)
    ctx.closePath()
    ctx.fillStyle = P.butter
    ctx.fill()
    stroke(ctx)
    ctx.strokeStyle = '#E2B957'
    ctx.lineWidth = 2
    for (let x = 22; x < 104; x += 14) {
      ctx.beginPath()
      ctx.moveTo(x, 68)
      ctx.lineTo(x - 3, 104)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(14, 84)
    ctx.lineTo(106, 84)
    ctx.stroke()
    ctx.beginPath()
    ctx.roundRect(4, 60, 112, 9, 4.5)
    ctx.fillStyle = P.bubblegum
    ctx.fill()
    ctx.strokeStyle = P.cocoa
    ctx.lineWidth = 3
    ctx.stroke()
  }
}

/** The whole game on one canvas. No React in the loop, nothing allocated per frame. */
export function createEngine(canvas: HTMLCanvasElement, events: EngineEvents): Engine {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { start: () => undefined, resize: () => undefined, setPaused: () => undefined, destroy: () => undefined }
  const reduced = prefersReducedMotion()
  const low = isLowEnd()

  const entities: Entity[] = Array.from({ length: ENTITY_POOL }, () => ({ active: false, kind: 'cake', x: 0, y: 0, vy: 0, rot: 0, vr: 0, wob: 0, phase: 0 }))
  const sparks: Spark[] = Array.from({ length: SPARK_POOL }, () => ({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, size: 4, color: P.rose }))
  const pops: Pop[] = Array.from({ length: POP_POOL }, () => ({ active: false, text: '', x: 0, y: 0, life: 0, color: P.cocoa }))

  let W = 360
  let H = 450
  let dpr = 1
  let u = 1
  let S = 56
  let sprites: Record<Kind, HTMLCanvasElement> | null = null
  let billi: Record<Mood, HTMLCanvasElement> | null = null
  let bw = 110
  let bh = 100

  let raf = 0
  let last = 0
  let running = false
  let paused = false
  let elapsed = 0
  let timeLeft = GAME_SECONDS
  let score = 0
  let combo = 0
  let slow = 0
  let spawnIn = 0.6
  let basketX = W / 2
  let targetX = W / 2
  let happyT = 0
  let bonkT = 0
  let squash = 0
  let shake = 0
  const keys = { left: false, right: false }

  const buildSprites = (): void => {
    u = clamp(W / 360, 0.85, 1.45)
    S = Math.round(58 * u)
    bw = Math.round(112 * u)
    bh = Math.round(102 * u)
    sprites = {
      cake: makeSprite(S, S, dpr, drawCake),
      heart: makeSprite(S, S, dpr, drawHeart),
      paw: makeSprite(S, S, dpr, drawPaw),
      potato: makeSprite(S, S, dpr, drawPotato),
    }
    const mk = (m: Mood): HTMLCanvasElement => {
      const c = document.createElement('canvas')
      c.width = Math.ceil(bw * dpr)
      c.height = Math.ceil(bh * dpr)
      const g = c.getContext('2d')
      if (g) {
        g.scale((dpr * bw) / 120, (dpr * bh) / 110)
        g.translate(60, 55)
        drawBilli(m)(g, 120)
      }
      return c
    }
    billi = { open: mk('open'), happy: mk('happy'), dizzy: mk('dizzy') }
  }

  const resize = (w: number, h: number): void => {
    const ow = W
    const oh = H
    W = Math.max(240, Math.round(w))
    H = Math.max(240, Math.round(h))
    dpr = dprCap()
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    basketX = (basketX / ow) * W
    targetX = (targetX / ow) * W
    for (const e of entities) {
      if (!e.active) continue
      e.x = (e.x / ow) * W
      e.y = (e.y / oh) * H
    }
    buildSprites()
    if (!running) frame(0)
  }

  const spark = (x: number, y: number, n: number, colors: string[]): void => {
    if (reduced) return
    let made = 0
    for (const p of sparks) {
      if (made >= (low ? Math.ceil(n / 2) : n)) break
      if (p.active) continue
      const a = Math.random() * Math.PI * 2
      const s = 60 + Math.random() * 130
      p.active = true
      p.x = x
      p.y = y
      p.vx = Math.cos(a) * s
      p.vy = Math.sin(a) * s - 40
      p.life = 0.5 + Math.random() * 0.4
      p.size = (3 + Math.random() * 4) * u
      p.color = colors[Math.floor(Math.random() * colors.length)] ?? P.rose
      made++
    }
  }

  const pop = (text: string, x: number, y: number, color: string): void => {
    const p = pops.find((q) => !q.active)
    if (!p) return
    p.active = true
    p.text = text
    p.x = x
    p.y = y
    p.life = 0.9
    p.color = color
  }

  const spawn = (): void => {
    const e = entities.find((q) => !q.active)
    if (!e) return
    const r = Math.random()
    e.kind = r < 0.3 ? 'heart' : r < 0.7 ? 'cake' : r < 0.93 ? 'potato' : 'paw'
    e.active = true
    e.x = S * 0.6 + Math.random() * (W - S * 1.2)
    e.y = -S
    e.vy = H * (0.36 + (elapsed / GAME_SECONDS) * 0.24) * (0.85 + Math.random() * 0.3)
    e.rot = (Math.random() - 0.5) * 0.6
    e.vr = (Math.random() - 0.5) * 1.6
    e.wob = (6 + Math.random() * 14) * u
    e.phase = Math.random() * 6
  }

  const mouthY = (): number => H - bh - 8 + bh * 0.58

  const catchIt = (e: Entity): void => {
    e.active = false
    const x = e.x
    const y = mouthY()
    if (e.kind === 'potato') {
      score = Math.max(0, score - 1)
      combo = 0
      bonkT = 0.55
      shake = reduced ? 0 : 0.35
      squash = 1.4
      pop(copy.game.bonk, x, y - 30 * u, P.cocoa)
      spark(x, y, 8, ['#E3B98A', '#F2D3A9'])
      sfx.bonk()
      return
    }
    happyT = 0.35
    squash = 0.8
    sfx.catch()
    if (e.kind === 'paw') {
      slow = 5
      pop(config.ui.slow, x, y - 30 * u, P.rose)
      spark(x, y, 14, [P.butter, P.bubblegum, P.milk])
      return
    }
    const pts = e.kind === 'heart' ? 2 : 1
    score += pts
    combo += 1
    pop(`+${pts}`, x, y - 30 * u, P.rose)
    spark(x, y, 6, [P.bubblegum, P.petal, P.butter])
    if (combo >= 5) {
      combo = 0
      score += 1
      pop(config.ui.wow, W / 2, H * 0.4, P.rose)
      spark(W / 2, H * 0.4, 22, [P.bubblegum, P.butter, P.milk, P.rose])
    }
  }

  const update = (dt: number): void => {
    const gdt = dt * (slow > 0 ? 0.5 : 1)
    timeLeft -= dt
    elapsed += dt
    slow = Math.max(0, slow - dt)
    happyT = Math.max(0, happyT - dt)
    bonkT = Math.max(0, bonkT - dt)
    squash = Math.max(0, squash - dt * 3.2)
    shake = Math.max(0, shake - dt)

    if (keys.left) targetX -= 560 * u * dt
    if (keys.right) targetX += 560 * u * dt
    targetX = clamp(targetX, bw * 0.4, W - bw * 0.4)
    basketX += (targetX - basketX) * Math.min(1, 16 * dt)

    spawnIn -= gdt
    if (spawnIn <= 0) {
      spawn()
      spawnIn = (0.78 - (elapsed / GAME_SECONDS) * 0.28) * (0.8 + Math.random() * 0.4)
    }

    const my = mouthY()
    const half = bw * 0.36
    for (const e of entities) {
      if (!e.active) continue
      e.y += e.vy * gdt
      e.phase += gdt * 2.4
      e.x += Math.sin(e.phase) * e.wob * gdt
      e.rot += e.vr * gdt
      const r = S * 0.34
      if (e.y + r >= my && e.y - r <= my + 26 * u && Math.abs(e.x - basketX) < half + r * 0.35) {
        catchIt(e)
        continue
      }
      if (e.y - S > H) {
        e.active = false
        if (e.kind === 'cake' || e.kind === 'heart') combo = 0
      }
    }

    for (const p of sparks) {
      if (!p.active) continue
      p.life -= dt
      if (p.life <= 0) {
        p.active = false
        continue
      }
      p.vy += 420 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
    for (const p of pops) {
      if (!p.active) continue
      p.life -= dt
      p.y -= 38 * dt
      if (p.life <= 0) p.active = false
    }

    if (timeLeft <= 0) end()
  }

  const font = (px: number, weight = 600): string => `${weight} ${Math.round(px)}px "Fredoka Variable", "Trebuchet MS", sans-serif`

  const frame = (now: number): void => {
    void now
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.save()
    if (shake > 0) ctx.translate((Math.random() - 0.5) * 8 * shake, (Math.random() - 0.5) * 8 * shake)
    if (slow > 0) {
      ctx.fillStyle = 'rgba(255,143,181,0.13)'
      ctx.fillRect(0, 0, W, H)
    }
    if (sprites) {
      for (const e of entities) {
        if (!e.active) continue
        ctx.save()
        ctx.translate(e.x, e.y)
        ctx.rotate(e.rot)
        ctx.drawImage(sprites[e.kind], -S / 2, -S / 2, S, S)
        ctx.restore()
      }
    }
    if (billi) {
      const mood: Mood = bonkT > 0 ? 'dizzy' : happyT > 0 ? 'happy' : 'open'
      const sx = 1 + squash * 0.09
      const sy = 1 - squash * 0.1
      ctx.save()
      ctx.translate(basketX, H - 8)
      ctx.scale(sx, sy)
      ctx.drawImage(billi[mood], -bw / 2, -bh, bw, bh)

      // If high score reached (score >= 5), Billi wears her party hat!
      if (score >= 5) {
        ctx.save()
        ctx.translate(0, -bh + 22)
        // Pom-pom on hat apex
        ctx.beginPath()
        ctx.arc(0, -28, 4.5, 0, Math.PI * 2)
        ctx.fillStyle = P.butter
        ctx.fill()
        ctx.strokeStyle = P.cocoa
        ctx.lineWidth = 2
        ctx.stroke()
        // Party cone
        ctx.beginPath()
        ctx.moveTo(0, -26)
        ctx.lineTo(-14, 0)
        ctx.lineTo(14, 0)
        ctx.closePath()
        ctx.fillStyle = P.rose
        ctx.fill()
        ctx.strokeStyle = P.cocoa
        ctx.lineWidth = 2.2
        ctx.stroke()
        // Festive polka dots
        ctx.fillStyle = P.butter
        ctx.beginPath()
        ctx.arc(-4, -8, 2, 0, Math.PI * 2)
        ctx.arc(4, -14, 2, 0, Math.PI * 2)
        ctx.arc(1, -4, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.restore()
    }
    for (const p of sparks) {
      if (!p.active) continue
      ctx.save()
      ctx.globalAlpha = clamp(p.life * 2.2, 0, 1)
      ctx.translate(p.x, p.y)
      ctx.fillStyle = p.color
      sparklePath(ctx, p.size)
      ctx.fill()
      ctx.restore()
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const p of pops) {
      if (!p.active) continue
      ctx.globalAlpha = clamp(p.life * 1.6, 0, 1)
      ctx.font = font(22 * u, 700)
      ctx.lineWidth = 5
      ctx.strokeStyle = P.milk
      ctx.strokeText(p.text, p.x, p.y)
      ctx.fillStyle = p.color === P.rose ? '#C0386A' : p.color
      ctx.fillText(p.text, p.x, p.y)
    }
    ctx.globalAlpha = 1
    ctx.restore()

    // hud
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'left'
    ctx.font = font(18 * Math.min(u, 1.15))
    ctx.fillStyle = P.cocoa
    ctx.fillText(`${config.ui.score} ${score}`, 14, 28)
    ctx.textAlign = 'right'
    ctx.fillText(`${config.ui.time} ${Math.max(0, Math.ceil(timeLeft))}`, W - 14, 28)
    const pillW = 22
    const startX = W / 2 - (5 * (pillW + 4)) / 2
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.roundRect(startX + i * (pillW + 4), 14, pillW, 10, 5)
      ctx.fillStyle = i < combo ? P.bubblegum : P.petal
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = P.cocoa
      ctx.stroke()
    }
  }

  const loop = (now: number): void => {
    raf = 0
    if (!running || paused) return
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    update(dt)
    if (running) {
      frame(now)
      raf = requestAnimationFrame(loop)
    }
  }

  function end(): void {
    running = false
    cancelAnimationFrame(raf)
    raf = 0
    frame(0)
    events.onEnd(score)
  }

  const onPointer = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse' && e.buttons === 0 && e.type === 'pointermove') return
    const rect = canvas.getBoundingClientRect()
    targetX = clamp(((e.clientX - rect.left) / rect.width) * W, bw * 0.4, W - bw * 0.4)
  }
  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft') keys.left = true
    else if (e.key === 'ArrowRight') keys.right = true
    else return
    if (running) e.preventDefault()
  }
  const onKeyUp = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft') keys.left = false
    else if (e.key === 'ArrowRight') keys.right = false
  }
  canvas.addEventListener('pointerdown', onPointer)
  canvas.addEventListener('pointermove', onPointer)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  return {
    start: () => {
      entities.forEach((e) => {
        e.active = false
      })
      sparks.forEach((p) => {
        p.active = false
      })
      pops.forEach((p) => {
        p.active = false
      })
      score = 0
      combo = 0
      slow = 0
      elapsed = 0
      timeLeft = GAME_SECONDS
      spawnIn = 0.4
      happyT = 0
      bonkT = 0
      squash = 0
      shake = 0
      running = true
      paused = false
      last = performance.now()
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    },
    resize,
    setPaused: (p) => {
      paused = p
      if (p) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (running && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    },
    destroy: () => {
      running = false
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onPointer)
      canvas.removeEventListener('pointermove', onPointer)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    },
  }
}
