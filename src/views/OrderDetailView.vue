<template>
  <div class="order-detail-page">
    <!-- OrderDetailTopNav -->
    <OrderDetailTopNav :order-id="orderId" @back="goBack" @action="handleTopNavAction" />

    <div v-if="loading" class="loading-placeholder">正在加载订单详情...</div>
    <div v-if="!loading && !order" class="error-placeholder">未找到订单信息。</div>

    <div v-if="order" class="detail-content-wrapper">
      <!-- OrderDetailBasicInfo -->
      <OrderDetailBasicInfo :order="order" />

      <!-- OrderDetailProductItem -->
      <OrderDetailProductItem :product="order.product" />

      <div class="main-details-grid">
        <div class="left-column">
          <!-- OrderDetailPricePayment -->
          <OrderDetailPricePayment
            :payment-info="order.payment"
            @select-payment-method="handlePaymentMethodSelect"
          />
        </div>
        <div class="right-column">
          <!-- OrderDetailSellerCard -->
          <OrderDetailSellerCard :seller="order.seller" />
          <!-- OrderDetailLogistics -->
          <OrderDetailLogistics :logistics="order.logistics" />
        </div>
      </div>
    </div>

    <!-- OrderDetailTips -->
    <OrderDetailTips v-if="order" :order-status="order.status" />

    <!-- OrderDetailActions -->
    <OrderDetailFixedActions
      v-if="order"
      :order-status="order.status"
      :actions="availableActions"
      :order-data="{
        payment: order.payment,
        product: {
          name: order.product.name,
          thumbnail: order.product.thumbnail,
          specs: order.product.specs,
        },
      }"
      @order-action="handleOrderAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Import sub-components (paths will be created shortly)
import OrderDetailTopNav from '@/components/orderdetail/OrderDetailTopNav.vue'
import OrderDetailBasicInfo from '@/components/orderdetail/OrderDetailBasicInfo.vue'
import OrderDetailProductItem from '@/components/orderdetail/OrderDetailProductItem.vue'
import OrderDetailPricePayment from '@/components/orderdetail/OrderDetailPricePayment.vue'
import OrderDetailSellerCard from '@/components/orderdetail/OrderDetailSellerCard.vue'
import OrderDetailLogistics from '@/components/orderdetail/OrderDetailLogistics.vue'
import OrderDetailFixedActions from '@/components/orderdetail/OrderDetailFixedActions.vue'
import OrderDetailTips from '@/components/orderdetail/OrderDetailTips.vue'

const route = useRoute()
const router = useRouter()
const showModal = inject('showModal')

const orderId = ref(route.params.orderId)
const order = ref(null)
const loading = ref(true)
const selectedPaymentMethod = ref(null)
const countdownTimer = ref(null)

