<template>
  <div class="payment-success-page">
    <div class="success-card">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h1>支付成功</h1>
      <div class="payment-info">
        <div class="amount">¥{{ route.query.amount }}</div>
        <div class="method">{{ route.query.method }}</div>
      </div>
      <div class="order-info">
        <div class="info-item">
          <span class="label">订单编号：</span>
          <span class="value">{{ route.query.orderId }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付时间：</span>
          <span class="value">{{ paymentTime }}</span>
        </div>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="viewOrder">查看订单</button>
        <button class="secondary-btn" @click="backToHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 格式化当前时间作为支付时间
const paymentTime = ref(
  new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }),
)

const viewOrder = () => {
  router.push(`/order/${route.query.orderId}`)
}

const backToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.payment-success-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.success-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 24px;
}

.success-icon i {
  animation: scale-in 0.5s ease;
}

h1 {
  color: #333;
  font-size: 24px;
  margin: 0 0 24px;
}

.payment-info {
  margin-bottom: 32px;
}

.amount {
  font-size: 36px;
  color: #ff5722;
  font-weight: bold;
  margin-bottom: 8px;
}

.method {
  color: #666;
  font-size: 16px;
}

.order-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.primary-btn,
.secondary-btn {
  padding: 0 24px;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #1890ff;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #40a9ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.secondary-btn {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.secondary-btn:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
