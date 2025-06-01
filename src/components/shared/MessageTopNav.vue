<template>
  <div class="message-top-nav">
    <div class="nav-content">
      <div class="left-section">
        <el-tooltip content="返回" placement="bottom">
          <button class="icon-btn" @click="goBack">
            <i class="el-icon-arrow-left" style="color: black"></i>
          </button>
        </el-tooltip>
      </div>
      <h1 class="page-title">消息中心</h1>
      <div class="right-section">
        <el-tooltip content="全部标记为已读" placement="bottom">
          <button class="icon-btn" @click="markAllAsRead">
            <i class="el-icon-check"></i>
          </button>
        </el-tooltip>
        <el-tooltip content="消息设置" placement="bottom">
          <button class="icon-btn" @click="openSettings">
            <i class="el-icon-setting"></i>
          </button>
        </el-tooltip>
      </div>
    </div>

    <!-- 消息设置弹窗 -->
    <el-dialog
      v-model="showSettings"
      title="消息设置"
      width="400px"
      custom-class="settings-dialog"
      :show-close="true"
    >
      <div class="settings-content">
        <div class="setting-item">
          <span class="setting-label">系统通知</span>
          <el-switch v-model="settings.systemNotification" />
        </div>
        <div class="setting-item">
          <span class="setting-label">交易提醒</span>
          <el-switch v-model="settings.transactionAlert" />
        </div>
        <div class="setting-item">
          <span class="setting-label">聊天消息</span>
          <el-switch v-model="settings.chatMessage" />
        </div>
        <div class="setting-item">
          <span class="setting-label">声音提醒</span>
          <el-switch v-model="settings.soundAlert" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showSettings = false">取消</el-button>
          <el-button type="primary" @click="saveSettings">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const showSettings = ref(false)
const settings = ref({
  systemNotification: true,
  transactionAlert: true,
  chatMessage: true,
  soundAlert: false,
})

const goBack = () => {
  router.back()
}

const markAllAsRead = () => {
  // 触发全局事件，让父组件处理标记已读逻辑
  emit('mark-all-read')
  ElMessage.success('已将所有消息标记为已读')
}

const openSettings = () => {
  showSettings.value = true
}

const saveSettings = () => {
  // 这里可以调用API保存设置
  ElMessage.success('设置已保存')
  showSettings.value = false
}

const emit = defineEmits(['mark-all-read'])
</script>

<style scoped>
.message-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: relative;
}

.left-section,
.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.right-section {
  justify-content: flex-end;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #131212;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: #fff5f0;
  color: #ff5722;
}

/* 设置弹窗样式 */
.settings-dialog {
  border-radius: 8px;
}

.settings-content {
  padding: 20px 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  font-size: 14px;
  color: #333;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

@media screen and (max-width: 768px) {
  .nav-content {
    padding: 0 16px;
  }

  .page-title {
    font-size: 18px;
  }
}
</style>
