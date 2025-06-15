<template>
  <div class="seller-detail-page">
    <TopNav />
    <div class="main-content">
      <!-- 返回按钮 -->
      <div class="back-button" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>

      <!-- 卖家基本信息卡片 -->
      <SellerProfileCard :seller="sellerInfo" class="full-width-card" />

      <!-- 卖家数据统计卡片 -->
      <SellerStatsCard :stats="sellerStats" class="full-width-card" />

      <!-- TabBar导航 -->
      <div class="tab-section full-width-card">
        <el-tabs v-model="activeTab" class="seller-tabs">
          <el-tab-pane label="在售商品" name="products">
            <div class="products-section">
              <div class="section-header">
                <div class="filter-options">
                  <el-select v-model="sortBy" placeholder="排序方式" size="large">
                    <el-option label="最新上架" value="newest" />
                    <el-option label="价格从低到高" value="price_asc" />
                    <el-option label="价格从高到低" value="price_desc" />
                    <el-option label="销量优先" value="sales" />
                  </el-select>
                </div>
              </div>

              <div class="products-grid">
                <ProductCard
                  v-for="product in sellerProducts"
                  :key="product.id"
                  :product="product"
                  @click="viewProduct(product.id)"
                />
              </div>

              <!-- 商品分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :total="totalProducts"
                  :page-sizes="[12, 24, 36, 48]"
                  layout="total, sizes, prev, pager, next"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="买家评价" name="reviews">
            <div class="reviews-section">
              <div class="review-summary">
                <span class="rating">{{ sellerInfo.rating }}</span>
                <el-rate
                  v-model="sellerInfo.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
                <span class="review-count">共{{ sellerStats.reviewCount }}条评价</span>
              </div>

              <div class="reviews-list">
                <div v-for="review in sellerReviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <el-avatar :size="40" :src="review.userAvatar" />
                    <div class="review-user">
                      <div class="user-name">{{ review.userName }}</div>
                      <div class="review-time">{{ review.time }}</div>
                    </div>
                    <div class="review-rating">
                      <el-rate v-model="review.rating" disabled />
                    </div>
                  </div>
                  <div class="review-content">{{ review.content }}</div>
                  <div v-if="review.images && review.images.length" class="review-images">
                    <el-image
                      v-for="(image, index) in review.images"
                      :key="index"
                      :src="image"
                      :preview-src-list="review.images"
                      fit="cover"
                      class="review-image"
                    />
                  </div>
                </div>
              </div>

              <!-- 评价分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="reviewPage"
                  v-model:page-size="reviewPageSize"
                  :total="totalReviews"
                  :page-sizes="[5, 10, 20, 30]"
                  layout="total, sizes, prev, pager, next"
                  @size-change="handleReviewSizeChange"
                  @current-change="handleReviewPageChange"
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import TopNav from '@/components/shared/TopNav.vue'
import Footer from '@/components/shared/Footer.vue'
import SellerProfileCard from '@/components/seller/SellerProfileCard.vue'
import SellerStatsCard from '@/components/seller/SellerStatsCard.vue'
import ProductCard from '@/components/productlist/ProductCard.vue'

const route = useRoute()
const router = useRouter()

// TabBar相关
const activeTab = ref('products')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const totalProducts = ref(0)
const sortBy = ref('newest')

// 评价相关
const reviewPage = ref(1)
const reviewPageSize = ref(5)
const totalReviews = ref(0)
const sellerReviews = ref([])

// 卖家信息
const sellerInfo = ref({
  id: '',
  name: '',
  avatar: '',
  rating: 0,
  joinDate: '',
  description: '',
  location: '',
  tags: [],
})

// 卖家统计数据
const sellerStats = ref({
  totalSales: 0,
  productCount: 0,
  reviewCount: 0,
  positiveRate: 0,
  followerCount: 0,
})

// 卖家商品列表
const sellerProducts = ref([])

// 获取卖家信息
const fetchSellerInfo = async () => {
  try {
    // TODO: 调用API获取卖家信息
    sellerInfo.value = {
      id: route.params.id,
      name: '示例卖家',
      avatar: 'https://via.placeholder.com/100',
      rating: 4.8,
      joinDate: '2023-01-01',
      description: '这是一个示例卖家描述...',
      location: '北京市朝阳区',
      tags: ['优质卖家', '快速发货', '正品保证'],
    }
  } catch (error) {
    console.error('获取卖家信息失败:', error)
  }
}

// 获取卖家统计数据
const fetchSellerStats = async () => {
  try {
    // TODO: 调用API获取卖家统计数据
    sellerStats.value = {
      totalSales: 1000,
      productCount: 50,
      reviewCount: 200,
      positiveRate: 98,
      followerCount: 500,
    }
  } catch (error) {
    console.error('获取卖家统计数据失败:', error)
  }
}

// 获取卖家商品列表
const fetchSellerProducts = async () => {
  try {
    // TODO: 调用API获取卖家商品列表
    sellerProducts.value = [
      {
        id: '1',
        imageUrl: 'https://via.placeholder.com/300',
        name: '示例商品1',
        currentPrice: '299.00',
        originalPrice: '399.00',
        conditionTag: '9成新',
      },
      // ... 更多商品
    ]
    totalProducts.value = 100
  } catch (error) {
    console.error('获取卖家商品列表失败:', error)
  }
}

// 获取卖家评价列表
const fetchSellerReviews = async () => {
  try {
    // TODO: 调用API获取卖家评价列表
    sellerReviews.value = [
      {
        id: 1,
        userName: '买家A',
        userAvatar: 'https://via.placeholder.com/40',
        rating: 5,
        content: '商品质量很好，卖家服务态度也很好，发货速度快，很满意的一次购物体验！',
        time: '2024-03-20 14:30',
        images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
      },
      // ... 更多评价
    ]
    totalReviews.value = 100
  } catch (error) {
    console.error('获取卖家评价失败:', error)
  }
}

// 查看商品详情
const viewProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchSellerProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchSellerProducts()
}

// 处理评价分页
const handleReviewSizeChange = (val) => {
  reviewPageSize.value = val
  fetchSellerReviews()
}

const handleReviewPageChange = (val) => {
  reviewPage.value = val
  fetchSellerReviews()
}

// 返回上一页
const handleBack = () => {
  router.back()
}

onMounted(() => {
  fetchSellerInfo()
  fetchSellerStats()
  fetchSellerProducts()
  fetchSellerReviews()
})
</script>

<style scoped>
.seller-detail-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.full-width-card {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-section {
  padding: 0;
}

.seller-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.seller-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.seller-tabs :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}

.seller-tabs :deep(.el-tabs__item.is-active) {
  color: #ff6f00;
}

.seller-tabs :deep(.el-tabs__active-bar) {
  background-color: #ff6f00;
}

.products-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.reviews-section {
  padding: 20px;
}

.review-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.rating {
  font-size: 24px;
  font-weight: 600;
  color: #ff6f00;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.reviews-list {
  margin-top: 20px;
}

.review-item {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.review-user {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.review-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.review-content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.review-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media screen and (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .review-header {
    flex-wrap: wrap;
  }

  .review-rating {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
