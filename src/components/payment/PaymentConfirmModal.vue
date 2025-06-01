<template>
  <div class="payment-confirm-modal" v-if="visible">
    <div class="modal-overlay" @click="handleCancel"></div>
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">确认支付</h3>
        <button class="close-button" @click="handleCancel">&times;</button>
      </div>

      <div class="modal-content">
        <!-- 商品信息和价格信息行 -->
        <div class="info-row">
          <!-- 商品信息 -->
          <div class="product-info">
            <img
              :src="orderData.product?.thumbnail || 'https://via.placeholder.com/80x80'"
              :alt="orderData.product?.name"
            />
            <div class="product-details">
              <h3>{{ orderData.product?.name || '商品' }}</h3>
              <div class="specs">{{ orderData.product?.specs || '' }}</div>
            </div>
          </div>

          <!-- 价格信息 -->
          <div class="price-info">
            <div class="price-row">
              <span>商品原价</span>
              <span>¥{{ orderData.payment?.originalAmount || '0.00' }}</span>
            </div>
            <div
              v-for="(discount, index) in orderData.payment?.discounts"
              :key="index"
              class="price-row discount"
            >
              <span>{{ discount.label }}</span>
              <span>-¥{{ discount.amount }}</span>
            </div>
            <div class="price-row final-price">
              <span>实付金额</span>
              <span class="amount">¥{{ orderData.payment?.actualAmount || '0.00' }}</span>
            </div>
          </div>
        </div>

        <!-- 支付方式行 -->
        <div class="payment-method">
          <div class="method-info">
            <span class="label">支付方式</span>
            <span class="value">
              {{ orderData.payment?.paymentMethod === 'wechat' ? '微信支付' : '支付宝支付' }}
            </span>
          </div>
          <div class="method-icon">
            <i
              :class="[
                'fab',
                orderData.payment?.paymentMethod === 'wechat' ? 'fa-weixin' : 'fa-alipay',
              ]"
            ></i>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="handleCancel" :disabled="isLoading">取消支付</button>
        <button class="confirm-button" @click="handleConfirm" :disabled="isLoading">
          <span v-if="!isLoading">确认支付</span>
          <span v-else class="loading-wrapper">
            <i class="loading-icon"></i>
            支付处理中...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  orderData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
const isLoading = ref(false)

const handleConfirm = async () => {
  isLoading.value = true
  emit('confirm')
}

const handleCancel = () => {
  if (!isLoading.value) {
    emit('cancel')
  }
}
</script>

<style scoped>
.payment-confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 700px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.close-button {
  border: none;
  background: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.modal-content {
  padding: 16px;
}

.info-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.product-info {
  flex: 2;
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.product-info img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-details h3 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.specs {
  color: #666;
  font-size: 13px;
}

.price-info {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
}

.price-row.discount {
  color: #ff5722;
}

.price-row.final-price {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  font-size: 14px;
}

.amount {
  color: #ff5722;
  font-size: 18px;
  font-weight: bold;
}

.payment-method {
  padding: 12px 20px;
  background: #fff7e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.method-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-info .label {
  color: #666;
}

.method-info .value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.method-icon i {
  font-size: 24px;
}

.method-icon i.fa-weixin {
  color: #07c160;
}

.method-icon i.fa-alipay {
  color: #1677ff;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-footer button {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
  border-color: #e0e0e0;
}

.cancel-button:hover {
  background: #e8e8e8;
  border-color: #d0d0d0;
}

.confirm-button {
  background: #ff6f00;
  color: white;
  border-color: #ff6f00;
}

.confirm-button:hover {
  background: #e65100;
  border-color: #e65100;
}

.modal-footer button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
