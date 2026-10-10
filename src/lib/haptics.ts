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
   * Ultra-light tick (10ms) - for small button taps, toggles, stickers.
   */
  light: (): void => {
    safeVibrate(10)
  },

  /**
   * Crisp tactile tap (15ms) - for gift box taps.
   */
  tap: (): void => {
    safeVibrate(15)
  },

  /**
   * Playful double-tap pulse ([15, 35, 20] ms) - for secondary gift box tap.
   */
  doubleTap: (): void => {
    safeVibrate([15, 35, 20])
  },

  /**
   * Romantic heartbeat pulse ([15, 45, 25] ms) - for heart bursts!
   */
  heart: (): void => {
    safeVibrate([15, 45, 25])
  },

  /**
   * Celebratory vibration ([20, 45, 20, 45, 35] ms) - for gift opening, candle blowout, high score.
   */
  celebrate: (): void => {
    safeVibrate([20, 45, 20, 45, 35])
  },
}
