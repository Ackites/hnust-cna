import vue from '@vitejs/plugin-vue'
import createAutoImport from './createAutoImport'
import createComponents from './createComponents'

export default function createVitePlugins() {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createComponents())
  return vitePlugins
}
