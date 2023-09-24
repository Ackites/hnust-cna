import { BrowserWindow, ipcMain, screen } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

export const creatTrayWindow = (appTray) => {
  let trayMenuWindow = new BrowserWindow({
    show: false,
    frame: false,
    fullscreenable: false,
    backgroundColor: '#00000000',
    maximizable: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/trayPreload.js'),
      devTools: is.dev,
      sandbox: false
    }
  })

  trayMenuWindow.removeMenu()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    trayMenuWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/tray`)
  } else {
    trayMenuWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'tray'
    })
  }

  ipcMain.on('tray-dom-ready', (event, data) => {
    trayMenuWindow.setSize(data.width + 16, data.height + 16)
  })

  appTray.on('right-click', () => {
    if (trayMenuWindow.isVisible()) {
      trayMenuWindow.hide()
    } else {
      let { width: screenWidth } = screen.getPrimaryDisplay().size
      const [trayMenuWidth, trayMenuHeight] = trayMenuWindow.getSize()
      let { x, y } = screen.getCursorScreenPoint()
      if (x + trayMenuWidth > screenWidth) {
        trayMenuWindow.setPosition(x - trayMenuWidth, y - trayMenuHeight)
      } else {
        trayMenuWindow.setPosition(x - 8, y - trayMenuHeight + 8)
      }
      trayMenuWindow.focus()
      trayMenuWindow.show()
    }
  })

  trayMenuWindow.on('closed', () => {
    trayMenuWindow = null
  })

  trayMenuWindow.on('blur', () => {
    trayMenuWindow.hide()
  })
}
