import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const darkThemeCSS = readFileSync(
  resolve('node_modules/@nordhealth/themes/lib/vet-dark.css'),
  'utf-8'
)

const virtualDarkTheme = {
  name: 'virtual-nord-dark-theme',
  resolveId (id: string) {
    if (id === 'virtual:nord-dark-theme') return '\0virtual:nord-dark-theme'
  },
  load (id: string) {
    if (id === '\0virtual:nord-dark-theme') {
      return `export default ${JSON.stringify(darkThemeCSS)}`
    }
  }
}

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@nordhealth/themes/lib/vet.css'
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('nord-')
    }
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [tailwindcss(), virtualDarkTheme]
  },
  eslint: {
    config: {
      stylistic: true
    }
  }
})
