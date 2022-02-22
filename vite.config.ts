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
      , "@cl/service": path.resolve(__dirname, "src/client/service")
      , "@cl/system": path.resolve(__dirname, "src/client/system")
      , "@sh/service": path.resolve(__dirname, "src/shared/service")
      , "@sh/system": path.resolve(__dirname, "src/shared/system")

      , "@models": path.resolve(__dirname, "src/shared/service/domain/models")
      , "@interfaces": path.resolve(__dirname, "src/shared/service/domain/interfaces")
      , "@usecases": path.resolve(__dirname, "src/shared/service/usecase")
      , "@apis": path.resolve(__dirname, "src/client/service/infrastructure/apis")
      , "@viewModels": path.resolve(__dirname, "src/client/service/presentation/viewModels")
      , "@views": path.resolve(__dirname, "src/client/service/presentation/views")
    }
  }
})