// Mock Order Data - this will be expanded significantly
const mockOrders = {
  'order1-topay': {
    id: 'order1-topay',
    orderNumber: 'SN202407260001',
    orderTime: '2024-07-26 10:30:00',
    status: '待付款',
    statusTagType: 'warning',
    countdown: 1800, // 30分钟支付倒计时（秒）
    progressNodes: [
      { name: '提交订单', status: 'active', time: '2024-07-26 10:30:00' },
      { name: '付款成功', status: 'pending' },
      { name: '卖家发货', status: 'pending' },
      { name: '确认收货', status: 'pending' },
      { name: '订单完成', status: 'pending' },
    ],
    product: {
      thumbnail: 'https://via.placeholder.com/100x100/FFDDC1/FF6F00?text=商品A',
      name: '夏季新款透气运动鞋 轻便舒适 男女同款',
      specs: '颜色: 天空蓝, 尺码: 42',
      quantity: 1,
      condition: '全新',
      originalProductUrl: '/product/prod123',
    },
    payment: {
      actualAmount: '199.00',
      originalAmount: '259.00',
      discounts: [{ label: '夏季特惠', amount: '60.00' }],
      paymentMethod: null,
      paymentMethodName: null,
      paymentTime: null,
      transactionId: null,
      status: '待付款',
      countdown: 1800,
    },
    seller: {
      avatar: 'https://via.placeholder.com/40x40/8E8E8E/FFFFFF?text=店',
      nickname: '清风运动专卖',
      rating: 4.7,
    },
    logistics: {
      company: null,
      trackingNumber: null,
      updates: [],
      currentLocation: null,
    },
  },
  'order2-toship': {
    id: 'order2-toship',
    orderNumber: 'SN202407250008',
    orderTime: '2024-07-25 14:00:00',
    status: '待发货',
    statusTagType: 'info',
    progressNodes: [
      { name: '提交订单', status: 'completed', time: '2024-07-25 14:00:00' },
      { name: '付款成功', status: 'completed', time: '2024-07-25 14:01:00' },
      { name: '卖家发货', status: 'active', time: '2024-07-25 14:01:00' },
      { name: '确认收货', status: 'pending' },
      { name: '订单完成', status: 'pending' },
    ],
    product: {
      thumbnail: 'https://via.placeholder.com/100x100/C1FFD7/00BFA5?text=商品B',
      name: '智能手环 心率监测 睡眠分析 防水设计',
      specs: '颜色: 黑色',
      quantity: 1,
      condition: '9成新',
      originalProductUrl: '/product/prod456',
    },
    payment: {
      actualAmount: '288.50',
      originalAmount: null,
      discounts: [],
      paymentMethod: 'alipay',
      paymentMethodName: '支付宝',
      paymentTime: '2024-07-25 14:01:00',
      transactionId: 'ALIPAY20240725XYZ',
    },
    seller: {
      avatar: 'https://via.placeholder.com/40x40/FFAB00/000000?text=智',
      nickname: '智能生活馆',
      rating: 4.9,
    },
    logistics: {
      company: null,
      trackingNumber: null,
      updates: [],
      currentLocation: null,
    },
  },
  'order3-toreceive': {
    id: 'order3-toreceive',
    orderNumber: 'SN202407240015',
    orderTime: '2024-07-24 09:15:00',
    status: '待收货',
    statusTagType: 'primary',
    progressNodes: [
      { name: '提交订单', status: 'completed', time: '2024-07-24 09:15:00' },
      { name: '付款成功', status: 'completed', time: '2024-07-24 09:16:00' },
      { name: '卖家发货', status: 'completed', time: '2024-07-24 18:00:00' },
      { name: '确认收货', status: 'active', time: '2024-07-24 18:00:00' },
      { name: '订单完成', status: 'pending' },
    ],
    product: {
      thumbnail: 'https://via.placeholder.com/100x100/D1C4E9/673AB7?text=商品C',
      name: '复古文艺帆布包 大容量多隔层 学生适用',
      specs: '款式: 卡其色小号',
      quantity: 2,
      condition: '全新',
      originalProductUrl: '/product/prod789',
    },
    payment: {
      actualAmount: '78.00',
      originalAmount: '99.00',
      discounts: [{ label: '组合优惠', amount: '21.00' }],
      paymentMethod: 'wechat',
      paymentMethodName: '微信支付',
      paymentTime: '2024-07-24 09:16:00',
      transactionId: 'WECHAT20240724ABC',
    },
    seller: {
      avatar: 'https://via.placeholder.com/40x40/B2EBF2/00ACC1?text=文',
      nickname: '文艺杂货铺',
      rating: 4.6,
    },
    logistics: {
      company: '圆通速递',
      trackingNumber: 'YT9876543210',
      updates: [
        {
          status: '已签收, 感谢使用圆通速递，期待再次为您服务。',
          time: '2024-07-26 11:00:00',
          location: '收货地址',
        },
        {
          status: '【派送中】快件交给xxx师傅，正在配送途中（联系电话xxx）。',
          time: '2024-07-26 08:30:00',
          location: '目标城市',
        },
        {
          status: '快件已到达【目标城市中转站】',
          time: '2024-07-25 22:10:00',
          location: '目标城市中转站',
        },
        {
          status: '快件离开【始发城市分拨中心】，发往【目标城市中转站】',
          time: '2024-07-25 05:15:00',
          location: '始发城市分拨中心',
        },
        { status: '【始发城市】的揽投员已揽收', time: '2024-07-24 18:30:00', location: '始发城市' },
      ],
      currentLocation: '目标城市',
    },
  },
  'order4-completed': {
    id: 'order4-completed',
    orderNumber: 'SN202407200001',
    orderTime: '2024-07-20 11:45:00',
    status: '已完成',
    statusTagType: 'success',
    progressNodes: [
      { name: '提交订单', status: 'completed', time: '2024-07-20 11:45:00' },
      { name: '付款成功', status: 'completed', time: '2024-07-20 11:46:00' },
      { name: '卖家发货', status: 'completed', time: '2024-07-20 19:20:00' },
      { name: '确认收货', status: 'completed', time: '2024-07-23 13:00:00' },
      { name: '订单完成', status: 'active', time: '2024-07-23 13:01:00' },
    ],
    product: {
      thumbnail: 'https://via.placeholder.com/100x100/F0F4C3/AFB42B?text=商品D',
      name: '有机认证 东北大米 5kg 真空包装',
      specs: '规格: 5kg',
      quantity: 1,
      condition: '全新',
      originalProductUrl: '/product/prod001',
    },
    payment: {
      actualAmount: '55.90',
      originalAmount: null,
      discounts: [],
      paymentMethod: 'alipay',
      paymentMethodName: '支付宝',
      paymentTime: '2024-07-20 11:46:00',
      transactionId: 'ALIPAY20240720COMPLETED',
    },
    seller: {
      avatar: 'https://via.placeholder.com/40x40/A5D6A7/388E3C?text=农',
      nickname: '绿色农场直供',
      rating: 4.9,
    },
    logistics: {
      company: '中通快递',
      trackingNumber: 'ZTCOMPLETED001',
      updates: [{ status: '已签收', time: '2024-07-23 13:00:00' }],
      currentLocation: '已送达',
    },
  },
  'order5-cancelled': {
    id: 'order5-cancelled',
    orderNumber: 'SN202407190030',
    orderTime: '2024-07-19 16:00:00',
    status: '已取消',
    statusTagType: 'danger',
    progressNodes: [
      { name: '提交订单', status: 'completed', time: '2024-07-19 16:00:00' },
      { name: '订单取消', status: 'active', time: '2024-07-19 16:30:00' },
    ],
    product: {
      thumbnail: 'https://via.placeholder.com/100x100/FFCDD2/D32F2F?text=商品E',
      name: '进口原豆咖啡粉 手冲体验装 50g',
      specs: '口味: 意式浓缩',
      quantity: 3,
      condition: '全新',
      originalProductUrl: '/product/prod222',
    },
    payment: {
      actualAmount: '0.00',
      originalAmount: '89.70',
      discounts: [],
      paymentMethod: null,
      paymentMethodName: '订单已取消',
      paymentTime: null,
      transactionId: null,
    },
    seller: {
      avatar: 'https://via.placeholder.com/40x40/607D8B/FFFFFF?text=咖',
      nickname: '精品咖啡小铺',
      rating: 4.5,
    },
    logistics: {
      company: null,
      trackingNumber: null,
      updates: [],
      currentLocation: null,
    },
  },
}

