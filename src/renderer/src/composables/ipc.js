export const useIpcRenderer = () => {
  const closeWindow = () => {
    console.log('closeWindow')
    window.electron.ipcRenderer.send('win:invoke', 'close')
  }
  const minimizeWindow = () => {
    console.log('minimizeWindow')
    window.electron.ipcRenderer.send('win:invoke', 'min')
  }

  const hideWindow = () => {
    console.log('hideWindow')
    window.electron.ipcRenderer.send('hideWindow')
  }

  const showWindow = () => {
    console.log('showWindow')
    window.electron.ipcRenderer.send('showWindow')
  }

  const getVersions = () => {
    return window.electron.ipcRenderer.invoke('get-versions')
  }

  const quitApp = () => {
    console.log('quitApp')
    window.electron.ipcRenderer.send('quitApp')
  }

  return {
    closeWindow,
    minimizeWindow,
    hideWindow,
    showWindow,
    getVersions,
    quitApp
  }
}
