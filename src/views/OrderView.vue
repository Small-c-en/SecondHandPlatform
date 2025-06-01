<template>
  <div class="order-view">
    <TopNav />
    <div class="main-content">
      <OrderCategoryNav @tab-selected="handleTabSelected" @search-orders="handleSearchOrders" />
      <div class="order-list-section">
        <OrderList
          :orders="filteredOrders"
          :no-orders-message="currentNoOrdersMessage"
          @order-paid="updateOrderStatusToShipped"
          @order-receipt-confirmed="updateOrderStatusToCompleted"
          @remind-shipping="handleGenericEmit"
          @view-evaluation="handleGenericEmit"
          @buy-again="handleGenericEmit"
        />
      </div>
    </div>
    <OrderFixedBottomNav />
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TopNav from '@/components/shared/TopNav.vue'
import Footer from '@/components/shared/Footer.vue'
import OrderCategoryNav from '@/components/order/OrderCategoryNav.vue'
import OrderList from '@/components/order/OrderList.vue'
import OrderFixedBottomNav from '@/components/order/OrderFixedBottomNav.vue' // 确保这个组件存在且已导入

const allOrders = ref([])
const currentTab = ref('topay') // 默认选中的标签页
const currentSearchTerm = ref('')

// 更新模拟数据以包含 countdown 和 logisticsProgress
const mockOrders = [
  {
    id: '12345678901',
    productThumbnail: 'https://via.placeholder.com/100x100/FFD700/000000?Text=Product1',
    productName: '高品质无线蓝牙耳机，降噪效果一流，颜色可选，附带充电盒和一年保修服务',
    orderTime: '2023-10-26 10:30:00',
    price: '299.99',
    status: 'topay',
    countdown: 3600 * 2, // 2 hours countdown in seconds
  },
  {
    id: '12345678902',
    productThumbnail: 'https://via.placeholder.com/100x100/E6E6FA/000000?Text=Product2',
    productName: '智能手表运动版，多功能心率监测睡眠分析，防水设计，待机时间长',
    orderTime: '2023-10-25 15:45:12',
    price: '499.50',
    status: 'toship',
  },
  {
    id: '12345678903',
    productThumbnail: 'https://via.placeholder.com/100x100/ADD8E6/000000?Text=Product3',
    productName: '便携式充电宝大容量20000mAh，双向快充，兼容多种设备',
    orderTime: '2023-10-24 08:20:05',
    price: '128.00',
    status: 'toreceive',
    logisticsCompany: '顺丰速运',
    trackingNumber: 'SF1234567890123',
    logisticsProgress: [
      { node: '已揽收', time: '2023-10-24 10:00', current: false, details: '包裹已由快递员取走' },
      { node: '运输中', time: '2023-10-25 03:15', current: true, details: '快件已到达XX中转中心' },
      { node: '派送中', time: '2023-10-26 09:00', current: false },
      { node: '已签收', time: 'N/A', current: false },
    ],
  },
  {
    id: '12345678904',
    productThumbnail: 'https://via.placeholder.com/100x100/90EE90/000000?Text=Product4',
    productName: '家用全自动咖啡机，一键制作多种口味，易清洁，静音设计',
    orderTime: '2023-09-15 12:00:00',
    price: '899.00',
    status: 'completed',
    evaluation: { stars: 5, comment: '非常好用，推荐购买！' },
  },
  {
    id: '12345678905',
    productThumbnail: 'https://via.placeholder.com/100x100/D3D3D3/000000?Text=Product5',
    productName: '经典款帆布双肩包，大容量多隔层，适合学生和日常通勤',
    orderTime: '2023-09-01 18:10:30',
    price: '159.00',
    status: 'cancelled',
    cancelReason: '不想要了',
  },
  {
    id: '12345678906',
    productName:
      '另一个待付款订单，测试长名称截断效果，这是一个非常非常非常非常非常非常非常非常非常非常非常非常非常长的商品名称，看看会不会溢出或者正确截断显示呢？',
    orderTime: '2023-10-27 11:00:00',
    price: '99.00',
    status: 'topay',
    countdown: 600, // 10 minutes
  },
  {
    id: '12345678907',
    productThumbnail: 'https://via.placeholder.com/100x100/E6E6FA/000000?Text=Product2',
    productName: '待收货订单2',
    orderTime: '2023-10-28 15:45:12',
    price: '199.50',
    status: 'toreceive',
    logisticsCompany: '中通快递',
    trackingNumber: 'ZT0987654321',
    logisticsProgress: [
      { node: '已发货', time: '2023-10-28 16:00', current: false },
      {
        node: '运输中',
        time: '2023-10-29 08:00',
        current: true,
        details: '快件正在派送途中，请耐心等待',
      },
      { node: '派送中', time: 'N/A', current: false },
      { node: '已签收', time: 'N/A', current: false },
    ],
  },
]

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    allOrders.value = JSON.parse(JSON.stringify(mockOrders)) // Deep copy to allow modification
  }, 500)
})