// --- Computed Properties ---
const availableActions = computed(() => {
  if (!order.value) return []
  switch (order.value.status) {
    case '待付款':
      return ['pay_now', 'cancel_order', 'contact_seller']
    case '待发货':
      return ['remind_shipping', 'contact_seller', 'cancel_order'] // Some platforms allow cancellation before shipping
    case '待收货':
      return ['confirm_receipt', 'view_logistics', 'contact_seller']
    case '已完成':
      return ['rate_order', 'buy_again', 'delete_order', 'contact_seller']
    case '已取消':
      return ['buy_again', 'delete_order']
    default:
      return []
  }
})

// --- Methods ---
const fetchOrderDetails = () => {
  loading.value = true
  order.value = null
  console.log(`[OrderDetailView] Fetching order details for ID: ${orderId.value}`)

  // Simulate API call
  setTimeout(() => {
    console.log('[OrderDetailView] Attempting to find order in mockOrders with id:', orderId.value)
    const foundOrder =
      mockOrders[orderId.value] || Object.values(mockOrders).find((o) => o.id === orderId.value)

    console.log('[OrderDetailView] Found order data from mock:', JSON.stringify(foundOrder))

    if (foundOrder) {
      order.value = JSON.parse(JSON.stringify(foundOrder)) // Deep copy
      console.log('[OrderDetailView] order.value after assignment:', JSON.stringify(order.value))
      updateProgressNodes(order.value)
    } else {
      console.error('[OrderDetailView] Order data not found for ID:', orderId.value)
    }
    loading.value = false
  }, 500)
}

const updateProgressNodes = (currentOrder) => {
  if (!currentOrder || !currentOrder.progressNodes) return

  const statusMap = {
    待付款: ['提交订单'],
    待发货: ['提交订单', '付款成功', '卖家发货'],
    待收货: ['提交订单', '付款成功', '卖家发货', '确认收货'],
    已完成: ['提交订单', '付款成功', '卖家发货', '确认收货', '订单完成'],
    已取消: ['提交订单', '订单取消'],
  }

  const activeStages = statusMap[currentOrder.status] || []
  const lastActiveIndex = activeStages.length - 1

  currentOrder.progressNodes.forEach((node) => {
    if (activeStages.includes(node.name)) {
      const stageIndex = activeStages.indexOf(node.name)
      if (stageIndex === lastActiveIndex) {
        node.status = 'active'
      } else if (stageIndex < lastActiveIndex) {
        node.status = 'completed'
      }
    } else {
      node.status = 'pending'
    }
  })
}

