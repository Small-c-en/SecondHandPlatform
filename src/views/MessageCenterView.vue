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
        <div class="message-info">
          <el-icon class="message-icon" color="#ff5722"><Bell /></el-icon>
          <span class="message-type">系统通知</span>
          <span class="message-time">{{ currentMessage.time }}</span>
        </div>
        <div class="message-body">
          <h4 class="message-title">{{ currentMessage.title }}</h4>
          <div class="message-summary" v-html="currentMessage.summary"></div>
        </div>
        <div class="message-footer">
          <span class="message-tip">
            <el-icon><InfoFilled /></el-icon>
            消息将在确认后标记为已读
          </span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
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
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, InfoFilled } from '@element-plus/icons-vue'
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
  border-radius: 8px;
}

.message-dialog :deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f8f8;
}

.message-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.message-dialog-content {
  color: #333;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #fff5f0;
  border-bottom: 1px solid #ffe4d6;
}

.message-icon {
  font-size: 24px;
  color: #ff5722;
}

.message-type {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.message-time {
  font-size: 14px;
  color: #999;
  margin-left: auto;
}

.message-body {
  padding: 24px;
  background: #fff;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px;
}

.message-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.message-footer {
  padding: 16px 24px;
  background: #f8f8f8;
  border-top: 1px solid #f0f0f0;
}

.message-tip {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dialog-footer {
  padding: 16px 24px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.dialog-footer .el-button {
  margin-left: 12px;
  min-width: 90px;
}

.message-dialog :deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
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
