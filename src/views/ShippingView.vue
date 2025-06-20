<template>
  <div class="shipping-page">
    <TopNav />
    <div class="main-content">
      <div class="shipping-container">
        <div class="page-header">
          <div class="back-button" @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </div>
          <h1 class="page-title">订单发货</h1>
        </div>

        <div class="order-info">
          <div class="info-card">
            <div class="card-header">
              <h3>订单信息</h3>
              <el-tag :type="orderInfo.status === 'pending' ? 'warning' : 'success'">
                {{ getStatusText(orderInfo.status) }}
              </el-tag>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="label">订单编号：</span>
                <span class="value">{{ orderInfo.orderId }}</span>
              </div>
              <div class="info-item">
                <span class="label">下单时间：</span>
                <span class="value">{{ orderInfo.createTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">买家信息：</span>
                <span class="value">{{ orderInfo.buyerName }}</span>
              </div>
              <div class="info-item">
                <span class="label">收货地址：</span>
                <span class="value">{{ orderInfo.address }}</span>
              </div>
            </div>
          </div>

          <div class="product-card">
            <div class="product-info">
              <el-image
                :src="orderInfo.product.image"
                fit="cover"
                class="product-image"
                :preview-src-list="[orderInfo.product.image]"
              />
              <div class="product-details">
                <h4 class="product-name">{{ orderInfo.product.name }}</h4>
                <div class="product-price">¥{{ orderInfo.product.price }}</div>
                <div class="product-quantity">数量：{{ orderInfo.product.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="shipping-form">
            <h3>发货信息</h3>
            <el-form
              ref="formRef"
              :model="shippingForm"
              :rules="rules"
              label-width="100px"
              class="form"
            >
              <el-form-item label="物流公司" prop="company">
                <el-select v-model="shippingForm.company" placeholder="请选择物流公司">
                  <el-option
                    v-for="company in logisticsCompanies"
                    :key="company.code"
                    :label="company.name"
                    :value="company.code"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="物流单号" prop="trackingNumber">
                <el-input
                  v-model="shippingForm.trackingNumber"
                  placeholder="请输入物流单号"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="发货备注" prop="remark">
                <el-input
                  v-model="shippingForm.remark"
                  type="textarea"
                  placeholder="请输入发货备注信息（选填）"
                  :rows="3"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="submitting">
                  确认发货
                </el-button>
                <el-button @click="handleCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import TopNav from '@/components/shared/TopNav.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)

// 物流公司列表
const logisticsCompanies = [
  { code: 'SF', name: '顺丰速运' },
  { code: 'YTO', name: '圆通速递' },
  { code: 'ZTO', name: '中通快递' },
  { code: 'STO', name: '申通快递' },
  { code: 'YD', name: '韵达快递' },
  { code: 'EMS', name: 'EMS' },
  { code: 'HHTT', name: '天天快递' },
  { code: 'JD', name: '京东物流' },
]

// 订单信息
const orderInfo = ref({
  orderId: '',
  status: 'pending',
  createTime: '',
  buyerName: '',
  address: '',
  product: {
    image: '',
    name: '',
    price: '',
    quantity: 1,
  },
})

// 发货表单
const shippingForm = ref({
  company: '',
  trackingNumber: '',
  remark: '',
})

// 表单验证规则
const rules = {
  company: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
  trackingNumber: [
    { required: true, message: '请输入物流单号', trigger: 'blur' },
    { min: 5, max: 50, message: '物流单号长度在 5 到 50 个字符', trigger: 'blur' },
  ],
  remark: [{ max: 200, message: '备注不能超过 200 个字符', trigger: 'blur' }],
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return statusMap[status] || status
}

// 获取订单信息
const fetchOrderInfo = async () => {
  try {
    // TODO: 调用API获取订单信息
    orderInfo.value = {
      orderId: route.params.id,
      status: 'pending',
      createTime: '2024-03-20 14:30:00',
      buyerName: '张三',
      address: '北京市朝阳区xxx街道xxx号',
      product: {
        image: 'https://via.placeholder.com/200',
        name: '示例商品',
        price: '299.00',
        quantity: 1,
      },
    }
  } catch (error) {
    console.error('获取订单信息失败:', error)
  }
}

// 返回上一页
const handleBack = () => {
  const fromPage = route.query.from
  if (fromPage === 'products') {
    router.push('/my-products')
  } else if (fromPage === 'orders') {
    router.push('/orders')
  } else {
    router.back()
  }
}

// 取消
const handleCancel = () => {
  handleBack()
}

// 提交发货
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // TODO: 调用API提交发货信息
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 更新本地存储中的商品状态
    const publishedProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]')
    const productId = route.query.productId
    const updatedProducts = publishedProducts.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          saleStatus: 'completed',
          shippingInfo: {
            company: shippingForm.value.company,
            trackingNumber: shippingForm.value.trackingNumber,
            shippedAt: new Date().toISOString(),
            remark: shippingForm.value.remark,
          },
        }
      }
      return product
    })
    localStorage.setItem('publishedProducts', JSON.stringify(updatedProducts))

    // 显示成功弹窗
    ElMessage({
      type: 'success',
      message: '发货成功！',
      duration: 2000,
    })

    // 延迟跳转到商品管理页面，并选中已完成状态
    setTimeout(() => {
      router.push({
        path: '/my-products',
        query: {
          saleStatus: 'completed',
          highlightId: productId, // 用于高亮显示刚发货的商品
        },
      })
    }, 1500)
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error('发货失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchOrderInfo()
})
</script>

<style scoped>
.shipping-page {
  margin-top: 50px;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.shipping-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  /* background-color: #f8f8f8; */
  /* background-color: #ff6f0054; */
  border: 1px solid #bebcba;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ff6f00;
  color: white;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.card-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.label {
  color: #666;
  min-width: 80px;
}

.value {
  color: #333;
  font-weight: 500;
}

.product-card {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
}

.product-info {
  display: flex;
  gap: 20px;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.product-price {
  font-size: 18px;
  color: #ff6f00;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-quantity {
  color: #666;
}

.shipping-form {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
}

.shipping-form h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.form {
  max-width: 600px;
}

@media screen and (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .shipping-container {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .card-content {
    grid-template-columns: 1fr;
  }

  .product-info {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
    height: 200px;
  }
}
</style>