const goBack = () => {
  router.go(-1) // Or router.push('/orders');
}

const handleTopNavAction = (action) => {
  if (action === 'share') {
    if (navigator.share) {
      navigator
        .share({
          title: `订单详情: ${order.value?.orderNumber}`,
          text: `查看我的订单 ${order.value?.orderNumber} 的详情。`,
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error))
    } else {
      showModal({
        title: '分享',
        message: '已复制订单链接到剪贴板 (模拟)。请手动粘贴分享。',
        showCancelButton: false,
      })
      navigator.clipboard.writeText(window.location.href)
    }
  } else if (action === 'more_options') {
    showModal({
      title: '更多操作',
      message: '更多操作功能正在开发中 (例如：申请售后、投诉)。',
      showCancelButton: false,
    })
  }
  // Handle other top nav actions if any
}

const generateTransactionId = () => {
  const prefix = 'TXN'
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

const handlePaymentMethodSelect = (method) => {
  if (order.value && order.value.status === '待付款') {
    order.value.payment.paymentMethod = method
    order.value.payment.paymentMethodName = method === 'wechat' ? '微信支付' : '支付宝支付'
  }
}

const handleOrderAction = async (actionType) => {
  console.log('Order action:', actionType, 'for order:', order.value.id)
  if (!showModal || !order.value) return

  switch (actionType) {
    case 'pay_now': {
      // 更新订单状态
      order.value.status = '待发货'
      order.value.statusTagType = 'info'
      order.value.payment.paymentTime = new Date().toLocaleString()
      order.value.payment.transactionId = generateTransactionId()
      updateProgressNodes(order.value)

      // 跳转到支付成功页面
      router.push({
        path: '/payment-success',
        query: {
          orderId: order.value.id,
          amount: order.value.payment.actualAmount,
          method: order.value.payment.paymentMethodName,
        },
      })
      break
    }
    case 'cancel_order': {
      const cancelConfirmed = await showModal({
        title: '取消订单',
        message: '您确定要取消此订单吗？此操作可能无法撤销。',
        confirmButtonText: '确认取消',
        cancelButtonText: '保留订单',
        confirmButtonClass: 'danger',
      })
      if (cancelConfirmed) {
        order.value.status = '已取消'
        order.value.statusTagType = 'danger'
        updateProgressNodes(order.value)
        showModal({ title: '订单已取消', showCancelButton: false })
      }
      break
    }
    case 'confirm_receipt': {
      const receiptConfirmed = await showModal({
        title: '确认收货',
        message: '请确保您已收到商品且无误。确认收货后，订单将完成。',
        confirmButtonText: '确认收货',
      })
      if (receiptConfirmed) {
        order.value.status = '已完成'
        order.value.statusTagType = 'success'
        order.value.logistics.updates.unshift({
          status: '已签收，交易完成。',
          time: new Date().toLocaleString(),
          location: '收货地址',
        })
        updateProgressNodes(order.value)
        showModal({
          title: '操作成功',
          message: '您已确认收货，订单完成。',
          showCancelButton: false,
        })
      }
      break
    }
    case 'remind_shipping':
      showModal({
        title: '提醒发货',
        message: '已向卖家发送提醒发货请求 (功能模拟)。',
        showCancelButton: false,
      })
      break
    case 'view_logistics': {
      // Could scroll to logistics section or open a dedicated modal/page
      const logisticsElement = document.querySelector('.order-detail-logistics')
      if (logisticsElement) {
        logisticsElement.scrollIntoView({ behavior: 'smooth' })
      }
      showModal({
        title: '查看物流',
        message: '物流信息已在页面展示 (功能模拟)。',
        showCancelButton: false,
      })
      break
    }
    case 'rate_order':
      router.push(`/rate-order/${order.value.id}`) // Navigate to a rating page
      // showModal({ title: '评价订单', message: '跳转到评价页面 (功能开发中)。', showCancelButton: false });
      break
    case 'delete_order': {
      const deleteConfirmed = await showModal({
        title: '删除订单',
        message: '您确定要删除此订单吗？删除后将无法查看。',
        confirmButtonText: '确认删除',
        confirmButtonClass: 'danger',
      })
      if (deleteConfirmed) {
        // Simulate API call for delete then navigate away or refresh list
        showModal({
          title: '订单已删除',
          message: '订单已从您的列表中移除 (功能模拟)。',
          showCancelButton: false,
        }).then(() => router.push('/orders'))
      }
      break
    }
    case 'buy_again':
      // This would typically re-add items to cart or navigate to product page
      showModal({
        title: '再次购买',
        message: `正在查找商品 ${order.value.product.name} (功能开发中)。`,
        showCancelButton: false,
      })
      break
    case 'contact_seller':
      // Find the seller card component or use global method if available.
      // For now, just a modal.
      showModal({
        title: '联系卖家',
        message: `请通过聊天系统联系卖家 ${order.value.seller.nickname} (功能开发中)。`,
        showCancelButton: false,
      })
      break
    default:
      showModal({
        title: '提示',
        message: `操作 [${actionType}] 正在努力开发中！`,
        showCancelButton: false,
      })
  }
}

// 更新倒计时
const updateCountdown = () => {
  if (order.value && order.value.status === '待付款' && order.value.payment.countdown > 0) {
    order.value.payment.countdown--
    if (order.value.payment.countdown <= 0) {
      // 订单超时，自动取消
      order.value.status = '已取消'
      order.value.statusTagType = 'danger'
      clearInterval(countdownTimer.value)
      showModal({
        title: '订单已超时',
        message: '支付超时，订单已自动取消。',
        showCancelButton: false,
      })
      router.push('/orders')
    }
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  console.log('[OrderDetailView] Component mounted. Current orderId.value:', orderId.value)
  // If order is not already loaded by the route watcher, and we have an orderId
  if (!order.value && orderId.value) {
    fetchOrderDetails()
  }
  // 启动倒计时定时器
  countdownTimer.value = setInterval(updateCountdown, 1000)
})

// Watch for route changes if a user navigates from one order detail to another directly
// (e.g. via browser history or a link)
// This is not strictly necessary if users always go via an orders list page.
route.params.orderId &&
  onMounted(() => {
    console.log(
      '[OrderDetailView] Route params orderId changed or initial mount with param. Current orderId.value:',
      orderId.value,
      'Route param:',
      route.params.orderId,
    )
    if (orderId.value !== route.params.orderId) {
      orderId.value = route.params.orderId
      fetchOrderDetails()
    } else if (!order.value && orderId.value) {
      // If order is null but orderId exists (e.g. initial direct load)
      fetchOrderDetails()
    }
  })

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>

<style scoped>
.order-detail-page {
  background-color: #f7f8fa; /* Light grey background for the whole page */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-placeholder,
.error-placeholder {
  text-align: center;
  padding: 50px;
  font-size: 16px;
  color: #777;
}

.detail-content-wrapper {
  flex-grow: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between main sections */
  max-width: 1200px; /* Max width for content area */
  margin: 0 auto; /* Center content area */
  width: 100%;
}

.main-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive grid */
  gap: 15px;
  align-items: flex-start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between cards in the same column */
}

/* Shared card styling */
:deep(.detail-card) {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

:deep(.section-title) {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0; /* Remove margin-top, adjust bottom */
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

/* Add styles for progress nodes */
:deep(.progress-node) {
  position: relative;
}

:deep(.progress-node.completed) {
  color: #ff5722;
}

:deep(.progress-node.completed::before) {
  background-color: #ff5722 !important;
  border-color: #ff5722 !important;
}

:deep(.progress-node.completed::after) {
  background-color: #ff5722 !important;
}

:deep(.progress-node.active) {
  color: #ff5722;
}

:deep(.progress-node.active::before) {
  background-color: #fff !important;
  border-color: #ff5722 !important;
}

/* Add styles for payment method buttons */
:deep(.payment-method-modal .payment-method-btn) {
  padding: 12px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

:deep(.payment-method-modal .payment-method-btn:hover) {
  border-color: #ff5722;
  color: #ff5722;
}

:deep(.payment-method-modal .payment-method-btn[data-method='wechat']) {
  color: #07c160;
}

:deep(.payment-method-modal .payment-method-btn[data-method='wechat']:hover) {
  border-color: #07c160;
}

:deep(.payment-method-modal .payment-method-btn[data-method='alipay']) {
  color: #1677ff;
}

:deep(.payment-method-modal .payment-method-btn[data-method='alipay']:hover) {
  border-color: #1677ff;
}

.payment-method-selection {
  margin: 16px 0;
}

.method-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.method-buttons {
  display: flex;
  gap: 12px;
}

.method-btn {
  flex: 1;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.method-btn.active {
  border-color: #1890ff;
  color: #1890ff;
  background: #e6f7ff;
}

.method-btn i {
  font-size: 18px;
}

.payment-countdown {
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom: 16px;
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
