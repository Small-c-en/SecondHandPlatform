<template>
  <div class="my-products">
    <!-- 顶部功能栏 -->
    <div class="header-section">
      <div class="top-row">
        <h1>我的商品管理</h1>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="按标题/品类搜索"
            @input="handleSearch"
          />
          <i class="fas fa-search"></i>
        </div>
        <button class="publish-btn" @click="navigateToPublish">
          <i class="fas fa-plus"></i>
          快速发布
        </button>
      </div>
      <div class="filter-tags">
        <div class="status-filter-group">
          <el-select v-model="selectedPublishStatus" placeholder="发布状态" class="status-select">
            <el-option label="全部发布状态" value="all" />
            <el-option
              v-for="status in publishStatusFilters"
              :key="status.value"
              :label="status.label + (status.count ? ` (${status.count})` : '')"
              :value="status.value"
            />
          </el-select>
          <el-select v-model="selectedSaleStatus" placeholder="售卖状态" class="status-select">
            <el-option label="全部售卖状态" value="all" />
            <el-option
              v-for="status in saleStatusFilters"
              :key="status.value"
              :label="status.label + (status.count ? ` (${status.count})` : '')"
              :value="status.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 自定义确认弹窗 -->
    <el-dialog
      v-model="confirmDialog.visible"
      :title="confirmDialog.title"
      width="400px"
      class="confirm-dialog"
    >
      <div class="confirm-content">
        <i
          :class="[
            'dialog-icon',
            confirmDialog.type === 'delete' ? 'fas fa-trash-alt' : 'fas fa-ban',
          ]"
        ></i>
        <p>{{ confirmDialog.message }}</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmDialog.visible = false">取消</el-button>
          <el-button
            :type="confirmDialog.type === 'delete' ? 'danger' : 'warning'"
            @click="handleConfirmAction"
          >
            确认{{ confirmDialog.type === 'delete' ? '删除' : '下架' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 数据统计区 -->
    <div class="statistics-section">
      <div
        class="stat-card"
        :class="{ active: selectedPublishStatus === 'on_sale' }"
        @click="handleStatCardClick('on_sale')"
      >
        <div class="stat-info">
          <div class="stat-value">{{ statistics.onSale }}<span>件</span></div>
          <div class="stat-label">在售商品</div>
          <div class="stat-trend up">
            <i class="fas fa-arrow-up"></i>
            <span>较上周 +5%</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-shopping-bag"></i>
        </div>
      </div>

      <div
        class="stat-card"
        :class="{ active: selectedSaleStatus === 'to_ship' }"
        @click="handleStatCardClick('to_ship', 'sale')"
      >
        <div class="stat-info">
          <div class="stat-value">{{ statistics.pendingOrders }}<span>笔</span></div>
          <div class="stat-label">待发货订单</div>
          <div class="stat-trend urgent">
            <i class="fas fa-exclamation-circle"></i>
            <span>需要处理</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-truck"></i>
        </div>
      </div>

      <div
        class="stat-card"
        :class="{ active: selectedSaleStatus === 'to_refund' }"
        @click="handleStatCardClick('to_refund', 'sale')"
      >
        <div class="stat-info">
          <div class="stat-value">{{ statistics.pendingRefunds }}<span>笔</span></div>
          <div class="stat-label">待退款订单</div>
          <div class="stat-trend warning">
            <i class="fas fa-undo-alt"></i>
            <span>{{ statistics.refundAmount }}元待处理</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-hand-holding-usd"></i>
        </div>
      </div>

      <div
        class="stat-card"
        :class="{ active: selectedPublishStatus === 'sold' }"
        @click="handleStatCardClick('sold')"
      >
        <div class="stat-info">
          <div class="stat-value">{{ statistics.soldCount }}<span>件</span></div>
          <div class="stat-label">已售商品</div>
          <div class="stat-trend">
            <mini-trend-chart :data="statistics.salesTrend" />
            <span>近7天走势</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
      </div>
      <!-- 今日浏览 -->
      <!-- <div class="stat-card views">
        <div class="stat-info">
          <div class="stat-value">{{ statistics.todayViews }}<span>次</span></div>
          <div class="stat-label">今日浏览</div>
          <div class="stat-trend">
            <mini-trend-chart :data="statistics.viewsTrend" />
            <span>近7天趋势</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
      </div> -->
    </div>

    <!-- 快捷工具区 -->
    <!-- <div class="quick-tools">
      <button class="tool-btn" @click="openInventoryAlert">
        <i class="fas fa-warehouse"></i>
        库存预警
      </button>
      <button class="tool-btn" @click="openViolationCheck">
        <i class="fas fa-shield-alt"></i>
        违规检测
      </button>
      <button class="tool-btn" @click="openAutoListingSettings">
        <i class="fas fa-clock"></i>
        自动上下架设置
      </button>
    </div> -->

    <!-- 批量操作区 -->
    <div class="batch-actions" v-show="selectedProducts.length > 0">
      <span class="selected-count">已选择 {{ selectedProducts.length }} 件商品</span>
      <div class="action-buttons">
        <button class="batch-btn" @click="batchDelist">批量下架</button>
        <button class="batch-btn danger" @click="batchDelete">批量删除</button>
      </div>
    </div>

    <!-- 商品列表区 -->
    <div class="products-list" v-if="displayedProducts.length > 0">
      <div
        v-for="product in displayedProducts"
        :key="product.id"
        :data-product-id="product.id"
        class="product-card"
      >
        <div class="checkbox-area">
          <input
            type="checkbox"
            :checked="selectedProducts.includes(product.id)"
            @change="toggleProductSelection(product.id)"
          />
        </div>
        <div class="product-image" @mouseover="showImagePreview(product)">
          <img :src="product.mainImage" :alt="product.title" />
        </div>
        <div class="product-info">
          <h3 class="product-title">{{ product.title }}</h3>
          <div class="product-meta">
            <span class="category">{{ product.category }}</span>
            <span class="condition-tag">{{ product.condition }}</span>
          </div>
        </div>
        <div class="price-status">
          <div class="price">
            <span class="current-price">¥{{ product.price }}</span>
            <span class="original-price">¥{{ product.originalPrice }}</span>
          </div>
          <div class="status-tag" :class="[product.status, { 'is-top': product.isTop }]">
            {{ getStatusLabel(product.status) }}
            <span v-if="product.isTop" class="top-indicator">置顶</span>
          </div>
        </div>
        <div class="actions">
          <button class="action-btn" @click="editProduct(product)">编辑</button>
          <button
            v-if="product.saleStatus === 'to_ship'"
            class="action-btn primary"
            @click="handleShipping(product)"
          >
            发货
          </button>
          <button class="action-btn" @click="toggleListing(product)">
            {{ product.status === 'on_sale' ? '下架' : '上架' }}
          </button>
          <button class="action-btn" @click="pinProduct(product)">置顶</button>
          <button class="action-btn danger" @click="deleteProduct(product)">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态展示 -->
    <div v-else class="empty-state">
      <img src="/empty-products.svg" alt="暂无商品" />
      <p>暂无发布的商品，点击 [发布新商品] 开启交易</p>
      <button class="publish-btn" @click="navigateToPublish">发布新商品</button>
    </div>

    <!-- 分页区域 -->
    <div class="pagination" v-if="products.length > 0">
      <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">
        共 {{ totalProducts }} 件商品，当前第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import MiniTrendChart from './MiniTrendChart.vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElSelect, ElOption } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 发布状态过滤器选项
const publishStatusFilters = [
  { label: '草稿箱', value: 'draft', count: 0 },
  { label: '待审核', value: 'pending', count: 0 },
  { label: '在售中', value: 'on_sale', count: 0 },
  { label: '已下架', value: 'off_shelf', count: 0 },
  { label: '已卖出', value: 'sold', count: 0 },
]

// 售卖状态过滤器选项
const saleStatusFilters = [
  { label: '待发货', value: 'to_ship', count: 0 },
  { label: '待退款', value: 'to_refund', count: 0 },
  { label: '退款中', value: 'refunding', count: 0 },
  { label: '已完成', value: 'completed', count: 0 },
]

// 选中的状态
const selectedPublishStatus = ref('all')
const selectedSaleStatus = ref('all')

// 响应式状态
const searchQuery = ref('')
const selectedProducts = ref([])
const currentPage = ref(1)
const totalPages = ref(10)
const totalProducts = ref(100)

// 模拟数据
const statistics = reactive({
  onSale: 28,
  pendingOrders: 5,
  pendingRefunds: 3,
  refundAmount: '2,380.00',
  soldCount: 156,
  todayViews: 245,
  viewsTrend: [45, 82, 67, 134, 156, 142, 192],
  salesTrend: [12, 15, 18, 22, 25, 28, 32],
})

const products = ref([
  {
    id: 1,
    title: 'iPhone 12 Pro Max 256GB 海蓝色',
    mainImage: 'https://example.com/iphone.jpg',
    category: '手机数码',
    condition: '9成新',
    price: 4999,
    originalPrice: 8499,
    status: 'on_sale',
    isTop: false,
  },
  // ... 更多商品数据
])

const itemsPerPage = 4 // 限制每页显示4条数据
const startIndex = (currentPage.value - 1) * itemsPerPage
const endIndex = startIndex + itemsPerPage
const displayedProducts = computed(() => products.value.slice(startIndex, endIndex))

// 方法
const handleSearch = () => {
  // 实现搜索逻辑
}

const toggleProductSelection = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const getStatusLabel = (status) => {
  const statusMap = {
    draft: '草稿箱',
    pending: '待审核',
    on_sale: '在售中',
    off_shelf: '已下架',
    sold: '已卖出',
    to_ship: '待发货',
    to_refund: '待退款',
    refunding: '退款中',
    completed: '已完成',
  }
  return statusMap[status] || status
}

const navigateToPublish = () => {
  router.push('/publish')
}

const editProduct = (product) => {
  router.push({
    path: '/publish',
    query: {
      mode: product.status === 'draft' ? 'draft' : 'edit',
      productId: product.id,
      ...product,
    },
  })
}

const toggleListing = (product) => {
  confirmDialog.visible = true
  confirmDialog.title = product.status === 'on_sale' ? '下架商品' : '上架商品'
  confirmDialog.message = `确定要${product.status === 'on_sale' ? '下架' : '上架'}该商品吗？`
  confirmDialog.type = 'delist'
  confirmDialog.callback = async () => {
    try {
      product.status = product.status === 'on_sale' ? 'off_shelf' : 'on_sale'
      const publishedProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]')
      const updatedProducts = publishedProducts.map((p) =>
        p.id === product.id ? { ...p, status: product.status } : p,
      )
      localStorage.setItem('publishedProducts', JSON.stringify(updatedProducts))
      ElMessage.success(`商品已${product.status === 'on_sale' ? '上架' : '下架'}`)
      loadProducts()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const pinProduct = async (product) => {
  try {
    product.isTop = !product.isTop
    const publishedProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]')
    const updatedProducts = publishedProducts.map((p) =>
      p.id === product.id ? { ...p, isTop: product.isTop } : p,
    )
    // 重新排序，将置顶商品放在前面
    products.value.sort((a, b) => {
      if (a.isTop === b.isTop) return 0
      return a.isTop ? -1 : 1
    })
    localStorage.setItem('publishedProducts', JSON.stringify(updatedProducts))
    ElMessage.success(product.isTop ? '商品已置顶' : '已取消置顶')
  } catch (error) {
    console.error('置顶操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const deleteProduct = (product) => {
  confirmDialog.visible = true
  confirmDialog.title = '删除商品'
  confirmDialog.message = '确定要删除该商品吗？删除后无法恢复。'
  confirmDialog.type = 'delete'
  confirmDialog.callback = async () => {
    try {
      if (product.status === 'draft') {
        const drafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
        const updatedDrafts = drafts.filter((d) => d.id !== product.id)
        localStorage.setItem('productDrafts', JSON.stringify(updatedDrafts))
      } else {
        const publishedProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]')
        const updatedProducts = publishedProducts.filter((p) => p.id !== product.id)
        localStorage.setItem('publishedProducts', JSON.stringify(updatedProducts))
      }
      products.value = products.value.filter((p) => p.id !== product.id)
      ElMessage.success('商品已删除')
      loadProducts()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const batchDelist = () => {
  // 实现批量下架逻辑
}

const batchDelete = () => {
  // 实现批量删除逻辑
}

const changePage = (page) => {
  currentPage.value = page
  // 实现分页逻辑
}

const openInventoryAlert = () => {
  // 实现库存预警逻辑
}

const openViolationCheck = () => {
  // 实现违规检测逻辑
}

const openAutoListingSettings = () => {
  // 实现自动上下架设置逻辑
}

const updateStatusCounts = (allProducts) => {
  // 更新发布状态计数
  publishStatusFilters.forEach((filter) => {
    filter.count = allProducts.filter((p) => p.status === filter.value).length
  })

  // 更新售卖状态计数
  saleStatusFilters.forEach((filter) => {
    filter.count = allProducts.filter((p) => p.saleStatus === filter.value).length
  })
}

const loadProducts = () => {
  // 从本地存储加载商品
  const allProducts = [
    ...JSON.parse(localStorage.getItem('productDrafts') || '[]'),
    ...JSON.parse(localStorage.getItem('publishedProducts') || '[]'),
  ]

  // 根据选中的状态过滤商品
  products.value = allProducts.filter((product) => {
    const matchPublishStatus =
      selectedPublishStatus.value === 'all' || product.status === selectedPublishStatus.value
    const matchSaleStatus =
      selectedSaleStatus.value === 'all' || product.saleStatus === selectedSaleStatus.value
    return matchPublishStatus && matchSaleStatus
  })

  // 更新状态计数
  updateStatusCounts(allProducts)
}

// 监听状态变化
watch([selectedPublishStatus, selectedSaleStatus], () => {
  loadProducts()
})

// 初始加载
onMounted(() => {
  // 如果URL中有状态参数，设置选中状态
  const { saleStatus, highlightId } = route.query

  if (saleStatus) {
    selectedSaleStatus.value = saleStatus
  }

  loadProducts()

  // 如果有高亮商品ID，滚动到该商品并添加高亮效果
  if (highlightId) {
    nextTick(() => {
      const productElement = document.querySelector(`[data-product-id="${highlightId}"]`)
      if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        productElement.classList.add('highlight-animation')

        // 3秒后移除高亮效果
        setTimeout(() => {
          productElement.classList.remove('highlight-animation')
        }, 3000)
      }
    })
  }
})

// 确认弹窗状态
const confirmDialog = reactive({
  visible: false,
  title: '',
  message: '',
  type: '', // 'delete' 或 'delist'
  callback: null,
  productId: null,
})

// 处理确认操作
const handleConfirmAction = async () => {
  if (confirmDialog.callback) {
    await confirmDialog.callback()
  }
  confirmDialog.visible = false
}

const handleShipping = (product) => {
  router.push({
    path: `/shipping/${product.orderId}`,
    query: {
      from: 'products',
      productId: product.id,
    },
  })
}

// 更新点击处理方法
const handleStatCardClick = (status, type = 'publish') => {
  if (type === 'publish') {
    // 如果当前状态已经是选中的，则取消选中
    selectedPublishStatus.value = selectedPublishStatus.value === status ? 'all' : status
  } else if (type === 'sale') {
    // 如果当前状态已经是选中的，则取消选中
    selectedSaleStatus.value = selectedSaleStatus.value === status ? 'all' : status
  }

  // 根据最新的选中状态更新多选框
  if (selectedPublishStatus.value === 'all' && selectedSaleStatus.value === 'all') {
    // 如果都是 all，则清空选中
    selectedProducts.value = []
  } else {
    // 自动选中对应状态的商品
    const productsToSelect = products.value.filter((product) => {
      const matchPublishStatus =
        selectedPublishStatus.value === 'all' || product.status === selectedPublishStatus.value
      const matchSaleStatus =
        selectedSaleStatus.value === 'all' || product.saleStatus === selectedSaleStatus.value
      return matchPublishStatus && matchSaleStatus
    })

    selectedProducts.value = productsToSelect.map((p) => p.id)
  }
}
</script>

<style scoped>
.my-products {
  padding: 24px;
  background: #fff;
}

.header-section {
  margin-bottom: 24px;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}

.top-row h1 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  height: 40px;
  padding: 0 16px 0 40px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #ff6f00;
  box-shadow: 0 0 0 2px rgba(255, 111, 0, 0.1);
  outline: none;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  height: 40px;
  background: #ff6f00;
  color: white;
  border: none;
  border-radius: 20px;
  margin-left: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.publish-btn:hover {
  background: #f05600;
  box-shadow: 0 2px 8px rgba(255, 111, 0, 0.3);
}

.filter-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-tag:hover {
  border-color: #ff6f00;
  color: #ff6f00;
}

.filter-tag.active {
  background: #ff6f00;
  color: white;
  border-color: #ff6f00;
}

.filter-tag .count {
  font-size: 12px;
  opacity: 0.8;
}

.confirm-dialog {
  :deep(.el-dialog__header) {
    padding: 20px 20px 10px;
    margin: 0;
    text-align: center;
    font-size: 18px;
  }
}

.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.dialog-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ff6f00;
}

.dialog-icon.fa-trash-alt {
  color: #f56c6c;
}

.confirm-content p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.dialog-footer {
  text-align: center;
  padding-top: 10px;
}

.statistics-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  padding: 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.active {
  background: #fff3e0;
  border-color: #ff6f00;
}

.stat-card.active::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-style: solid;
  border-width: 0 24px 24px 0;
  border-color: transparent #ff6f00 transparent transparent;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
}

.stat-value span {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.stat-trend.up {
  color: #52c41a;
}

.stat-trend.down {
  color: #ff4d4f;
}

.stat-trend.urgent {
  color: #ff6f00;
}

.stat-trend.warning {
  color: #faad14;
}

.stat-trend i {
  font-size: 14px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 111, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 20px;
  color: #ff6f00;
}

.stat-card.views {
  cursor: default;
}

.stat-card.views:hover {
  transform: none;
}

.quick-tools {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-btn:hover {
  border-color: #007aff;
  color: #007aff;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.selected-count {
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.batch-btn {
  padding: 8px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.batch-btn.danger {
  background: #ff4d4f;
  color: white;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.checkbox-area {
  padding: 0 16px;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  padding: 0 24px;
}

.product-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  gap: 12px;
}

.category {
  color: #666;
}

.condition-tag {
  padding: 2px 8px;
  background: #fff3e0;
  color: #ff5722;
  border-radius: 4px;
  font-size: 12px;
}

.price-status {
  padding: 0 24px;
  text-align: right;
}

.current-price {
  font-size: 20px;
  color: #ff5722;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 8px;
}

.status-tag.on_sale {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-tag.off_shelf {
  background: #f5f5f5;
  color: #999;
}

.status-tag.sold {
  background: #e6f7ff;
  color: #1890ff;
}

.status-tag.is-top {
  position: relative;
  padding-right: 50px;
}

.top-indicator {
  position: absolute;
  right: 8px;
  background: #ff6f00;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #007aff;
  color: #007aff;
}

.action-btn.danger:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.action-btn.primary {
  border-color: #ff6f00;
  color: #ff6f00;
}

.action-btn.primary:hover {
  background-color: #ff6f00;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
}

.empty-state img {
  width: 200px;
  margin-bottom: 24px;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-info {
  color: #666;
}

.status-tag.draft {
  background: #f0f2f5;
  color: #909399;
}

.status-filter-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

.status-select {
  width: 200px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: #ff6f00;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
}

:deep(.el-select-dropdown__item) {
  color: #606266;
}

:deep(.el-select-dropdown__item.hover) {
  background-color: #fff3e0;
}

:deep(.el-select-dropdown__item.selected) {
  color: #ff6f00;
  background-color: #fff3e0;
  font-weight: 700;
}

:deep(.el-select .el-select__tags .el-tag) {
  background-color: #fff3e0;
  border-color: #ffcc80;
  color: #ff6f00;
}

:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
}

:deep(.el-popper.is-light .el-popper__arrow::before) {
  border-color: #ff6f00;
}

@keyframes highlight {
  0% {
    background-color: #fff3e0;
    transform: scale(1);
  }
  50% {
    background-color: #ffe0b2;
    transform: scale(1.02);
  }
  100% {
    background-color: white;
    transform: scale(1);
  }
}

.highlight-animation {
  animation: highlight 3s ease;
}
</style>
