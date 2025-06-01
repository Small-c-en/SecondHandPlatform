<template>
  <div class="order-list-container">
    <div v-if="orders && orders.length > 0" class="order-list">
      <OrderItemCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @order-paid="(orderId) => emit('order-paid', orderId)"
        @order-receipt-confirmed="(orderId) => emit('order-receipt-confirmed', orderId)"
        @remind-shipping="(orderId) => emit('remind-shipping', orderId)"
        @view-evaluation="(orderId) => emit('view-evaluation', orderId)"
        @buy-again="(orderId) => emit('buy-again', orderId)"
      />
    </div>
    <div v-else class="no-orders-message">
      <p>{{ noOrdersMessage || '当前分类下没有订单哦～' }}</p>
      <!-- Optional: Add a button to browse items or something similar -->
      <!-- <button class="browse-items-button">去逛逛</button> -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import OrderItemCard from './OrderItemCard.vue'

const router = useRouter()
const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => [],
  },
  noOrdersMessage: {
    // Allow parent to customize the no orders message
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'order-paid',
  'order-receipt-confirmed',
  'remind-shipping',
  'view-evaluation',
  'buy-again',
])

const getStatusText = (status) => {
  const statusMap = {
    topay: '待付款',
    toship: '待发货',
    toreceive: '待收货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return statusMap[status] || status
}

const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 添加导航到订单详情的方法
const navigateToOrderDetail = (order) => {
  router.push({
    path: `/orderDetail/${order.id}`,
    query: { status: order.status }, // 传递订单状态，方便详情页面显示对应状态的内容
  })
}

const handlePay = (order) => {
  emit('order-paid', order.id)
}

const handleConfirmReceipt = (order) => {
  emit('order-receipt-confirmed', order.id)
}

const handleRemindShipping = (order) => {
  emit('remind-shipping', order.id)
}

const handleViewEvaluation = (order) => {
  emit('view-evaluation', order.id)
}

const handleBuyAgain = (order) => {
  emit('buy-again', order.id)
}

const handleViewLogistics = (order) => {
  // 实现查看物流的逻辑
}

const handleCancel = (order) => {
  // 实现取消订单的逻辑
}
</script>

<style scoped>
.order-list-container {
  padding: 10px 0; /* Add some padding, especially if it's directly under the nav */
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-orders-message {
  text-align: center;
  padding: 40px 20px;
  color: #777;
  font-size: 16px;
}

.no-orders-message p {
  margin-bottom: 15px;
}

/* Optional button styling */
/*
.browse-items-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}
.browse-items-button:hover {
  background-color: #0056b3;
}
*/
</style>
