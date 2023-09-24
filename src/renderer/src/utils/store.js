// 获取store中的值
export const getStoreValue = (key) => {
  return window.electron.ipcRenderer.invoke('getStoreValue', key)
}

// 设置store中的值
export const setStoreValue = (key, value) => {
  return window.electron.ipcRenderer.invoke('setStoreValue', key, value)
}

// 删除store中的值
export const removeStoreValue = (key) => {
  return window.electron.ipcRenderer.invoke('removeStoreValue', key)
}

// 清除所有store中的值
export const clearStoreValue = () => {
  return window.electron.ipcRenderer.invoke('clearStoreValue')
}

// 监听store中的值的变化
export const onStoreValueChange = (key, callback) => {
  window.electron.ipcRenderer.send('onStoreValueChange', key)
  window.electron.ipcRenderer.on(key, callback)
}

// 监听store中整个对象的变化
export const onStoreChange = (callback) => {
  window.electron.ipcRenderer.on('store-change', callback)
}

// 检查store中是否存在某个值
export const hasStoreValue = (key) => {
  return window.electron.ipcRenderer.invoke('hasStoreValue', key)
}
