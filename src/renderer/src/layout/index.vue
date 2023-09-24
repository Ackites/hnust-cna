<script setup>
import Header from './components/header.vue'
import { useIpcRenderer } from '../composables/ipc'
import { onMounted, ref } from 'vue'
import DialogBox from '../components/dialogBox/index.vue'
import { WarningFilled } from '@element-plus/icons-vue'

const { quitApp } = useIpcRenderer()

const isDialogVisible = ref(false)

const show = () => {
  isDialogVisible.value = true
}

const handleConfirm = () => {
  quitApp()
}

const handleCancel = () => {
  isDialogVisible.value = false
}

const handleClose = () => {
  isDialogVisible.value = false
}

//监听托盘消息
window.electron.ipcRenderer.on('message-to-main', (event, message) => {
  if (message === 'quit-app') {
    show()
  }
})

//发送页面大小
onMounted(() => {
  const element = document.getElementById('main')
  if (element) {
    window.electron.ipcRenderer.send('dom-ready', {
      width: element.offsetWidth,
      height: element.offsetHeight
    })
  }
})
</script>

<template>
  <div id="main" ref="main">
    <Header />
    <div class="content">
      <router-view :key="$route.fullPath" />
    </div>
    <DialogBox
      :visible="isDialogVisible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="handleClose"
    >
      <template #title>
        <div style="display: flex; align-items: center">
          <el-icon color="#0070FF" :size="24">
            <WarningFilled />
          </el-icon>
          <span style="margin-left: 5px">提示</span>
        </div>
      </template>
      <template #content>
        <div>确定退出？退出后您将无法享受自动联网</div>
      </template>
      <template #actions></template>
    </DialogBox>
  </div>
</template>

<style scoped lang="scss">
#main {
  margin: 0;
  padding: 0;
  width: 300px;
  height: 400px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px 3px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

.content {
  padding: 20px;
}
</style>
