import tailwindcss from '@tailwindcss/vite'

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
    plugins: [tailwindcss()]
  },
  eslint: {
    config: {
      stylistic: true
    }
  }
})
