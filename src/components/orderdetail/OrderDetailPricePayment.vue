<template>
  <div class="detail-card order-detail-payment">
    <h3 class="section-title">支付信息</h3>
    <div class="payment-info">
      <template v-if="paymentInfo.status === '待付款'">
        <div class="payment-countdown" v-if="remainingTime">剩余支付时间：{{ remainingTime }}</div>
        <div class="payment-method-selection">
          <div class="method-title">选择支付方式：</div>
          <div class="method-buttons">
            <button
              class="method-btn"
              :class="{ active: paymentInfo.paymentMethod === 'wechat' }"
              @click="handlePaymentMethodSelect('wechat')"
              data-method="wechat"
            >
              <i class="fab fa-weixin"></i>
              微信支付
            </button>
            <button
              class="method-btn"
              :class="{ active: paymentInfo.paymentMethod === 'alipay' }"
              @click="handlePaymentMethodSelect('alipay')"
              data-method="alipay"
            >
              <i class="fab fa-alipay"></i>
              支付宝支付
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="payment-row">
          <span class="label">支付方式</span>
          <span class="value">{{ paymentInfo.paymentMethodName || '未选择' }}</span>
        </div>
        <div class="payment-row">
          <span class="label">支付时间</span>
          <span class="value">{{ paymentInfo.paymentTime || '-' }}</span>
        </div>
        <div class="payment-row">
          <span class="label">交易单号</span>
          <span class="value">{{ paymentInfo.transactionId || '-' }}</span>
        </div>
      </template>
      <div class="payment-amount">
        <div class="original-price" v-if="paymentInfo.originalAmount !== paymentInfo.actualAmount">
          原价：¥{{ paymentInfo.originalAmount }}
        </div>
        <div class="discount" v-for="discount in paymentInfo.discounts" :key="discount.label">
          {{ discount.label }}：-¥{{ discount.amount }}
        </div>
        <div class="actual-price">
          实付金额：<span class="price">¥{{ paymentInfo.actualAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  paymentInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-payment-method'])

// 格式化倒计时显示
const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const remainingTime = computed(() => {
  if (props.paymentInfo.countdown) {
    return formatCountdown(props.paymentInfo.countdown)
  }
  return null
})

const handlePaymentMethodSelect = (method) => {
  emit('select-payment-method', method)
}
</script>

<style scoped>
.detail-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.payment-method-selection {
  margin: 16px 0;
}

.method-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.method-buttons {
  display: flex;
  gap: 16px;
}

.method-btn {
  flex: 1;
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.method-btn[data-method='wechat'] {
  color: #666;
}

.method-btn[data-method='wechat']:hover,
.method-btn[data-method='wechat'].active {
  border-color: #07c160;
  color: #07c160;
  background: #f6ffed;
}

.method-btn[data-method='alipay'] {
  color: #666;
}

.method-btn[data-method='alipay']:hover,
.method-btn[data-method='alipay'].active {
  border-color: #1677ff;
  color: #1677ff;
  background: #e6f7ff;
}

.method-btn i {
  font-size: 20px;
}

.payment-countdown {
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 500;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.payment-row .label {
  color: #666;
}

.payment-row .value {
  color: #333;
}

.payment-amount {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.original-price,
.discount {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.actual-price {
  margin-top: 8px;
  font-weight: 500;
}

.price {
  color: #ff5722;
  font-size: 20px;
  font-weight: bold;
}
</style>
