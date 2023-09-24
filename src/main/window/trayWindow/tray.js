import { Tray } from 'electron'
import icon from '../../../../resources/icon.png?asset'
import { creatTrayWindow } from './trayWindow'

const createTray = (mainWindow) => {
  const appTray = new Tray(icon)
  appTray.setToolTip('科大校园网小助手')
  appTray.on('click', () => {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    } else if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
  })

  creatTrayWindow(appTray)
}

export default createTray
