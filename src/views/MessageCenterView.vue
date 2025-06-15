<template>
  <div class="message-center">
    <!-- 消息 头 -->
    <MessageTopNav />
    <!-- 消息tabbar 系统通知、交易提醒、聊天消息 -->
    <MessageTabBar
      :activeTab="activeTab"
      :unreadCounts="unreadCounts"
      @update:activeTab="activeTab = $event"
    />
    <div class="message-content">
      <div class="message-container">
        <SystemNotifications
          v-if="activeTab === 'system'"
          :systemMessages="systemMessages"
          @read-message="markMessageAsRead"
        />
        <TransactionAlerts
          v-if="activeTab === 'transaction'"
          :transactionMessages="transactionMessages"
          @viewDetail="viewDetail"
        />
        <ChatMessages
          v-if="activeTab === 'chat'"
          :chatConversations="chatConversations"
          @enterChat="enterChat"
        />
      </div>
    </div>
    <MessageBottomBar @clearReadMessages="clearReadMessages" @scrollToTop="scrollToTop" />

    <!-- 系统消息弹窗 -->
    <el-dialog
      v-model="showMessageDialog"
      :title="currentMessage.title"
      width="500px"
      class="message-dialog"
      :show-close="true"
      @closed="handleDialogClose"
    >
      <div class="message-dialog-content">
        <div class="message-header">
          <div class="message-meta">
            <div class="message-type">
              <el-icon class="message-icon" :class="currentMessage.priority"><Bell /></el-icon>
              <span>系统通知</span>
            </div>
            <div class="message-tags">
              <el-tag
                v-if="currentMessage.priority"
                :type="currentMessage.priority === 'high' ? 'danger' : 'warning'"
                size="small"
                effect="light"
              >
                {{ currentMessage.priority === 'high' ? '重要' : '普通' }}
              </el-tag>
              <el-tag v-if="currentMessage.category" size="small" effect="plain">
                {{ currentMessage.category }}
              </el-tag>
            </div>
          </div>
          <div class="message-time">{{ currentMessage.time }}</div>
        </div>

        <div class="message-body">
          <div class="message-title">{{ currentMessage.title }}</div>
          <div class="message-content" v-html="currentMessage.summary"></div>

          <div
            v-if="currentMessage.attachments && currentMessage.attachments.length"
            class="message-attachments"
          >
            <div class="attachments-title">
              <el-icon><Document /></el-icon>
              <span>附件</span>
            </div>
            <div class="attachments-list">
              <div
                v-for="(attachment, index) in currentMessage.attachments"
                :key="index"
                class="attachment-item"
                @click="downloadAttachment(attachment)"
              >
                <div class="attachment-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="attachment-info">
                  <div class="attachment-name">{{ attachment.name }}</div>
                  <div class="attachment-size">{{ attachment.size }}</div>
                </div>
                <el-button type="primary" link>
                  <el-icon><Download /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <div
            v-if="currentMessage.actions && currentMessage.actions.length"
            class="message-actions"
          >
            <el-button
              v-for="action in currentMessage.actions"
              :key="action.type"
              :type="action.type"
              :icon="action.icon"
              @click="handleAction(action)"
            >
              {{ action.text }}
            </el-button>
          </div>
        </div>

        <div class="message-footer">
          <div class="message-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>消息将在确认后标记为已读</span>
          </div>
          <div class="message-actions">
            <el-button @click="showMessageDialog = false">关闭</el-button>
            <el-button
              type="primary"
              @click="handleConfirmRead"
              :disabled="currentMessage.read"
              :icon="currentMessage.read ? 'Select' : 'Check'"
            >
              {{ currentMessage.read ? '已读' : '标记已读' }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, InfoFilled, Document, Download } from '@element-plus/icons-vue'
import MessageTopNav from '@/components/shared/MessageTopNav.vue'
import MessageTabBar from '@/components/shared/MessageTabBar.vue'
import SystemNotifications from '@/components/message/SystemNotifications.vue'
import TransactionAlerts from '@/components/message/TransactionAlerts.vue'
import ChatMessages from '@/components/message/ChatMessages.vue'
import MessageBottomBar from '@/components/shared/MessageBottomBar.vue'

const router = useRouter()

// 初始化数据
const activeTab = ref('system')
const showMessageDialog = ref(false)
const currentMessage = ref({})
const unreadCounts = ref({
  system: 2, // 系统通知未读数
  transaction: 3, // 交易提醒未读数
  chat: 4, // 聊天消息未读数
})

const systemMessages = ref([
  {
    id: 1,
    title: '平台重要公告',
    summary: '平台将于近期进行系统维护...',
    time: '2024-07-01 10:00',
    read: false,
    unreadCount: 1,
  },
  {
    id: 2,
    title: '夏季促销活动',
    summary: '全场商品低至 5 折，快来抢购...',
    time: '2024-06-30 15:30',
    read: true,
    unreadCount: 0,
  },
])

