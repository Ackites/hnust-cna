import { resolve } from 'path'
import { defineConfig, defineViteConfig, externalizeDepsPlugin } from 'electron-vite'
import createVitePlugins from './vite/plugins'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.js'),
          trayPreload: resolve(__dirname, 'src/preload/trayPreload.js')
        }
      }
    }
  },
  renderer: defineViteConfig(({ command, mode }) => {
    return {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: createVitePlugins(),
      css: {
        preprocessorOptions: {
          scss: {
            //自动导入定制化样式文件进行样式覆盖
            additionalData: `
          @use "@renderer/styles/var.scss" as *;
        `
          }
        }
      },
      server: {
        port: 5173
      }
    }
  })
})
