import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const createAutoImport = () => {
  return AutoImport({
    resolvers: [ElementPlusResolver()]
  })
}

export default createAutoImport
