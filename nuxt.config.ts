// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  css: [
    '@nordhealth/css',
    '@nordhealth/themes/lib/vet.css',
    '@nordhealth/themes/lib/vet-dark.css'
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('nord-')
    }
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true
    }
  }
})
