import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import createMainWindow from './window/mainWindow/mainWindow'

// 为了确保应用只运行一个实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit() // 如果没有获取到锁，则直接退出
} else {
  app.whenReady().then(() => {
    optimizer.registerFramelessWindowIpc()
    // 解决透明窗口打开闪烁问题
    app.commandLine.appendSwitch('wm-window-animations-disabled')

    electronApp.setAppUserModelId('com.hnust-cna.app')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })

    // 创建主窗口
    createMainWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
