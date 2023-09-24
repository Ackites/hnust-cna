import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStoreValue } from '../../utils/store'

export const useSettingStore = defineStore(
  'setting',
  () => {
    const show = ref(false)
    const start = ref(false)

    const setting = ref({
      account: '',
      password: '',
      operator: '',
      autoStart: true
    })

    // 从store中获取数据，初始化setting
    getStoreValue('setting').then((value) => {
      if (!value?.account) return
      setting.value = value
    })

    return {
      show,
      setting,
      start
    }
  },
  {
    persist: true
  }
)
