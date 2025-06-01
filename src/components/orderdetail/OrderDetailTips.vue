<template>
  <div class="order-detail-tips">
    <p class="tip-text">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="16"
        height="16"
        style="margin-right: 6px; vertical-align: middle"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"
        />
      </svg>
      {{ tipMessage }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  orderStatus: {
    type: String,
    required: true,
  },
})

const tipMessage = computed(() => {
  switch (props.orderStatus) {
    case '待付款':
      return '请在指定时间内完成支付，超时订单将自动取消。'
    case '待发货':
      return '卖家正在努力打包您的商品，请耐心等待发货。'
    case '待收货':
      return '商品已发出，请留意物流信息并及时确认收货。'
    case '已完成':
      return '感谢您的购买！欢迎再次光临。'
    case '已取消':
      return '订单已取消，如有疑问可联系客服。'
    default:
      return '温馨提示：请注意交易安全，谨防诈骗。'
  }
})
</script>

<style scoped>
.order-detail-tips {
  background-color: #fffbe6; /* Light yellow, common for tips */
  padding: 12px 20px;
  /* border-top: 1px solid #f0f0f0; */ /* Removed top border to avoid double with card above if applicable */
  /* border-bottom: 1px solid #f0f0f0; */ /* Removed bottom border as fixed actions are below */
  margin-bottom: 75px; /* Ensure space for fixed actions bar, adjust if needed */
  text-align: center;
  width: 100%; /* Ensure it spans full width within its container */
  box-sizing: border-box;
}

.tip-text {
  font-size: 13px;
  color: #8a6d3b; /* Darker yellow/brown for text */
  margin: 0;
  display: inline-flex; /* Allows vertical alignment of icon and text */
  align-items: center;
}
</style>
