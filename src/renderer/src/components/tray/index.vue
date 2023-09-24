<script setup>
import { useIpcRenderer } from '../../composables/ipc'
import { Connection, SwitchButton } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useSettingStore } from '../../stores/modules/settingStore'

const { showWindow } = useIpcRenderer()

const showApp = () => {
  showWindow()
}
const closeApp = () => {
  useSettingStore().show = false
  useSettingStore().stateSync()
  sendMsg('quit-app')
  showWindow()
}

// 向主进程发送消息
const sendMsg = (message) => {
  window.electron.ipcRenderer.send('message-from-tray', message)
}

//发送页面大小
onMounted(() => {
  const element = document.querySelector('.tray-menu')
  if (element) {
    window.electron.ipcRenderer.send('tray-dom-ready', {
      width: element.offsetWidth,
      height: element.offsetHeight
    })
  }
})

//托盘鼠标穿透
onMounted(() => {
  const el = document.querySelector('.tray-menu')

  // 当鼠标进入 .tray-menu 时，不忽略鼠标事件
  el?.addEventListener('mouseenter', () => {
    window.electron.ipcRenderer.send('set-ignore-mouse-events', false)
  })

  // 当鼠标离开 .tray-menu 时，忽略鼠标事件
  el?.addEventListener('mouseleave', () => {
    window.electron.ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
  })
})
</script>

<template>
  <div class="tray-menu">
    <div class="trayMenu" @click="showApp">
      <el-icon :size="20" color="#0070FF">
        <Connection />
      </el-icon>
      <span class="showMenu">打开应用</span>
    </div>
    <div class="trayMenu exit" @click="closeApp">
      <el-icon :size="16">
        <SwitchButton />
      </el-icon>
      <span class="showMenu">退出</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tray-menu {
  background-color: #ffffff;
  width: 120px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 1px 2px 8px 3px rgba(0, 0, 0, 0.1);
}

.trayMenu {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }
}

.showMenu {
  margin-left: 10px;
}

.exit {
  color: #ff4d4f;
}
</style>
