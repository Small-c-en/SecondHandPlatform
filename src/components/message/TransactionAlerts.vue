<template>
  <div class="transaction-alerts">
    <div
      v-for="message in transactionMessages"
      :key="message.id"
      class="message-card"
      :class="{ important: message.important }"
      @click="$emit('viewDetail', message.id)"
    >
      <div class="message-badge" v-if="message.important">
        <span class="badge-dot"></span>
      </div>
      <div class="message-content">
        <div class="message-type">
          <el-tag size="small" :type="message.type === 'order' ? 'success' : 'warning'">
            {{ message.type === 'order' ? '订单通知' : '评价提醒' }}
          </el-tag>
        </div>
        <p class="message-summary">{{ message.content }}</p>
        <span class="message-time">{{ message.time }}</span>
      </div>
      <div class="message-action">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div v-if="transactionMessages.length === 0" class="empty-state">
      <i class="el-icon-shopping-cart-2"></i>
      <p>暂无交易提醒</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  transactionMessages: { type: Array, required: true },
})

const emit = defineEmits(['viewDetail'])

const viewDetail = (id) => {
  // 跳转到对应订单或交易页面
  router.push('/order-detail/' + id)
}
</script>

<style scoped>
.transaction-alerts {
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

.message-card.important {
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
  min-width: 0;
}

.message-type {
  margin-bottom: 12px;
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
