<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="确认支付"
    width="580px"
    :close-on-click-modal="false"
    :show-close="true"
    class="payment-confirm-modal"
    @close="handleClose"
  >
    <div class="payment-confirm-content">
      <!-- 商品信息区域 -->
      <div class="products-section">
        <div class="products-header">
          <span>商品信息</span>
          <span v-if="products.length > 1" class="total-count">共{{ products.length }}件</span>
        </div>
        <div class="products-list" :class="{ 'single-product': products.length === 1 }">
          <div v-for="product in products" :key="product.id" class="product-item">
            <img :src="product.thumbnail" :alt="product.name" class="product-img" />
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-specs">{{ product.specs }}</div>
              <div class="product-price-qty">
                <span class="price">¥{{ product.price }}</span>
                <span class="quantity">x{{ product.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付信息区域 -->
      <div class="payment-info-section">
        <div class="payment-row">
          <span>支付方式</span>
          <span class="payment-method">
            <i :class="paymentMethodIcon"></i>
            {{ paymentMethodName }}
          </span>
        </div>
        <div class="payment-row">
          <span>商品总额</span>
          <span>¥{{ totalProductAmount }}</span>
        </div>
        <div class="payment-row" v-if="orderData.payment.discounts?.length">
          <span>优惠金额</span>
          <span class="discount-amount">-¥{{ totalDiscountAmount }}</span>
        </div>
        <div class="payment-row total">
          <span>实付金额</span>
          <span class="final-amount">¥{{ orderData.payment.actualAmount }}</span>
        </div>
      </div>

      <!-- 倒计时和提示 -->
      <div class="payment-tips">
        <div class="countdown" v-if="orderData.payment.countdown">
          <i class="el-icon-time"></i>
          支付剩余时间：{{ formatCountdown(orderData.payment.countdown) }}
        </div>
        <div class="security-tip">
          <i class="el-icon-lock"></i>
          安全支付提示：请核对商品信息和实付金额，确认无误后点击确认支付
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消支付</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">
          确认支付 ¥{{ orderData.payment.actualAmount }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  orderData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
const confirmLoading = ref(false)

// 计算商品列表
const products = computed(() => {
  return props.orderData.products || [props.orderData.product]
})

// 计算总商品金额
const totalProductAmount = computed(() => {
  return products.value
    .reduce((sum, product) => {
      return sum + product.price * product.quantity
    }, 0)
    .toFixed(2)
})

// 计算总优惠金额
const totalDiscountAmount = computed(() => {
  return (props.orderData.payment.discounts || [])
    .reduce((sum, discount) => {
      return sum + parseFloat(discount.amount)
    }, 0)
    .toFixed(2)
})

// 支付方式图标和名称
const paymentMethodIcon = computed(() => {
  const method = props.orderData.payment.paymentMethod
  return method === 'wechat' ? 'fab fa-weixin' : 'fab fa-alipay'
})

const paymentMethodName = computed(() => {
  return props.orderData.payment.paymentMethodName
})

// 格式化倒计时
const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

// 处理关闭
const handleClose = () => {
  emit('update:visible', false)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  handleClose()
}

// 处理确认
const handleConfirm = async () => {
  confirmLoading.value = true
  try {
    await emit('confirm')
  } finally {
    confirmLoading.value = false
  }
}
</script>

<style scoped>
.payment-confirm-modal {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.payment-confirm-content {
  padding: 20px;
}

.products-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #333;
  font-weight: 500;
}

.total-count {
  color: #666;
  font-size: 13px;
}

.products-list {
  max-height: 240px;
  overflow-y: auto;
  padding-right: 8px;
}

.products-list.single-product {
  max-height: none;
  overflow: visible;
}

.product-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.product-specs {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.product-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff5722;
  font-weight: 500;
}

.quantity {
  color: #666;
  font-size: 13px;
}

.payment-info-section {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.payment-row:last-child {
  margin-bottom: 0;
}

.payment-row.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-weight: 500;
  color: #333;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 6px;
}

.payment-method i {
  font-size: 18px;
}

.payment-method i.fa-weixin {
  color: #07c160;
}

.payment-method i.fa-alipay {
  color: #1677ff;
}

.discount-amount {
  color: #ff5722;
}

.final-amount {
  color: #ff5722;
  font-size: 18px;
  font-weight: bold;
}

.payment-tips {
  padding: 16px;
  background: #fff9f7;
  border-radius: 8px;
}

.countdown {
  color: #ff5722;
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.security-tip {
  color: #666;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 自定义滚动条样式 */
.products-list::-webkit-scrollbar {
  width: 6px;
}

.products-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.products-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.products-list::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-button--primary) {
  background-color: #ff5722;
  border-color: #ff5722;
}

:deep(.el-button--primary:hover) {
  background-color: #f4511e;
  border-color: #f4511e;
}

:deep(.el-button--primary:focus) {
  background-color: #e64a19;
  border-color: #e64a19;
}
</style>
