<script setup>
import { CloseBold, SemiSelect, Setting } from '@element-plus/icons-vue'
import { useIpcRenderer } from '../../composables/ipc'
import icon from '../../assets/images/icon.png'
import { ref } from 'vue'
import { useSettingStore } from '../../stores/modules/settingStore'
import { useUpdateStore } from '../../stores/modules/updateStore'

const { hideWindow, minimizeWindow } = useIpcRenderer()

const version = ref(null)

const minimize = () => {
  minimizeWindow()
}
const close = () => {
  hideWindow()
}

const settingHandle = () => {
  useSettingStore().show = true
}

const checkVersion = () => {
  useUpdateStore().show = true
  window.electron.ipcRenderer.send('auto-updater', 'checkForUpdates')
}

useIpcRenderer()
  .getVersions()
  .then((res) => {
    version.value = res
  })
</script>

<template>
  <div class="header" style="display: flex; align-items: center; justify-content: space-between">
    <div style="display: flex; align-items: center">
      <el-image :src="icon" class="logo" />
      <span class="version" @click="checkVersion">V{{ version }}</span>
    </div>
    <el-row justify="end" align="middle">
      <el-icon color="#83888F" :size="16" class="setting" @click="settingHandle">
        <Setting />
      </el-icon>
      <el-divider direction="vertical" />
      <div class="group">
        <button class="actions" @click="minimize">
          <el-icon :size="16">
            <SemiSelect />
          </el-icon>
        </button>
        <button class="actions" @click="close">
          <el-icon :size="16">
            <CloseBold />
          </el-icon>
        </button>
      </div>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.header {
  -webkit-app-region: drag;
}

.logo {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-right: 10px;
}

.version {
  color: #83888f;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.el-row {
  padding: 20px;

  .setting {
    margin-right: 5px;
    padding: 5px;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }

  .group {
    display: flex;
    align-items: center;
    justify-content: center;

    .actions {
      -webkit-app-region: no-drag;
      border-radius: 5px;
      border: none;
      background: none;
      color: #616369;
      padding: 5px 10px;
      display: flex;
      cursor: pointer;

      &:first-child {
        &:hover {
          background-color: #f5f5f5;
        }
      }

      &:last-child {
        margin-left: 10px;

        &:hover {
          background-color: #f56c6c;
          color: #fff;
        }
      }
    }
  }
}
</style>