const transactionMessages = ref([
  {
    id: 1,
    type: 'order',
    content: '您的订单已发货',
    important: true,
    time: '2024-07-01 14:00',
    unreadCount: 2,
  },
  {
    id: 2,
    type: 'review',
    content: '买家已付款，请及时发货',
    important: false,
    time: '2024-07-01 13:00',
    unreadCount: 1,
  },
])

const chatConversations = ref([
  {
    id: 1,
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.nKetvjjSggVKwC55M-AzUwAAAA?rs=1&pid=ImgDetMain',
    nickname: '买家 A',
    lastMessage: '请问商品什么时候发货？',
    unreadCount: 2,
    time: '2024-07-01 16:00',
  },
  {
    id: 2,
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.Knh5i_ceDHm_cwzEcKFJ2gAAAA?w=219&h=219&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    nickname: '卖家 B',
    lastMessage: '已发货，请耐心等待',
    unreadCount: 2,
    time: '2024-07-01 15:00',
  },
])

// 更新未读消息总数的计算属性
const totalUnreadCount = computed(() => {
  return Object.values(unreadCounts.value).reduce((sum, count) => sum + count, 0)
})

// 查看系统消息
const viewSystemMessage = (message) => {
  currentMessage.value = message
  showMessageDialog.value = true
}

// 标记消息为已读
const markMessageAsRead = (messageId) => {
  const message = systemMessages.value.find((msg) => msg.id === messageId)
  viewSystemMessage(message)
  if (message && !message.read) {
    message.read = true
    unreadCounts.value.system = Math.max(0, unreadCounts.value.system - 1)
  }
}

// 处理弹窗关闭
const handleDialogClose = () => {
  if (!currentMessage.value.read) {
    markMessageAsRead(currentMessage.value.id)
  }
}

// 确认已读
const handleConfirmRead = () => {
  markMessageAsRead(currentMessage.value.id)
  showMessageDialog.value = false
}

// 清空已读消息
const clearReadMessages = () => {
  systemMessages.value = systemMessages.value.filter((msg) => !msg.read)
  transactionMessages.value = transactionMessages.value.filter((msg) => msg.unreadCount > 0)
  chatConversations.value = chatConversations.value.filter((chat) => chat.unreadCount > 0)
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 查看详情
const viewDetail = (id) => {
  router.push('/order-detail/' + id)
}

// 进入聊天窗口
const enterChat = (id) => {
  router.push('/chat/' + id)
}

// 下载附件
const downloadAttachment = (attachment) => {
  // 实现下载附件的逻辑
}

// 处理动作
const handleAction = (action) => {
  // 实现处理动作的逻辑
}
</script>

<style scoped>
.message-center {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;
}

.message-content {
  margin-top: 105px;
  padding: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.message-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  min-height: calc(100vh - 200px);
}

/* 消息弹窗样式 */
.message-dialog {
  border-radius: 16px;
}

.message-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 0;
  border-bottom: none;
}

.message-dialog :deep(.el-dialog__title) {
  display: none;
}

.message-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.message-dialog-content {
  color: #333;
}

.message-header {
  padding: 24px;
  background: linear-gradient(135deg, #fff8f0 0%, #fff5f0 100%);
  border-bottom: 1px solid #ffe4d6;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.message-icon {
  font-size: 24px;
  color: #ff6f00;
}

.message-icon.high {
  color: #f56c6c;
}

.message-tags {
  display: flex;
  gap: 8px;
}

.message-time {
  font-size: 13px;
  color: #999;
}

.message-body {
  padding: 24px;
  background: #fff;
}

.message-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.message-content {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  white-space: pre-wrap;
  margin-bottom: 24px;
}

.message-attachments {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.attachments-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  background: #f0f0f0;
}

.attachment-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border-radius: 6px;
  color: #666;
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  font-size: 12px;
  color: #999;
}

.message-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.message-footer {
  padding: 16px 24px;
  background: #f8f8f8;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
}

.message-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 768px) {
  .message-dialog {
    width: 90% !important;
  }

  .message-header {
    padding: 16px;
  }

  .message-body {
    padding: 16px;
  }

  .message-title {
    font-size: 18px;
  }

  .message-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .message-actions {
    width: 100%;
  }

  .message-actions .el-button {
    flex: 1;
  }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .message-content {
    padding: 10px;
  }

  .message-container {
    padding: 16px;
    border-radius: 8px;
  }
}

/* 滚动条样式 */
.message-container {
  scrollbar-width: thin;
  scrollbar-color: #ff5722 #f5f5f5;
}

.message-container::-webkit-scrollbar {
  width: 6px;
}

.message-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.message-container::-webkit-scrollbar-thumb {
  background-color: #ff5722;
  border-radius: 3px;
}

/* 动画效果 */
.message-container {
  transition: all 0.3s ease;
}

.message-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>
