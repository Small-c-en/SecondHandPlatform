<template>
  <div class="refund-page">
    <TopNav title="退款处理" />

    <div class="refund-container">
      <!-- 订单信息 -->
      <div class="order-card">
        <div class="order-header">
          <div class="order-id">订单号：{{ order.id }}</div>
          <div class="order-time">下单时间：{{ order.createTime }}</div>
        </div>

        <div class="product-info">
          <el-image
            :src="order.product.image"
            :preview-src-list="[order.product.image]"
            fit="cover"
            class="product-image"
          />
          <div class="product-details">
            <div class="product-name">{{ order.product.name }}</div>
            <div class="product-price">¥{{ order.product.price }}</div>
            <div class="product-quantity">x{{ order.product.quantity }}</div>
          </div>
        </div>

        <div class="order-status">
          <el-tag :type="getStatusType(order.status)" effect="light">
            {{ order.status }}
          </el-tag>
        </div>
      </div>

      <!-- 退款信息 -->
      <div class="refund-info">
        <div class="info-header">
          <div class="info-title">退款信息</div>
          <div class="info-time">申请时间：{{ refund.applyTime }}</div>
        </div>

        <div class="info-content">
          <div class="info-item">
            <div class="item-label">退款金额</div>
            <div class="item-value price">¥{{ refund.amount }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">退款原因</div>
            <div class="item-value">{{ refund.reason }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">退款说明</div>
            <div class="item-value">{{ refund.description }}</div>
          </div>
          <div class="info-item" v-if="refund.images && refund.images.length">
            <div class="item-label">凭证图片</div>
            <div class="item-images">
              <el-image
                v-for="(image, index) in refund.images"
                :key="index"
                :src="image"
                :preview-src-list="refund.images"
                fit="cover"
                class="refund-image"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 处理表单 -->
      <div class="refund-form" v-if="isSeller">
        <div class="form-item">
          <div class="form-label">处理结果</div>
          <el-radio-group v-model="form.result">
            <el-radio label="approve">同意退款</el-radio>
            <el-radio label="reject">拒绝退款</el-radio>
          </el-radio-group>
        </div>

        <div class="form-item">
          <div class="form-label">处理说明</div>
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
            maxlength="200"
            show-word-limit
          />
        </div>

        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交处理
          </el-button>
        </div>
      </div>

      <!-- 退款状态 -->
      <div class="refund-status" v-else>
        <div class="status-timeline">
          <div
            v-for="(status, index) in refund.statusList"
            :key="index"
            class="status-item"
            :class="{ active: status.active }"
          >
            <div class="status-dot"></div>
            <div class="status-content">
              <div class="status-title">{{ status.title }}</div>
              <div class="status-time">{{ status.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import TopNav from '@/components/shared/TopNav.vue'

const route = useRoute()
const router = useRouter()

// 订单信息
const order = ref({
  id: '',
  createTime: '',
  status: '',
  product: {
    name: '',
    price: '',
    quantity: 1,
    image: '',
  },
})

// 退款信息
const refund = ref({
  applyTime: '',
  amount: '',
  reason: '',
  description: '',
  images: [],
  statusList: [],
})

// 表单数据
const form = ref({
  result: 'approve',
  reason: '',
})

const submitting = ref(false)
const isSeller = ref(true) // 根据用户角色判断

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    待处理: 'warning',
    已同意: 'success',
    已拒绝: 'danger',
    已完成: 'info',
  }
  return statusMap[status] || 'info'
}

// 获取订单和退款信息
const fetchOrderInfo = async () => {
  try {
    // TODO: 调用API获取订单和退款信息
    order.value = {
      id: '202403200001',
      createTime: '2024-03-20 10:30:00',
      status: '待处理',
      product: {
        name: 'iPhone 13 Pro Max',
        price: '8999.00',
        quantity: 1,
        image: 'https://example.com/iphone.jpg',
      },
    }

    refund.value = {
      applyTime: '2024-03-20 11:30:00',
      amount: '8999.00',
      reason: '商品质量问题',
      description: '收到商品后发现屏幕有划痕，影响使用',
      images: ['https://example.com/refund1.jpg', 'https://example.com/refund2.jpg'],
      statusList: [
        {
          title: '买家申请退款',
          time: '2024-03-20 11:30:00',
          active: true,
        },
        {
          title: '等待卖家处理',
          time: '2024-03-20 11:30:00',
          active: true,
        },
        {
          title: '退款完成',
          time: '',
          active: false,
        },
      ],
    }
  } catch (error) {
    ElMessage.error('获取订单信息失败')
  }
}

// 处理取消
const handleCancel = () => {
  router.back()
}

// 处理提交
const handleSubmit = async () => {
  if (!form.value.reason.trim()) {
    ElMessage.warning('请输入处理说明')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要${form.value.result === 'approve' ? '同意' : '拒绝'}退款申请吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    submitting.value = true
    // TODO: 调用API提交退款处理结果
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success('处理成功')
    router.back()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('处理失败')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchOrderInfo()
})
</script>

<style scoped>
.refund-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.refund-container {
  padding: 16px;
}

.order-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.order-id {
  font-size: 14px;
  color: #666;
}

.order-time {
  font-size: 14px;
  color: #999;
}

.product-info {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 18px;
  font-weight: 500;
  color: #ff6f00;
  margin-bottom: 4px;
}

.product-quantity {
  font-size: 14px;
  color: #999;
}

.order-status {
  margin-top: 16px;
  text-align: right;
}

.refund-info {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.info-time {
  font-size: 14px;
  color: #999;
}

.info-content {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  margin-bottom: 16px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.item-value {
  font-size: 14px;
  color: #333;
}

.item-value.price {
  font-size: 20px;
  font-weight: 500;
  color: #ff6f00;
}

.item-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.refund-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.refund-form {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.refund-status {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.status-timeline {
  position: relative;
  padding-left: 20px;
}

.status-timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.status-item {
  position: relative;
  padding-bottom: 24px;
}

.status-item:last-child {
  padding-bottom: 0;
}

.status-item.active .status-dot {
  background: #ff6f00;
  border-color: #ff6f00;
}

.status-item.active .status-title {
  color: #333;
}

.status-dot {
  position: absolute;
  left: -20px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e0e0e0;
}

.status-content {
  padding-left: 8px;
}

.status-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.status-time {
  font-size: 12px;
  color: #999;
}

@media screen and (max-width: 768px) {
  .refund-container {
    padding: 12px;
  }

  .order-card,
  .refund-info,
  .refund-form,
  .refund-status {
    padding: 12px;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }

  .product-name {
    font-size: 14px;
  }

  .product-price {
    font-size: 16px;
  }

  .refund-image {
    width: 60px;
    height: 60px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
