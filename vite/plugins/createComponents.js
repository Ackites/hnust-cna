import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const createComponents = () => {
  return Components({
    resolvers: [ElementPlusResolver()]
  })
}

export default createComponents
