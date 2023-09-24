import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { shareStorePlugin } from './plugins/shareStorePlugin'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(shareStorePlugin)
export default pinia
