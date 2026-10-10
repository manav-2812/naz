/** Little canvas path helpers, all centred on (0,0). */
export function heartPath(ctx: CanvasRenderingContext2D, w: number): void {
  ctx.beginPath()
  ctx.moveTo(0, w * 0.38)
  ctx.bezierCurveTo(-w * 0.1, w * 0.28, -w * 0.52, w * 0.1, -w * 0.5, -w * 0.15)
  ctx.bezierCurveTo(-w * 0.48, -w * 0.44, -w * 0.1, -w * 0.5, 0, -w * 0.2)
  ctx.bezierCurveTo(w * 0.1, -w * 0.5, w * 0.48, -w * 0.44, w * 0.5, -w * 0.15)
  ctx.bezierCurveTo(w * 0.52, w * 0.1, w * 0.1, w * 0.28, 0, w * 0.38)
  ctx.closePath()
}

export function sparklePath(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.quadraticCurveTo(s * 0.13, -s * 0.13, s, 0)
  ctx.quadraticCurveTo(s * 0.13, s * 0.13, 0, s)
  ctx.quadraticCurveTo(-s * 0.13, s * 0.13, -s, 0)
  ctx.quadraticCurveTo(-s * 0.13, -s * 0.13, 0, -s)
  ctx.closePath()
}

export function starPath(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.48
    const a = (Math.PI / 5) * i - Math.PI / 2
    const x = Math.cos(a) * rad
    const y = Math.sin(a) * rad
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

export function pawPath(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath()
  ctx.ellipse(0, s * 0.18, s * 0.3, s * 0.24, 0, 0, Math.PI * 2)
  const toes: ReadonlyArray<readonly [number, number]> = [
    [-0.34, -0.12],
    [-0.12, -0.34],
    [0.12, -0.34],
    [0.34, -0.12],
  ]
  for (const [tx, ty] of toes) {
    ctx.moveTo(tx * s + s * 0.11, ty * s)
    ctx.ellipse(tx * s, ty * s, s * 0.11, s * 0.14, 0, 0, Math.PI * 2)
  }
}
