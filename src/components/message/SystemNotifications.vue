<template>
  <div class="system-notifications">
    <div
      v-for="message in systemMessages"
      :key="message.id"
      class="message-card"
      :class="{ unread: !message.read }"
      @click="handleMessageClick(message)"
    >
      <div class="message-badge" v-if="!message.read">
        <span class="badge-dot"></span>
      </div>
      <div class="message-content">
        <h3 class="message-title">{{ message.title }}</h3>
        <p class="message-summary">{{ message.summary }}</p>
        <span class="message-time">{{ message.time }}</span>
      </div>
      <div class="message-action">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div v-if="systemMessages.length === 0" class="empty-state">
      <i class="el-icon-message"></i>
      <p>暂无系统消息</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  systemMessages: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['read-message'])

const handleMessageClick = (message) => {
  emit('read-message', message.id)
}
</script>

<style scoped>
.system-notifications {
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
  align-items: flex-start;
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

.badge-dot {
  display: block;
  width: 8px;
  height: 8px;
  background: #ff5722;
  border-radius: 50%;
}

.message-content {
  flex: 1;
  min-width: 0; /* 防止文本溢出 */
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.message-summary {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-time {
  font-size: 12px;
  color: #999;
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
