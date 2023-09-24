import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  isOnline: () => {
    return () => checkConnection()
  },
  checkCna: () => {
    return () => checkCna()
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

const { exec } = require('child_process')

function checkConnection() {
  return new Promise((resolve, reject) => {
    exec(`curl -Is -m 1 www.baidu.com`, (error, stdout) => {
      if (error) {
        resolve(false) // 如果有错误，解析为false
      } else {
        resolve(stdout.includes('200 OK')) // 如果没有错误，解析为true或false
      }
    })
  })
}

function checkCna() {
  return new Promise((resolve, reject) => {
    exec(`curl -Is -m 1 login.hnust.cn`, (error, stdout) => {
      if (error) {
        resolve(false) // 如果有错误，解析为false
      } else {
        resolve(stdout.includes('200 OK')) // 如果没有错误，解析为true或false
      }
    })
  })
}
