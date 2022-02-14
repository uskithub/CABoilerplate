import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from '@vuetify/vite-plugin'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    , vuetify({
      autoImport: true,
    })
  ]
  , define: { 'process.env': {} }
  , resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/")
      , "@views": path.resolve(__dirname, "src/service/presentation/views")
      , "@usecases": path.resolve(__dirname, "src/service/application/usecases")
      , "@interfaces": path.resolve(__dirname, "src/service/domain/interfaces")
    }
  }
})