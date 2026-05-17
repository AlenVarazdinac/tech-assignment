import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  ssr: false,
  imports: {
    dirs: ['types']
  },
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
  experimental: {
    viteEnvironmentApi: true // https://github.com/nuxt/nuxt/issues/34957 - Workaround for SPA mode (ssr: false)
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
