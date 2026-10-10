import { defineConfig, type Plugin, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'

/** Fills in the site URL for share tags and preloads the display font. */
function siteMeta(): Plugin {
  const raw =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  const site = raw.replace(/\/$/, '')
  return {
    name: 'site-meta',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const out = html.replace(/__SITE_URL__/g, site)
        if (!ctx.bundle) return out
        const fonts = Object.keys(ctx.bundle).filter((f) => /fraunces-latin-full-normal.*\.woff2$/.test(f))
        const tags = fonts
          .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${f}" />`)
          .join('\n    ')
        return out.replace('</head>', `    ${tags}\n  </head>`)
      },
    },
  }
}

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react(), siteMeta()]
  try {
    await import('sharp')
    const { ViteImageOptimizer } = await import('vite-plugin-image-optimizer')
    plugins.push(
      ViteImageOptimizer({
        test: /\.(jpe?g|png|webp|avif)$/i,
        includePublic: true,
        logStats: false,
        jpeg: { quality: 82 },
        png: { quality: 85 },
        webp: { quality: 82 },
        avif: { quality: 60 },
      }),
    )
  } catch {
    console.warn('image optimizer skipped (sharp not available). photos will ship as they are.')
  }
  return {
    plugins,
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  }
})
