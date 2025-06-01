<template>
  <div class="message-tab-bar">
    <div class="tab-content">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-button"
        :class="{ active: activeTab === tab.value }"
        @click="$emit('update:activeTab', tab.value)"
      >
        <span class="tab-text">{{ tab.label }}</span>
        <span v-if="unreadCounts[tab.value]" class="unread-badge">
          {{ unreadCounts[tab.value] }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const tabs = [
  { label: '系统通知', value: 'system' },
  { label: '交易提醒', value: 'transaction' },
  { label: '聊天消息', value: 'chat' },
]

defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  unreadCounts: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['update:activeTab'])
</script>

<style scoped>
.message-tab-bar {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 99;
}

.tab-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
}

.tab-button {
  position: relative;
  height: 48px;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #ff5722;
  transition: width 0.3s ease;
}

.tab-button:hover {
  color: #ff5722;
}

.tab-button.active {
  color: #ff5722;
  font-weight: 500;
}

.tab-button.active::after {
  width: 24px;
}

.unread-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: #ff5722;
  color: #fff;
  border-radius: 9px;
  font-size: 12px;
  font-weight: normal;
}

@media screen and (max-width: 768px) {
  .tab-content {
    padding: 0 16px;
    gap: 24px;
  }

  .tab-button {
    padding: 0 12px;
    font-size: 14px;
  }
}
</style>
