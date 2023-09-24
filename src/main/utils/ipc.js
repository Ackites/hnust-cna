import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

export const ipcMonitor = (mainWindow, store) => {
  windowEvent(mainWindow)

  trayEvent(mainWindow)

  storeEvent(mainWindow, store)

  shareStoreEvent()

  autoUpdaterEvent(mainWindow)
}

// 窗口事件函数
const windowEvent = (mainWindow) => {
  // 获取版本号
  ipcMain.handle('get-versions', () => {
    return app.getVersion()
  })

  // 显示主窗口
  ipcMain.on('showWindow', () => {
    mainWindow.focus()
    mainWindow.show()
  })

  // 隐藏窗口
  ipcMain.on('hideWindow', (event) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.blur()
    win.hide()
  })

  // 关闭程序
  ipcMain.on('quitApp', () => {
    app.quit()
  })

  //鼠标穿透
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.setIgnoreMouseEvents(ignore, options)
  })
}

// 托盘事件函数
const trayEvent = (mainWindow) => {
  // 当渲染器进程 托盘 请求通信时
  ipcMain.on('message-from-tray', (event, message) => {
    // 当接收到来自渲染器进程 托盘 的消息时，转发给渲染器进程 主窗口
    mainWindow.webContents.send('message-to-main', message)
  })
}

// store事件函数
const storeEvent = (mainWindow, store) => {
  // 获取store中的值
  ipcMain.handle('getStoreValue', (event, key) => {
    return store.get(key)
  })

  // 设置store中的值
  ipcMain.handle('setStoreValue', (event, key, value) => {
    store.set(key, value)
  })

  // 删除store中的值
  ipcMain.handle('removeStoreValue', (event, key) => {
    store.delete(key)
  })

  // 清除所有store中的值
  ipcMain.handle('clearStoreValue', () => {
    store.clear()
  })

  // 监听store中的值的变化
  ipcMain.on('onStoreValueChange', (event, key) => {
    store.onDidChange(key, (newValue, oldValue) => {
      mainWindow.webContents.send(key, newValue, oldValue)
    })
  })

  // 监听store中整个对象的变化
  store.onDidAnyChange((newValue, oldValue) => {
    mainWindow.webContents.send('store-change', newValue, oldValue)
  })

  // 检查store中是否存在某个值
  ipcMain.handle('hasStoreValue', (event, key) => {
    return store.has(key)
  })
}

// 处理pinia状态共享的事件函数
const shareStoreEvent = () => {
  // 使用pinia进行多窗口状态共享
  ipcMain.handle('pinia-store-change', (event, storeName, jsonStr) => {
    // 遍历所有窗口
    for (const currentWin of BrowserWindow.getAllWindows()) {
      const webContentsId = currentWin.webContents.id

      // 若当前窗口不是发起事件的窗口且窗口还未被销毁
      if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
        // 向该窗口发送 pinia-store-set 事件，以更新其状态
        currentWin.webContents.send('pinia-store-set', storeName, jsonStr)
      }
    }
  })
}

// 自动更新
const autoUpdaterEvent = (mainWindow) => {
  // 是否自动更新，如果为true，当可以更新时(update-available)自动执行更新下载。
  autoUpdater.autoDownload = false
  autoUpdater.autoRunAppAfterInstall = true
  // 监听渲染器进程的自动更新事件
  ipcMain.on('auto-updater', (event, message) => {
    autoUpdater.checkForUpdates()
  })

  // 更新有错误时
  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('auto-updater-error', error)
  })

  // 检查更新的返回结果
  autoUpdater.on('checking-for-update', (arg) => {
    mainWindow.webContents.send('auto-updater-checking-for-update', arg)
  })

  // 有可用更新时
  autoUpdater.on('update-available', (arg) => {
    mainWindow.webContents.send('auto-updater-update-available', arg)
  })

  // 判断执行更新
  ipcMain.on('auto-updater-download', (event, arg) => {
    autoUpdater.downloadUpdate()
  })

  // 当前版本为最新版本时
  autoUpdater.on('update-not-available', (arg) => {
    mainWindow.webContents.send('auto-updater-update-not-available', arg)
  })

  // 更新下载进度
  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('auto-updater-download-progress', progress)
  })

  // 更新下载完成
  autoUpdater.on('update-downloaded', (arg) => {
    mainWindow.webContents.send('auto-updater-update-downloaded', arg)
  })

  // 更新下载完成后，重启应用并安装更新
  ipcMain.on('auto-updater-quit-and-install', (event, arg) => {
    autoUpdater.quitAndInstall()
    if (mainWindow && mainWindow.destroy) mainWindow.destroy()
    app.quit()
  })
}
