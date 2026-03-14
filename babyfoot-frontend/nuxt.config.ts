// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000/',
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