const filteredOrders = computed(() => {
  let ordersToDisplay = allOrders.value

  // Filter by tab status
  if (currentTab.value !== 'all') {
    // Assuming 'all' could be an option in OrderCategoryNav
    ordersToDisplay = ordersToDisplay.filter((order) => order.status === currentTab.value)
  }

  // Filter by search term (product name or order ID)
  if (currentSearchTerm.value) {
    const searchTermLower = currentSearchTerm.value.toLowerCase()
    ordersToDisplay = ordersToDisplay.filter(
      (order) =>
        order.productName.toLowerCase().includes(searchTermLower) ||
        order.id.toLowerCase().includes(searchTermLower),
    )
  }
  return ordersToDisplay
})

const currentNoOrdersMessage = computed(() => {
  if (currentSearchTerm.value) {
    return `未找到与"${currentSearchTerm.value}"相关的订单。`
  }
  // You can add more specific messages based on currentTab.value if needed
  const tabMap = {
    topay: '待付款',
    toship: '待发货',
    toreceive: '待收货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return `当前没有${tabMap[currentTab.value] || '该分类'}的订单哦～`
})

const handleTabSelected = (tabId) => {
  currentTab.value = tabId
  // currentSearchTerm.value = ''; // Optional: clear search when tab changes
}

const handleSearchOrders = (searchTerm) => {
  currentSearchTerm.value = searchTerm
}

// --- Event Handlers for Order Actions ---
const findOrderAndUpdate = (orderId, updates) => {
  const orderIndex = allOrders.value.findIndex((o) => o.id === orderId)
  if (orderIndex !== -1) {
    allOrders.value[orderIndex] = { ...allOrders.value[orderIndex], ...updates }
    // Force a re-render if Vue doesn't pick up nested changes, though direct status change should be fine.
    // allOrders.value = [...allOrders.value];
  } else {
    console.warn(`Order with ID ${orderId} not found for update.`)
  }
}

const updateOrderStatusToShipped = (orderId) => {
  findOrderAndUpdate(orderId, { status: 'toship', countdown: 0 }) // Clear countdown
  console.log(`Order ${orderId} marked as paid, status changed to 'toship'.`)
}

const updateOrderStatusToCompleted = (orderId) => {
  findOrderAndUpdate(orderId, { status: 'completed' })
  console.log(`Order ${orderId} receipt confirmed, status changed to 'completed'.`)
}

// Generic handler for actions that currently only show an alert
const handleGenericEmit = (payload, eventName) => {
  // This function will be called by OrderList when it re-emits events from OrderItemCard
  // For now, we just log it, as the alerts are handled in OrderItemCard.vue
  // In a real app, `eventName` could be used to distinguish actions if needed here.
  console.log(`Event received in OrderView: ${eventName || 'Unknown Event'}, Payload:`, payload)
}
</script>

<style scoped>
.order-view {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f6f8; /* Light grey background for the entire view */
}

.main-content {
  flex-grow: 1;
  /* padding-top: 60px; Assuming TopNav is 60px and fixed */
  /* OrderCategoryNav will have its own stickiness */
}

.order-list-section {
  padding: 15px;
  /* background-color: #fff; */ /* Can set a different bg if needed for the list area itself */
}

/* Footer will be handled by its own component styles */
</style>
