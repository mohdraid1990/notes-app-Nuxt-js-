export default defineNuxtConfig({
  css: ['~/assets/styles/main.scss'],
  modules: ['@pinia/nuxt'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})