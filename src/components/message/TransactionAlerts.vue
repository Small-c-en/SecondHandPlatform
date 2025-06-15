<template>
  <div class="transaction-alerts">
    <div v-if="!messages.length" class="empty-state">
      <el-empty description="暂无交易提醒" />
    </div>

    <div v-else class="alerts-list">
      <div
        v-for="message in messages"
        :key="message.id"
        class="alert-item"
        :class="{ unread: !message.read }"
        @click="handleAlertClick(message)"
      >
        <div class="alert-icon" :class="message.type">
          <el-icon v-if="message.type === 'shipping'"><Van /></el-icon>
          <el-icon v-else-if="message.type === 'payment'"><Money /></el-icon>
          <el-icon v-else-if="message.type === 'review'"><Star /></el-icon>
          <el-icon v-else-if="message.type === 'refund'"><Warning /></el-icon>
          <el-icon v-else><ShoppingCart /></el-icon>
        </div>

        <div class="alert-content">
          <div class="alert-header">
            <span class="alert-title">{{ message.title }}</span>
            <span class="alert-time">{{ message.time }}</span>
          </div>

          <div class="alert-body">
            <div class="alert-message">{{ message.content }}</div>
            <div v-if="message.product" class="product-info">
              <el-image
                :src="message.product.image"
                :preview-src-list="[message.product.image]"
                fit="cover"
                class="product-image"
              />
              <div class="product-details">
                <div class="product-name">{{ message.product.name }}</div>
                <div class="product-price">¥{{ message.product.price }}</div>
              </div>
            </div>
          </div>

          <div class="alert-footer">
            <div class="alert-status">
              <el-tag :type="getStatusType(message.status)" size="small" effect="light">
                {{ message.status }}
              </el-tag>
            </div>
            <div class="alert-actions">
              <el-button
                v-if="message.type === 'shipping' && message.isSeller"
                type="primary"
                size="small"
                @click.stop="handleShipping(message)"
              >
                去发货
              </el-button>
              <el-button
                v-if="message.type === 'payment' && !message.isSeller"
                type="primary"
                size="small"
                @click.stop="handleConfirmReceipt(message)"
              >
                确认收货
              </el-button>
              <el-button
                v-if="message.type === 'review' && !message.isSeller"
                type="primary"
                size="small"
                @click.stop="handleReview(message)"
              >
                去评价
              </el-button>
              <el-button
                v-if="message.type === 'refund'"
                type="primary"
                size="small"
                @click.stop="handleRefund(message)"
              >
                处理退款
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Van, Money, Star, Warning, ShoppingCart } from '@element-plus/icons-vue'

const router = useRouter()

// 模拟消息数据
const messages = ref([
  {
    id: 1,
    type: 'shipping',
    title: '待发货提醒',
    content: '您有一个订单需要发货',
    time: '2024-03-20 10:30',
    status: '待发货',
    read: false,
    isSeller: true,
    product: {
      id: '123',
      name: 'iPhone 13 Pro Max',
      price: '8999.00',
      image: 'https://example.com/iphone.jpg',
    },
  },
  {
    id: 2,
    type: 'payment',
    title: '订单已付款',
    content: '您的订单已付款，等待卖家发货',
    time: '2024-03-20 09:15',
    status: '待发货',
    read: true,
    isSeller: false,
    product: {
      id: '124',
      name: 'MacBook Pro 2023',
      price: '12999.00',
      image: 'https://example.com/macbook.jpg',
    },
  },
  {
    id: 3,
    type: 'review',
    title: '待评价提醒',
    content: '您有一个订单待评价',
    time: '2024-03-19 15:45',
    status: '待评价',
    read: false,
    isSeller: false,
    product: {
      id: '125',
      name: 'AirPods Pro',
      price: '1999.00',
      image: 'https://example.com/airpods.jpg',
    },
  },
  {
    id: 4,
    type: 'refund',
    title: '退款申请',
    content: '买家申请退款',
    time: '2024-03-19 14:20',
    status: '待处理',
    read: false,
    isSeller: true,
    product: {
      id: '126',
      name: 'iPad Pro',
      price: '6999.00',
      image: 'https://example.com/ipad.jpg',
    },
  },
])

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    待发货: 'warning',
    待收货: 'primary',
    待评价: 'success',
    待处理: 'danger',
    已完成: 'info',
  }
  return statusMap[status] || 'info'
}

// 处理消息点击
const handleAlertClick = (message) => {
  message.read = true
  // 根据消息类型跳转到不同页面
  switch (message.type) {
    case 'shipping':
      if (message.isSeller) {
        router.push(`/shipping/${message.product.id}`)
      }
      break
    case 'payment':
      router.push(`/order/${message.product.id}`)
      break
    case 'review':
      router.push(`/review/${message.product.id}`)
      break
    case 'refund':
      router.push(`/refund/${message.product.id}`)
      break
  }
}

// 处理发货
const handleShipping = (message) => {
  router.push(`/shipping/${message.product.id}`)
}

// 处理确认收货
const handleConfirmReceipt = (message) => {
  // 实现确认收货逻辑
}

// 处理评价
const handleReview = (message) => {
  router.push(`/review/${message.product.id}`)
}

// 处理退款
const handleRefund = (message) => {
  router.push(`/refund/${message.product.id}`)
}
</script>

<style scoped>
.transaction-alerts {
  padding: 16px;
}

.empty-state {
  padding: 32px 0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.alert-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.alert-item.unread {
  background: #fff8f0;
}

.alert-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 24px;
  color: #fff;
}

.alert-icon.shipping {
  background: #ff6f00;
}

.alert-icon.payment {
  background: #67c23a;
}

.alert-icon.review {
  background: #e6a23c;
}

.alert-icon.refund {
  background: #f56c6c;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.alert-time {
  font-size: 13px;
  color: #999;
}

.alert-body {
  margin-bottom: 12px;
}

.alert-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.product-info {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 6px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 16px;
  font-weight: 500;
  color: #ff6f00;
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

@media screen and (max-width: 768px) {
  .transaction-alerts {
    padding: 12px;
  }

  .alert-item {
    padding: 12px;
  }

  .alert-icon {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }

  .alert-title {
    font-size: 15px;
  }

  .product-info {
    padding: 8px;
  }

  .product-image {
    width: 50px;
    height: 50px;
  }

  .alert-actions {
    flex-direction: column;
  }

  .alert-actions .el-button {
    width: 100%;
  }
}
</style>
