<script setup>
defineProps({
  visible: Boolean
})
const emit = defineEmits(['confirm', 'cancel', 'close'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div v-if="visible" class="overlay">
    <div class="dialog-box">
      <div class="header">
        <slot name="title">提示</slot>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div class="actions">
        <slot name="actions">
          <button @click="handleCancel">取消</button>
          <button @click="handleConfirm">确定</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 样式可以根据实际需要进行调整 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
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
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #666666;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
}

.content {
  padding: 15px 0;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;

  button {
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    margin-left: 20px;
    cursor: pointer;

    &:first-child {
      background-color: #e9ebef;

      &:hover {
        background-color: #e2e4e8;
      }
    }

    &:last-child {
      background-color: #0070ff;
      color: #fff;

      &:hover {
        background-color: #1283fa;
      }
    }
  }
}
</style>
