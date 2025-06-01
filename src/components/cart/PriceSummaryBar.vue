<template>
  <div class="price-summary-bar">
    <div class="summary-info">
      <span class="total-label">合计金额：</span>
      <span class="total-amount">¥{{ totalPrice.toFixed(2) }}</span>
      <span v-if="totalDiscount > 0" class="discount-info"
        >已优惠 ¥{{ totalDiscount.toFixed(2) }}</span
      >
    </div>
    <button class="checkout-button" :disabled="checkoutDisabled" @click="$emit('checkout')">
      去结算 ({{ selectedItemCount }})
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalDiscount: {
    type: Number,
    default: 0,
  },
  selectedItemCount: {
    type: Number,
    default: 0,
  },
  checkoutDisabled: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['checkout'])
</script>

<style scoped>
.price-summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0; /* Slightly darker border */
  position: sticky;
  bottom: 35px; /* 固定在底部，下移65px */
  z-index: 1000;
  height: 70px; /* Define a fixed height */
  box-sizing: border-box;
}

.summary-info {
  display: flex;
  align-items: baseline; /* Align text baselines */
}

.total-label {
  font-size: 16px;
  font-weight: bold;
  color: #333; /* 黑色加粗字体 */
  margin-right: 8px;
}

.total-amount {
  font-size: 20px; /* 橙色大号字体 */
  color: #ff6f00;
  font-weight: bold;
  margin-right: 10px;
}

.discount-info {
  font-size: 12px;
  color: #888; /* 灰色小字 */
}

.checkout-button {
  background-color: #ff6f00; /* 橙色背景 */
  color: white; /* 白色文字 */
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 20px; /* 圆角设计 */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checkout-button:hover {
  background-color: #e66000;
}

.checkout-button:disabled {
  background-color: #fccca7; /* Lighter orange for disabled state */
  color: #fffde7;
  cursor: not-allowed;
}
</style>
