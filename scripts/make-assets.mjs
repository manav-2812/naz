// Regenerates public/grain.png and public/og-image.png. Run: node scripts/make-assets.mjs
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const size = 160
const rnd = mulberry32(1311)
const buf = Buffer.alloc(size * size * 4)
for (let i = 0; i < size * size; i++) {
  buf[i * 4] = 91
  buf[i * 4 + 1] = 42
  buf[i * 4 + 2] = 62
  buf[i * 4 + 3] = Math.floor(Math.pow(rnd(), 1.4) * 255)
}
await sharp(buf, { raw: { width: size, height: size, channels: 4 } }).png({ compressionLevel: 9 }).toFile('public/grain.png')

const heart = (x, y, s, fill) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40C-50 0 -60 -30 -35 -48 -15 -60 0 -45 0 -35 0 -45 15 -60 35 -48 60 -30 50 0 0 40Z" fill="${fill}" stroke="#5B2A3E" stroke-width="4" stroke-linejoin="round"/></g>`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8F4"/><stop offset=".6" stop-color="#FFE3EC"/><stop offset="1" stop-color="#FFCFE0"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
${heart(130, 120, 1.1, '#FF8FB5')}${heart(1060, 520, 1.5, '#F2689A')}${heart(1020, 130, 0.8, '#FFB5CD')}${heart(190, 520, 0.9, '#FFEBA8')}
<g transform="translate(600 150) rotate(-4)"><rect x="-230" y="-10" width="460" height="22" rx="6" fill="#FFEBA8" opacity=".9"/></g>
<text x="600" y="300" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="104" fill="#5B2A3E">happy 18th</text>
<text x="600" y="420" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="104" fill="#F2689A">birthday, naz</text>
<text x="600" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#8B5468">open me. billi is waiting.</text>
</svg>`
writeFileSync('public/og-image.svg', svg)
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og-image.png')
console.log('assets written')
