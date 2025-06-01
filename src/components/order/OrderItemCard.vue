<template>
  <div class="order-item-card" @click="navigateToOrderDetail">
    <div class="order-card-content">
      <div class="order-card-left">
        <img
          :src="order.productThumbnail || 'https://via.placeholder.com/100x100?text=商品图'"
          alt="商品缩略图"
          class="product-thumbnail"
        />
      </div>
      <div class="order-card-main">
        <div class="order-id">
          订单号：{{ order.id }}
          <span class="copy-icon" title="复制订单号" @click="handleCopyToClipboard(order.id)"
            >📋</span
          >
        </div>
        <div class="product-name">{{ order.productName }}</div>
        <div class="order-time">下单时间：{{ order.orderTime }}</div>
        <div class="order-price">
          订单金额：<span class="price-value">¥{{ order.price }}</span>
        </div>
      </div>
      <div class="order-card-right">
        <div :class="['order-status-tag', getStatusClass(order.status)]">
          {{ getStatusText(order.status) }}
        </div>
      </div>
    </div>

    <div class="order-card-footer">
      <!-- 待付款 -->
      <template v-if="order.status === 'topay'">
        <div class="countdown-timer">{{ formattedCountdown }}</div>
        <button class="action-button pay-now-button" @click.stop="handlePayNow">立即付款</button>
      </template>

      <!-- 待发货 -->
      <template v-if="order.status === 'toship'">
        <div class="logistics-info-placeholder">
          <span>卖家正在努力发货中...</span>
        </div>
        <button class="action-button remind-shipping-button" @click="handleRemindShipping">
          提醒发货
        </button>
      </template>

      <!-- 待收货 -->
      <template v-if="order.status === 'toreceive'">
        <div class="logistics-tracking">
          <div class="logistics-company">
            {{ order.logisticsCompany || '未知物流' }} - {{ order.trackingNumber || '暂无单号' }}
            <span
              v-if="order.trackingNumber"
              class="copy-icon"
              title="复制运单号"
              @click="handleCopyToClipboard(order.trackingNumber)"
              >📋</span
            >
          </div>
          <div class="logistics-progress-bar-container">
            <div
              v-for="(node, index) in order.logisticsProgress"
              :key="index"
              :class="['progress-node', getNodeStatus(node, index, order.logisticsProgress)]"
            >
              <div class="node-dot"></div>
              <div class="node-label" :title="node.details || node.node + ' - ' + node.time">
                {{ node.node }}
              </div>
            </div>
          </div>
        </div>
        <button class="action-button confirm-receipt-button" @click="handleConfirmReceipt">
          确认收货
        </button>
      </template>

      <!-- 已完成 -->
      <template v-if="order.status === 'completed'">
        <button class="action-button view-evaluation-button" @click="handleViewEvaluation">
          查看评价
        </button>
        <button class="action-button buy-again-button" @click="handleBuyAgain">再次购买</button>
      </template>

      <!-- 已取消 -->
      <template v-if="order.status === 'cancelled'">
        <div class="cancel-reason">取消原因：{{ order.cancelReason || '无说明' }}</div>
        <button class="action-button buy-again-button" @click="handleBuyAgain">重新下单</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted, onUnmounted, defineEmits, inject } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({
      id: 'N/A',
      productThumbnail: '',
      productName: '商品名称加载中...',
      orderTime: 'YYYY-MM-DD HH:mm:ss',
      status: 'unknown', // e.g., 'topay', 'toship', 'toreceive', 'completed', 'cancelled'
      price: '0.00',
      logisticsProgress: [],
      countdown: 0,
    }),
  },
})

const emit = defineEmits([
  'order-paid',
  'order-receipt-confirmed',
  'remind-shipping',
  'view-evaluation',
  'buy-again',
])

const showModal = inject('showModal') // Inject the showModal function
const router = useRouter()

const getStatusText = (status) => {
  const map = {
    topay: '待付款',
    toship: '待发货',
    toreceive: '待收货',
    completed: '已完成',
    cancelled: '已取消',
    unknown: '未知状态',
  }
  return map[status] || map.unknown
}

const getStatusClass = (status) => {
  return `status-${status}`
}

// Countdown logic for 'topay' status
const remainingTime = ref(
  props.order.status === 'topay' && props.order.countdown ? props.order.countdown : 0,
)
let countdownInterval = null

