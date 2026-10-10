/**
 * Romantic Time-of-Day Engine
 * Personalizes greetings and shifts hero sky colors based on her local time:
 * - Late Night (12 AM - 5 AM): Velvet starry night ("still awake, jannnnn? same. ♡")
 * - Sunrise / Dawn (5 AM - 9 AM): Pink sunrise & peach horizon ("good morning, jannnnn ☀️")
 * - Daytime (9 AM - 5 PM): Bright pastel blossom skies ("good morning / afternoon, sweet jannnnn ♡")
 * - Golden Hour / Dusk (5 PM - 8 PM): Rose & apricot sunset dusk ("good evening, prettiest girl 🌇")
 * - Night (8 PM - 12 AM): Romantic twilight starlight ("good night, sweet jannnnn 🌙")
 */

export interface TimeOfDayInfo {
  period: 'midnight' | 'dawn' | 'day' | 'sunset' | 'night'
  greeting: string
  whisper: string
  tag: string
  icon: string
  skyGradient: string
  isDarkSky: boolean
  accentColor: string
}

function getLocalHour(): number {
  try {
    const params = new URLSearchParams(window.location.search)
    const hourParam = params.get('hour')
    if (hourParam !== null) {
      const parsed = parseInt(hourParam, 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) {
        return parsed
      }
    }
  } catch {
    // fallback
  }
  return new Date().getHours()
}

export function getTimeOfDayInfo(forcedHour?: number): TimeOfDayInfo {
  const hour = forcedHour ?? getLocalHour()

  // 12:00 AM - 4:59 AM: Midnight / Late Night
  if (hour >= 0 && hour < 5) {
    return {
      period: 'midnight',
      greeting: 'still awake, jannnnn? same. ♡',
      whisper: "it's quiet midnight hours, potato. wishing you the sweetest dreams.",
      tag: 'midnight whispers 🌙',
      icon: '🌙',
      skyGradient: 'bg-gradient-to-b from-[#1f1035] via-[#2f1449] to-[#4a1c58]',
      isDarkSky: true,
      accentColor: '#f472b6',
    }
  }

  // 5:00 AM - 8:59 AM: Dawn / Sunrise
  if (hour >= 5 && hour < 9) {
    return {
      period: 'dawn',
      greeting: 'good morning, jannnnn ☀️',
      whisper: "the sun woke up, but you're still the brightest, prettiest thing today.",
      tag: 'sunrise pink 🌅',
      icon: '🌸',
      skyGradient: 'bg-gradient-to-b from-[#ffd3e4] via-[#fecdd3] to-[#fed7aa]',
      isDarkSky: false,
      accentColor: '#fb7185',
    }
  }

  // 9:00 AM - 4:59 PM: Daytime
  if (hour >= 9 && hour < 17) {
    const isAfternoon = hour >= 12
    return {
      period: 'day',
      greeting: isAfternoon ? 'good afternoon, sweet jannnnn 🍓' : 'good morning, sweet jannnnn ♡',
      whisper: 'hope you smile today. you make everything softer, sweeter, and happier.',
      tag: isAfternoon ? 'sunny afternoon 🌤️' : 'morning sunshine ☀️',
      icon: isAfternoon ? '🍓' : '☀️',
      skyGradient: 'bg-gradient-to-b from-[#fff0f4] via-[#ffe3ec] to-[#ffcfe0]',
      isDarkSky: false,
      accentColor: '#f2689a',
    }
  }

  // 5:00 PM - 7:59 PM: Golden Hour / Sunset Dusk
  if (hour >= 17 && hour < 20) {
    return {
      period: 'sunset',
      greeting: 'good evening, prettiest girl 🌇',
      whisper: 'the sky is turning soft pink and gold right now, almost as pretty as you.',
      tag: 'golden dusk ✨',
      icon: '🌇',
      skyGradient: 'bg-gradient-to-b from-[#fbcfe8] via-[#f472b6]/60 to-[#fdba74]',
      isDarkSky: false,
      accentColor: '#fb923c',
    }
  }

  // 8:00 PM - 11:59 PM: Night
  return {
    period: 'night',
    greeting: 'good night, sweet jannnnn 🌙',
    whisper: "thinking of you before the stars go to sleep. you're my favorite thought.",
    tag: 'starlight hours ✨',
    icon: '⭐',
    skyGradient: 'bg-gradient-to-b from-[#25103a] via-[#3a1650] to-[#531e68]',
    isDarkSky: true,
    accentColor: '#ec4899',
  }
}
