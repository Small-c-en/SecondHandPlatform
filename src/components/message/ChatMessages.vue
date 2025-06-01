<template>
  <div class="chat-messages">
    <div
      v-for="chat in chatConversations"
      :key="chat.id"
      class="message-card"
      :class="{ unread: chat.unreadCount > 0 }"
      @click="$emit('enterChat', chat.id)"
    >
      <div class="message-badge" v-if="chat.unreadCount > 0">
        <span class="badge-count">{{ chat.unreadCount }}</span>
      </div>
      <div class="avatar">
        <img :src="chat.avatar" :alt="chat.nickname" />
      </div>
      <div class="message-content">
        <div class="message-header">
          <h3 class="user-name">{{ chat.nickname }}</h3>
          <span class="message-time">{{ chat.time }}</span>
        </div>
        <p class="message-summary">{{ chat.lastMessage }}</p>
      </div>
      <div class="message-action">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div v-if="chatConversations.length === 0" class="empty-state">
      <i class="el-icon-chat-dot-round"></i>
      <p>暂无聊天消息</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  chatConversations: { type: Array, required: true },
})

const emit = defineEmits(['enterChat'])

const enterChat = (id) => {
  // 跳转到聊天窗口页面
  router.push('/chat/' + id)
}
</script>

<style scoped>
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-card {
  position: relative;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #ff5722;
}

.message-card.unread {
  background: #fff9f5;
}

.message-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.badge-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ff5722;
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-summary {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-action {
  color: #999;
  margin-left: 16px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.message-card:hover .message-action {
  color: #ff5722;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 动画效果 */
.message-card {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
