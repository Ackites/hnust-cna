// 处理 Electron 多窗口与 Pinia 的状态共享问题的插件
export const shareStorePlugin = ({ store }) => {
  const storeName = store.$id // 获取 store 的名字

  // 重写状态同步方法，用于在状态更改时通知主进程
  store.stateSync = () => {
    updateStoreSync(stringify(store.$state), storeName)
  }

  // 监听来自主进程的状态更改的 IPC 消息，并更新当前进程的状态
  window.electron.ipcRenderer.on('pinia-store-set', (event, targetStoreName, jsonStr) => {
    console.log('被动更新哦')
    if (storeName === targetStoreName) {
      console.log('被动更新状态:' + storeName)
      const obj = JSON.parse(jsonStr)
      Object.entries(obj).forEach(([key, value]) => {
        changeState(store.$state, key, value)
      })
    }
  })
}

// 通知主进程状态已更改并更新缓存
const updateStoreSync = (stateJsonStr, storeName) => {
  window.electron.ipcRenderer.invoke('pinia-store-change', storeName, stateJsonStr)
}

// 根据 key 更新 state 的值，特别处理 Map 类型的字段
const changeState = (state, key, value) => {
  if (state[key] instanceof Map) {
    state[key] = Array.isArray(value) ? new Map(value) : new Map(Object.entries(value))
  } else {
    state[key] = value
  }
}

// 自定义序列化方法，特别处理 Map 类型的字段
const stringify = (obj) => {
  return JSON.stringify(cloneToObject(obj))
}

// 将包含 Map 的对象转换为普通对象形式
const cloneToObject = (obj) => {
  if (obj instanceof Map) {
    return Object.fromEntries(obj)
  } else if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, cloneToObject(value)])
    )
  } else if (Array.isArray(obj)) {
    return obj.map(cloneToObject)
  }
  return obj
}