const formattedCountdown = computed(() => {
  if (remainingTime.value <= 0 && props.order.status === 'topay') return '支付已超时'
  if (remainingTime.value <= 0) return '' // Or some other default for non-topay or already timed out
  const hours = Math.floor(remainingTime.value / 3600)
  const minutes = Math.floor((remainingTime.value % 3600) / 60)
  const seconds = remainingTime.value % 60
  return `支付剩余: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

onMounted(() => {
  if (props.order.status === 'topay' && remainingTime.value > 0) {
    countdownInterval = setInterval(() => {
      remainingTime.value -= 1
      if (remainingTime.value <= 0) {
        clearInterval(countdownInterval)
        // Optionally emit an event here if timeout should trigger a status change, e.g., to 'cancelled'
        // emit('order-timeout', props.order.id)
      }
    }, 1000)
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

const handleCopyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    if (showModal) {
      showModal({ title: '复制成功', message: '已复制到剪贴板: ' + text })
    } else {
      alert('已复制到剪贴板: ' + text) // Fallback
    }
  } catch (err) {
    console.error('复制失败: ', err)
    if (showModal) {
      showModal({ title: '复制失败', message: '无法复制到剪贴板，请稍后再试。' })
    } else {
      alert('复制失败') // Fallback
    }
  }
}

// Add navigation method
const navigateToOrderDetail = () => {
  router.push({
    path: `/orderDetail/${props.order.id}`,
    query: { status: props.order.status },
  })
}

// Update handlePayNow method
const handlePayNow = (event) => {
  event.stopPropagation() // Prevent navigation when clicking the pay button

  if (remainingTime.value <= 0) {
    showModal({ title: '操作失败', message: '支付已超时，无法支付。' })
    return
  }

  // 直接跳转到订单详情页
  router.push({
    path: `/orderDetail/${props.order.id}`,
    query: {
      status: props.order.status,
      action: 'pay', // 添加支付动作标识
    },
  })
}

const handleConfirmReceipt = async () => {
  const modalResult = await showModal({
    title: '确认收货',
    message: `您确定已经收到商品【${props.order.productName}】了吗？`,
    showCancelButton: true,
    confirmText: '是的，已收到',
    cancelText: '还没有',
  })

  if (modalResult.confirmed) {
    // Simulate API call for confirming receipt
    // For demo, directly emit
    showModal({ title: '操作成功', message: '感谢您的购买，订单已更新为完成状态！' })
    emit('order-receipt-confirmed', props.order.id)
  }
}

const handleRemindShipping = () => {
  showModal({ title: '提醒成功', message: `已提醒卖家尽快为订单 ${props.order.id} 发货。` })
  emit('remind-shipping', props.order.id) // For potential backend interaction
}

const handleViewEvaluation = () => {
  showModal({
    title: '功能建设中',
    message: `查看订单 ${props.order.id} 的评价详情功能正在快马加鞭开发中，敬请期待！`,
  })
  emit('view-evaluation', props.order.id)
  // Typically, this would navigate to an evaluation page or show a modal
}

const handleBuyAgain = () => {
  showModal({
    title: '功能建设中',
    message: `再次购买订单 ${props.order.id} 中的商品功能正在开发中！`,
  })
  emit('buy-again', props.order.id)
  // This might add items to cart or navigate to product page
}

// 在 script setup 部分添加物流节点处理逻辑
const getNodeStatus = (node, index, allNodes) => {
  const currentNodeIndex = allNodes.findIndex((n) => n.current)
  if (currentNodeIndex === -1) return 'pending'
  return index <= currentNodeIndex ? 'completed' : 'pending'
}
</script>

<style scoped>
.order-item-card {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  /* Removed display:flex and flex-wrap from here, handled by inner divs */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.order-item-card:hover {
  transform: translateY(-2px);
}

.order-card-content {
  display: flex;
  padding: 15px;
}

.order-card-left {
  flex-shrink: 0;
  margin-right: 15px;
}

.product-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.order-card-main {
  flex-grow: 1;
  min-width: 200px;
}

.order-id {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.copy-icon {
  cursor: pointer;
  margin-left: 5px;
  color: #007bff;
  font-size: 13px;
}
.copy-icon:hover {
  color: #0056b3;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
}

.order-time {
  font-size: 13px;
  color: #777;
  margin-bottom: 4px; /* Adjusted margin */
}

.order-price {
  font-size: 13px;
  color: #333;
}
.order-price .price-value {
  font-weight: bold;
  color: #ff6f00; /* Orange for price */
  font-size: 15px;
}

.order-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 15px;
  padding-top: 2px; /* Align status tag better with order id */
}

.order-status-tag {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

/* Status specific colors */
.status-topay {
  background-color: #fff3e0;
  color: #ff6f00;
  border: 1px solid #ffe0b2;
} /* 浅橙色背景橙色字 */
.status-toship {
  background-color: #fff8e1;
  color: #ffa000;
  border: 1px solid #ffecb3;
} /* 浅黄色背景黄色字 */
.status-toreceive {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
} /* 浅蓝色背景蓝色字 */
.status-completed {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
} /* 浅绿色背景绿色字 */
.status-cancelled {
  background-color: #f5f5f5;
  color: #616161;
  border: 1px solid #e0e0e0;
} /* 浅灰色背景灰色字 */
.status-unknown {
  background-color: #fafafa;
  color: #757575;
  border: 1px solid #eeeeee;
}

.order-card-footer {
  /* width: 100%; */
  padding: 10px 15px;
  /* margin-top: 10px; */ /* Margin handled by border if needed */
  border-top: 1px solid #f5f5f5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  background-color: #fdfdfd; /* Slight bg for footer */
  border-radius: 0 0 8px 8px;
}

.countdown-timer {
  font-size: 13px;
  /* color: red; */ /* Dynamic color based on time could be an enhancement */
  margin-right: auto;
}
.countdown-timer:not(:empty) {
  color: red;
}

.action-button {
  padding: 7px 14px; /* Slightly smaller buttons */
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.pay-now-button {
  background-color: #ff6f00;
  color: white;
  border-color: #ff6f00;
}
.pay-now-button:hover {
  background-color: #e65100;
  border-color: #e65100;
}

.remind-shipping-button {
  background-color: #f0f0f0; /* 浅灰色背景 */
  color: #555; /* 深灰色文字 */
  border: 1px solid #ccc; /* 显式设置边框，之前是 border-color */
}
.remind-shipping-button:hover {
  background-color: #e0e0e0;
  border-color: #bbb; /* 确保悬停时边框颜色也更新 */
}

.logistics-info-placeholder {
  font-size: 13px;
  color: #555;
  margin-right: auto;
}

.logistics-tracking {
  font-size: 13px;
  color: #555;
  margin-right: auto;
  width: 100%; /* Allow it to take space for progress bar */
}
.logistics-company {
  margin-bottom: 8px;
  font-weight: 500;
}

.logistics-progress-bar-container {
  display: flex;
  align-items: center;
  gap: 2px; /* Small gap between nodes */
  width: 100%;
  overflow-x: auto; /* If too many nodes */
  padding-bottom: 5px; /* Space for potential scrollbar */
}

.progress-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 11px;
  color: #888;
  flex: 1;
  min-width: 60px;
  position: relative;
}

.progress-node:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 4px;
  left: calc(50% + 10px);
  width: calc(100% - 20px);
  height: 1.5px;
  background-color: #ddd;
  z-index: 0;
}

/* 已完成节点的样式 */
.progress-node.completed .node-dot {
  background-color: #ff6f00;
}

.progress-node.completed .node-label {
  color: #ff6f00;
}

.progress-node.completed:not(:last-child)::after {
  background-color: #ff6f00;
}

/* 待处理节点的样式 */
.progress-node.pending .node-dot {
  background-color: #ddd;
}

.progress-node.pending .node-label {
  color: #888;
}

.progress-node.pending:not(:last-child)::after {
  background-color: #ddd;
}

/* 当前节点的特殊样式 */
.progress-node.completed:last-of-type .node-dot {
  transform: scale(1.2);
  box-shadow: 0 0 0 2px rgba(255, 111, 0, 0.2);
}

.node-dot {
  width: 10px;
  height: 10px;
  background-color: #ddd;
  border-radius: 50%;
  margin-bottom: 4px;
  z-index: 1;
  position: relative;
}

/* 修改：当前节点之前的所有节点的圆点为橙色 */
.progress-node .node-dot {
  background-color: #ff6f00;
}

.progress-node.current ~ .progress-node .node-dot {
  background-color: #ddd;
}

.progress-node.current .node-dot {
  background-color: #ff6f00;
  transform: scale(1.2);
}

/* 修改：当前节点之前的所有节点的文字为橙色 */
.progress-node .node-label {
  color: #ff6f00;
}

.progress-node.current ~ .progress-node .node-label {
  color: #888;
}

.progress-node.current .node-label {
  color: #ff6f00;
  font-weight: bold;
}

.confirm-receipt-button {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  min-width: 80px; /* 添加最小宽度 */
  white-space: nowrap; /* 防止文字换行 */
}

.view-evaluation-button,
.buy-again-button {
  background-color: #fff;
  color: #007bff;
  border-color: #007bff;
}
.view-evaluation-button:hover,
.buy-again-button:hover {
  background-color: #e6f2ff;
}

.cancel-reason {
  font-size: 13px;
  color: #777;
  margin-right: auto;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
