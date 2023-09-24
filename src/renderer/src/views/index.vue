<script setup>
import { useSettingStore } from '../stores/modules/settingStore'
import { computed, ref } from 'vue'
import Setting from './setting/index.vue'
import Update from './update/index.vue'
import { Check, Close } from '@element-plus/icons-vue'
import axios from 'axios'
import { useUpdateStore } from '../stores/modules/updateStore'

const settingStore = useSettingStore()
const updateStore = useUpdateStore()

const isVisible = ref(computed(() => settingStore.show))
const updateVisible = computed(() => updateStore.show)
const online = ref(true)
const isOnline = window.api.isOnline()
const checkCna = window.api.checkCna()
const start = computed(() => settingStore.start)
const account = computed(() => settingStore.setting.account)
const password = computed(() => settingStore.setting.password)
const isp = computed(() => settingStore.setting.operator)
const handleClose = () => {
  settingStore.show = false
}

const updateClose = () => {
  updateStore.show = false
}

const login = (account, password, isp) => {
  let suffix = ''
  switch (isp) {
    case '校园网':
      suffix = ''
      break
    case '移动':
      suffix = '@cmcc'
      break
    case '电信':
      suffix = '@telecom'
      break
    case '联通':
      suffix = '@unicom'
      break
    default:
      break
  }
  axios({
    method: 'get',
    url: 'http://login.hnust.cn:801/eportal',
    params: {
      c: 'Portal',
      a: 'login',
      login_method: '1',
      user_account: account + suffix,
      user_password: password,
      wlan_user_ip: '0.0.0.0'
    }
  })
}

function checkOnline() {
  isOnline()
    .then((res) => {
      online.value = res
      if (res) {
        isCnaFlag = true
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

setInterval(checkOnline, 1000)

let allowFlag = true
let isCnaFlag = true

function isCna() {
  if (!allowFlag) return
  if (online.value) return
  if (!isCnaFlag) return
  if (!start.value || isVisible.value) return
  allowFlag = false
  checkCna()
    .then((res) => {
      if (res && start.value) {
        login(account.value, password.value, isp.value)
      }
      if (!res) {
        isCnaFlag = false
      }
      allowFlag = true
    })
    .catch((err) => {
      console.log(err)
    })
}

setInterval(isCna, 1000)

window.electron.ipcRenderer.on('auto-updater-update-available', (event, arg) => {
  updateStore.show = true
})

window.electron.ipcRenderer.send('auto-updater', 'checkForUpdates')
</script>

<template>
  <div style="height: 100%">
    <div class="main-content">
      <template v-if="online">
        <el-progress type="circle" :percentage="100" status="success">
          <el-button type="success" :icon="Check" circle />
        </el-progress>
        <el-tag style="margin-top: 20px" class="ml-2" type="success">网络状态：正常</el-tag>
      </template>
      <template v-else>
        <el-progress type="circle" :percentage="50" status="exception">
          <el-button type="danger" :icon="Close" circle />
        </el-progress>
        <el-tag style="margin-top: 20px" class="ml-2" type="danger">网络状态：异常</el-tag>
      </template>
    </div>
    <div class="footer">
      <el-button color="#0070ff" size="large" style="width: 70%" @click="settingStore.show = true"
        >设&nbsp&nbsp&nbsp&nbsp置
      </el-button>
    </div>
  </div>
  <Setting :visible="isVisible" @close="handleClose" />
  <Update :visible="updateVisible" @close="updateClose" />
</template>

<style scoped lang="scss">
.main-content {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
