import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUpdateStore = defineStore('update', () => {
  const show = ref(false)

  return {
    show
  }
})
