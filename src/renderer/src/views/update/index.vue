<script setup>
import { useIpcRenderer } from '../../composables/ipc'
import { ref } from 'vue'

defineProps({
  visible: Boolean
})
const emit = defineEmits(['close'])

const version = ref(null)
const newVersion = ref('0.0.0')
const percentage = ref(0)
const showProgress = ref(false)
const total = ref(null)
const transferred = ref(null)
const bytesPerSecond = ref(null)

useIpcRenderer()
  .getVersions()
  .then((res) => {
    version.value = res
  })

const handleClose = () => {
  emit('close')
}

const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number) // 将版本号字符串转换为数字数组
  const parts2 = v2.split('.').map(Number)

  // 循环遍历版本号的每一部分
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0 // 如果某一部分不存在，则默认为0
    const part2 = parts2[i] || 0

    // 进行比较
    if (part1 > part2) return 1
    if (part1 < part2) return -1
  }

  // 如果遍历完所有部分都相等，则两个版本号相等
  return 0
}

// 更新进度信息计算
const updateProgress = (progress) => {
  //总大小,单位为字节,转为MB
  total.value = (progress.total / 1024 / 1024).toFixed(2)
  //已下载大小,单位为字节,转为MB
  transferred.value = (progress.transferred / 1024 / 1024).toFixed(2)
  //下载速度单位为B/s,转为KB/s
  bytesPerSecond.value = (progress.bytesPerSecond / 1024).toFixed(2)
  //下载进度,转为整数
  percentage.value = parseInt(progress.percent)
  showProgress.value = true
}

const handleUpdate = () => {
  window.electron.ipcRenderer.send('auto-updater-download')
  showProgress.value = true
}

const update = () => {
  window.electron.ipcRenderer.on('auto-updater-error', (event, error) => {
    console.log('auto-updater-error', error)
  })
  window.electron.ipcRenderer.on('auto-updater-update-available', (event, arg) => {
    newVersion.value = arg.version
  })
  window.electron.ipcRenderer.on('auto-updater-update-not-available', (event, arg) => {
    newVersion.value = arg.version
  })
  window.electron.ipcRenderer.on('auto-updater-download-progress', (event, progress) => {
    updateProgress(progress)
  })
  window.electron.ipcRenderer.on('auto-updater-update-downloaded', (event, arg) => {
    window.electron.ipcRenderer.send('auto-updater-quit-and-install')
  })
}

update()
</script>

<template>
  <div v-if="visible" class="overlay">
    <div class="setting-box">
      <div class="header">
        <div>版本更新</div>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="content">
        <template v-if="showProgress">
          <el-progress :percentage="percentage" />
          <div class="content-text">{{ transferred }}MB / {{ total }}MB</div>
          <div class="content-text">下载速度：{{ bytesPerSecond }}KB/s</div>
        </template>
        <template v-else>
          <div class="content-text">当前版本：V{{ version }}，最新版本：V{{ newVersion }}</div>
          <div v-if="compareVersions(newVersion, version) === 1" class="update">
            <button @click="handleUpdate">立即更新</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting-box {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 2px 8px 3px rgba(0, 0, 0, 0.1);
  padding: 20px 20px 10px 20px;
  width: 230px; /* 或其他所需宽度 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    color: #666666;
    border-radius: 5px;
    cursor: pointer;
    -webkit-app-region: no-drag;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.content {
  padding: 15px 5px 10px 5px;

  .content-text {
    margin-top: 5px;
    font-size: 12px;
    color: #666666;
  }

  .update {
    display: flex;
    justify-content: end;
    align-items: center;
    margin-top: 20px;

    button {
      border: none;
      border-radius: 5px;
      padding: 8px 16px;
      margin-left: 20px;
      cursor: pointer;
      background-color: #0070ff;
      color: #fff;

      &:hover {
        background-color: #1283fa;
      }
    }
  }
}
</style>
