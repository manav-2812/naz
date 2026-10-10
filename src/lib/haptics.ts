/**
 * Soft, battery-friendly haptic vibrations for mobile devices.
 * Gracefully no-ops on desktop and unsupported browsers.
 */
function safeVibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern)
    }
  } catch (err) {
    void err
  }
}

export const haptics = {
  /**
   * Ultra-light micro-tick (8ms) - for heart phrases locking into place and particle effects.
   */
  heartTick: (): void => {
    safeVibrate(8)
  },

  /**
   * Ultra-light tick (10ms) - for small button taps, toggles, stickers.
   */
  light: (): void => {
    safeVibrate(10)
  },

  /**
   * Crisp tactile tap (15ms) - for gift box taps, photo taps, catches.
   */
  tap: (): void => {
    safeVibrate(15)
  },

  /**
   * Playful double-tap pulse ([15, 35, 20] ms) - for secondary gift box tap, bonks, wax cracking.
   */
  doubleTap: (): void => {
    safeVibrate([15, 35, 20])
  },

  /**
   * Romantic heartbeat pulse ([18, 55, 28] ms) - classic dual lub-dub heartbeat.
   */
  heartbeat: (): void => {
    safeVibrate([18, 55, 28])
  },

  /**
   * Romantic heartbeat pulse ([16, 48, 26] ms) - for heart bursts & canvas taps.
   */
  heart: (): void => {
    safeVibrate([16, 48, 26])
  },

  /**
   * Full heart formed crescendo ([24, 55, 18, 65, 32] ms) - deep romantic multi-stage pulse when the heart is completely built!
   */
  heartComplete: (): void => {
    safeVibrate([24, 55, 18, 65, 32])
  },

  /**
   * Soothing cat purr ([10, 30, 10, 30, 12] ms) - when petting Billi.
   */
  purr: (): void => {
    safeVibrate([10, 30, 10, 30, 12])
  },

  /**
   * Celebratory vibration ([20, 45, 20, 45, 35] ms) - for gift opening, candle blowout, password unlock, high score.
   */
  celebrate: (): void => {
    safeVibrate([20, 45, 20, 45, 35])
  },
}
