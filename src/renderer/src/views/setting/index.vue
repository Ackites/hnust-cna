<script setup>
import { useSettingStore } from '../../stores/modules/settingStore'
import { ref, watch } from 'vue'
import { setStoreValue } from '../../utils/store'

defineProps({
  visible: Boolean
})
const emit = defineEmits(['close'])

const settingStore = useSettingStore()

const form = ref({
  account: settingStore.setting.account,
  password: settingStore.setting.password,
  operator: settingStore.setting.operator,
  autoStart: settingStore.setting.autoStart
})

//监听form变化
watch(form.value, (newVal) => {
  settingStore.setting = newVal
  setStoreValue('setting', { ...newVal })
  //判读account、password和operator是否为空，去除空白字符
  settingStore.start = !!(newVal.account.trim() && newVal.password.trim() && newVal.operator.trim())
})

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div v-if="visible" class="overlay">
    <div class="setting-box">
      <div class="header">
        <div>设置</div>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="content">
        <el-form :model="form" label-width="65px" label-position="left">
          <el-form-item label="账户">
            <el-input v-model="form.account" placeholder="请输入账户" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="运营商">
            <el-radio-group v-model="form.operator">
              <el-radio label="电信" />
              <el-radio label="联通" />
              <el-radio label="移动" />
              <el-radio label="校园网" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="系统设置">
            <el-switch v-model="form.autoStart" size="small" />
            <span style="font-size: 12px; color: #83888f; margin-left: 10px">开机自启动</span>
          </el-form-item>
        </el-form>
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
  padding: 20px;
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
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
