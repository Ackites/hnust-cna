import { app, BrowserWindow, ipcMain, screen, shell } from 'electron'
import icon from '../../../../resources/icon.png'
import { electronApp, is } from '@electron-toolkit/utils'
import { join } from 'path'
import createTray from '../trayWindow/tray'
import { ipcMonitor } from '../../utils/ipc'
import { store } from '../../utils/store'

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#00000000',
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      devTools: is.dev,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  ipcMain.on('openDevTools', () => {
    mainWindow.webContents.openDevTools()
  })

  mainWindow.removeMenu()

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('dom-ready', (event, data) => {
    mainWindow.setSize(data.width + 16, data.height + 16)

    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const x = Math.round((width - mainWindow.getSize()[0]) / 2)
    const y = Math.round((height - mainWindow.getSize()[1]) / 2)
    mainWindow.setPosition(x, y)
    mainWindow.show()
  })

  // 当试图运行第二个实例时，这个事件会被触发
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当试图运行第二个实例时，这个事件会被触发
    // 我们将激活主窗口
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })
  // 创建store
  const useStore = store()
  //设置自启动
  electronApp.setAutoLaunch(useStore.get('setting.autoStart'))
  useStore.onDidChange('setting.autoStart', (newValue) => {
    electronApp.setAutoLaunch(newValue)
  })
  // 设置系统托盘
  createTray(mainWindow)
  // 监听ipc
  ipcMonitor(mainWindow, useStore)
}

export default createMainWindow
