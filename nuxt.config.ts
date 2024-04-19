// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path"

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  routeRules: {
    "/": { prerender: true },
    /* 對所有使用的路由執行相同操作 */
  },
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          additionalData: `@import "${path.resolve(
            __dirname,
            "./assets/style.styl"
          )}"`,
        },
      },
    },
  },
})
