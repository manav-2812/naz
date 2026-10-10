/** Tells every Billi where to look (used for taps on touch screens). */
export const LOOK_EVENT = 'billi:look'

export interface LookDetail {
  x: number
  y: number
}

export function lookAt(x: number, y: number): void {
  window.dispatchEvent(new CustomEvent<LookDetail>(LOOK_EVENT, { detail: { x, y } }))
}
