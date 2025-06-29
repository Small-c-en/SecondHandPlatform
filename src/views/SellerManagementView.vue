<template>
  <div class="seller-management-page">
    <TopNav />
    <div class="main-content">
      <h2 class="page-title">卖家中心</h2>

      <!-- 改进卡片 UI 设计 - 两列布局 -->
      <div class="stats-container">
        <SellerProfileCard :seller="sellerInfo" class="card profile-card" />
        <SellerStatsCard :stats="sellerStats" class="card stats-card" />
      </div>

      <!-- TabBar导航 -->
      <div class="tab-section card">
        <el-tabs v-model="activeTab" class="seller-tabs">
          <el-tab-pane label="在售商品" name="products">
            <div class="management-actions">
              <el-button
                type="primary"
                @click="navigateToPublish"
                :icon="Plus"
                class="action-button"
              >
                发布新商品
              </el-button>
              <div class="filter-options">
                <el-select v-model="sortBy" placeholder="排序方式" class="filter-select">
                  <el-option label="最新上架" value="newest" />
                  <el-option label="价格从低到高" value="price_asc" />
                  <el-option label="价格从高到低" value="price_desc" />
                  <el-option label="销量优先" value="sales" />
                </el-select>
                <el-select v-model="filterStatus" placeholder="商品状态" class="filter-select">
                  <el-option label="全部" value="all" />
                  <el-option label="在售中" value="selling" />
                  <el-option label="已售出" value="sold" />
                  <el-option label="已下架" value="offline" />
                </el-select>
              </div>
            </div>

            <div class="products-list">
              <el-table
                :data="myProducts"
                style="width: 100%"
                :border="false"
                row-class-name="table-row"
              >
                <el-table-column label="商品" min-width="300">
                  <template #default="scope">
                    <div class="product-info-cell">
                      <el-image :src="scope.row.imageUrl" class="product-thumbnail" fit="cover" />
                      <div class="product-details">
                        <div class="product-name">{{ scope.row.name }}</div>
                        <div class="product-price">¥{{ scope.row.currentPrice }}</div>
                        <el-tag
                          size="small"
                          :type="getStatusTagType(scope.row.status)"
                          effect="light"
                        >
                          {{ getStatusText(scope.row.status) }}
                        </el-tag>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="发布时间" width="180">
                  <template #default="scope">
                    <span class="time-text">{{ scope.row.publishTime }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="浏览量" width="100">
                  <template #default="scope">
                    <span class="stat-number">{{ scope.row.views }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="收藏数" width="100">
                  <template #default="scope">
                    <span class="stat-number">{{ scope.row.favorites }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="280">
                  <template #default="scope">
                    <div class="action-buttons">
                      <el-button
                        size="small"
                        @click="viewProductDetail(scope.row.id)"
                        type="info"
                        plain
                        >详情</el-button
                      >
                      <el-button
                        size="small"
                        @click="editProduct(scope.row.id)"
                        type="primary"
                        plain
                        >编辑</el-button
                      >
                      <el-button
                        size="small"
                        :type="scope.row.status === 'selling' ? 'warning' : 'success'"
                        @click="toggleProductStatus(scope.row)"
                      >
                        {{ scope.row.status === 'selling' ? '下架' : '上架' }}
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        plain
                        @click="confirmDeleteProduct(scope.row.id)"
                      >
                        删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 商品分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :total="totalProducts"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="订单管理" name="orders">
            <div class="management-actions actions-right">
              <div class="filter-options">
                <el-select v-model="orderStatus" placeholder="订单状态" class="filter-select">
                  <el-option label="全部订单" value="all" />
                  <el-option label="待付款" value="unpaid" />
                  <el-option label="待发货" value="paid" />
                  <el-option label="已发货" value="shipped" />
                  <el-option label="已完成" value="completed" />
                  <el-option label="已取消" value="cancelled" />
                  <el-option label="退款中" value="refunding" />
                </el-select>
              </div>
            </div>

            <div class="orders-list">
              <el-table
                :data="sellerOrders"
                style="width: 100%"
                :border="false"
                row-class-name="table-row"
              >
                <el-table-column label="订单号" width="180">
                  <template #default="scope">
                    <span class="order-number">{{ scope.row.orderNumber }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="商品" min-width="300">
                  <template #default="scope">
                    <div class="product-info-cell">
                      <el-image
                        :src="scope.row.productImage"
                        class="product-thumbnail"
                        fit="cover"
                      />
                      <div class="product-details">
                        <div class="product-name">{{ scope.row.productName }}</div>
                        <div class="product-price">¥{{ scope.row.totalAmount }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="买家" width="150">
                  <template #default="scope">
                    <span class="buyer-name">{{ scope.row.buyerName }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="订单状态" width="120">
                  <template #default="scope">
                    <el-tag :type="getOrderStatusType(scope.row.status)" effect="light">
                      {{ getOrderStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="下单时间" width="180">
                  <template #default="scope">
                    <span class="time-text">{{ scope.row.createTime }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="220">
                  <template #default="scope">
                    <div class="action-buttons">
                      <el-button
                        size="small"
                        @click="viewOrderDetail(scope.row.id)"
                        type="info"
                        plain
                        >详情</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 'paid'"
                        size="small"
                        type="success"
                        @click="shipOrder(scope.row.id)"
                      >
                        发货
                      </el-button>
                      <el-button
                        v-if="scope.row.status === 'refunding'"
                        size="small"
                        type="warning"
                        @click="handleRefund(scope.row.id)"
                      >
                        处理退款
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 订单分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="orderPage"
                  v-model:page-size="orderPageSize"
                  :total="totalOrders"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  background
                  @size-change="handleOrderSizeChange"
                  @current-change="handleOrderPageChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <!-- 优化评论管理标签页 -->
          <el-tab-pane label="评论管理" name="reviews">
            <div class="management-actions">
              <div class="filter-options">
                <el-select
                  v-model="reviewFilterProduct"
                  placeholder="商品筛选"
                  class="filter-select"
                  filterable
                >
                  <el-option label="全部商品" value="all" />
                  <el-option
                    v-for="product in myProducts"
                    :key="product.id"
                    :label="product.name"
                    :value="product.id"
                  />
                </el-select>
                <el-select
                  v-model="reviewFilterRating"
                  placeholder="评分筛选"
                  class="filter-select"
                >
                  <el-option label="全部评分" value="all" />
                  <el-option label="好评(4-5星)" value="good" />
                  <el-option label="中评(3星)" value="medium" />
                  <el-option label="差评(1-2星)" value="bad" />
                </el-select>
                <el-input
                  v-model="reviewSearchKeyword"
                  placeholder="搜索评论内容"
                  clearable
                  class="review-search"
                >
                  <template #append>
                    <el-button :icon="Search" @click="handleReviewSearch"></el-button>
                  </template>
                </el-input>
              </div>
            </div>

            <div class="reviews-list">
              <div class="reviews-grid">
                <div v-for="review in sellerReviews" :key="review.id" class="review-card card">
                  <div class="review-header">
                    <div class="product-info">
                      <el-image :src="review.productImage" class="product-thumbnail" fit="cover" />
                      <div class="product-info-text">
                        <div class="product-name">{{ review.productName }}</div>
                        <div class="review-date">{{ review.time }}</div>
                      </div>
                    </div>
                    <div class="review-rating">
                      <el-rate v-model="review.rating" disabled show-score size="small" />
                    </div>
                  </div>

                  <div class="review-body">
                    <div class="buyer-info">
                      <el-avatar :size="30" :src="review.userAvatar">
                        {{ review.userName.substring(0, 1) }}
                      </el-avatar>
                      <span class="buyer-name">{{ review.userName }}</span>
                    </div>

                    <div class="review-content">
                      <p>{{ review.content }}</p>
                      <div v-if="review.images && review.images.length" class="review-images">
                        <el-image
                          v-for="(img, imgIdx) in review.images"
                          :key="imgIdx"
                          :src="img"
                          :preview-src-list="review.images"
                          class="review-image"
                        />
                      </div>
                    </div>

                    <div v-if="review.reply" class="review-reply">
                      <p class="reply-label">卖家回复:</p>
                      <p class="reply-content">{{ review.reply }}</p>
                    </div>
                  </div>

                  <div class="review-actions">
                    <el-button
                      size="small"
                      type="primary"
                      @click="replyReview(review)"
                      :disabled="!!review.reply"
                    >
                      {{ review.reply ? '已回复' : '回复' }}
                    </el-button>
                    <el-button size="small" type="warning" @click="hideReview(review.id)"
                      >隐藏</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      plain
                      @click="confirmDeleteReview(review.id)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </div>

              <!-- 评论分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="reviewPage"
                  v-model:page-size="reviewPageSize"
                  :total="totalReviews"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  background
                  @size-change="handleReviewSizeChange"
                  @current-change="handleReviewPageChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="数据分析" name="analytics">
            <div class="analytics-section">
              <div class="analytics-cards">
                <div class="analytics-card card">
                  <h3>销售趋势</h3>
                  <div class="chart-container">
                    <!-- 这里可以放置销售趋势图表 -->
                    <div class="placeholder-chart">销售趋势图表</div>
                  </div>
                </div>

                <div class="analytics-card card">
                  <h3>流量分析</h3>
                  <div class="chart-container">
                    <!-- 这里可以放置流量分析图表 -->
                    <div class="placeholder-chart">流量分析图表</div>
                  </div>
                </div>
              </div>

              <div class="analytics-card card">
                <h3>热门商品</h3>
                <el-table
                  :data="topProducts"
                  style="width: 100%"
                  :border="false"
                  row-class-name="table-row"
                >
                  <el-table-column label="商品" min-width="300">
                    <template #default="scope">
                      <div class="product-info-cell">
                        <el-image :src="scope.row.imageUrl" class="product-thumbnail" fit="cover" />
                        <div class="product-details">
                          <div class="product-name">{{ scope.row.name }}</div>
                          <div class="product-price">¥{{ scope.row.currentPrice }}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="销量" width="100">
                    <template #default="scope">
                      <span class="stat-number highlight">{{ scope.row.sales }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="收入" width="150">
                    <template #default="scope">
                      <span class="stat-number income">¥{{ scope.row.revenue }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="浏览量" width="100">
                    <template #default="scope">
                      <span class="stat-number">{{ scope.row.views }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="店铺设置" name="settings">
            <div class="settings-section">
              <div class="settings-card card">
                <h3>店铺信息</h3>
                <el-form :model="sellerForm" label-width="100px" class="seller-form">
                  <el-form-item label="店铺名称">
                    <el-input v-model="sellerForm.name" placeholder="请输入店铺名称" />
                  </el-form-item>

                  <el-form-item label="店铺简介">
                    <el-input
                      v-model="sellerForm.description"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入店铺简介"
                    />
                  </el-form-item>

                  <el-form-item label="店铺头像">
                    <el-upload
                      class="avatar-uploader"
                      action="/api/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                    >
                      <img v-if="sellerForm.avatar" :src="sellerForm.avatar" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>

                  <el-form-item label="店铺标签">
                    <el-select
                      v-model="sellerForm.tags"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择或创建店铺标签"
                    >
                      <el-option
                        v-for="tag in availableTags"
                        :key="tag"
                        :label="tag"
                        :value="tag"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="所在地区">
                    <el-cascader
                      v-model="sellerForm.location"
                      :options="locationOptions"
                      placeholder="请选择所在地区"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="saveSellerInfo">保存信息</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <Footer />

    <!-- 评论回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复买家评论"
      width="500px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div v-if="currentReview" class="review-dialog-content">
        <div class="review-info">
          <div class="review-user-info">
            <el-avatar :size="40" :src="currentReview.userAvatar">{{
              currentReview.userName?.substring(0, 1)
            }}</el-avatar>
            <div>
              <div class="user-name">{{ currentReview.userName }}</div>
              <el-rate v-model="currentReview.rating" disabled size="small" />
            </div>
          </div>
          <div class="review-text">{{ currentReview.content }}</div>
        </div>
        <el-form :model="replyForm" label-width="80px">
          <el-form-item label="回复内容">
            <el-input
              v-model="replyForm.content"
              type="textarea"
              :rows="4"
              placeholder="请输入回复内容..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReply" :disabled="!replyForm.content.trim()">
            提交回复
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 商品详情对话框 -->
    <el-dialog
      v-model="productDetailDialogVisible"
      title="商品详情"
      width="700px"
      :close-on-click-modal="false"
      class="custom-dialog product-detail-dialog"
    >
      <div v-if="currentProduct" class="product-detail-content">
        <div class="product-detail-header">
          <el-image :src="currentProduct.imageUrl" class="product-detail-image" fit="cover" />
          <div class="product-detail-info">
            <h3 class="product-name">{{ currentProduct.name }}</h3>
            <div class="price-section">
              <div class="current-price">¥{{ currentProduct.currentPrice }}</div>
              <div class="original-price">原价: ¥{{ currentProduct.originalPrice }}</div>
            </div>
            <div class="product-status">
              <el-tag :type="getStatusTagType(currentProduct.status)" effect="light">
                {{ getStatusText(currentProduct.status) }}
              </el-tag>
            </div>
            <div class="product-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>浏览量: {{ currentProduct.views }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>收藏数: {{ currentProduct.favorites }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Timer /></el-icon>
                <span>发布时间: {{ currentProduct.publishTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="product-detail-section">
          <h4>商品描述</h4>
          <p>{{ currentProduct.description || '暂无商品描述' }}</p>
        </div>

        <div class="product-detail-section">
          <h4>商品参数</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="商品类别">{{
              currentProduct.category || '未分类'
            }}</el-descriptions-item>
            <el-descriptions-item label="品牌">{{
              currentProduct.brand || '未知'
            }}</el-descriptions-item>
            <el-descriptions-item label="新旧程度">{{
              currentProduct.condition || '未知'
            }}</el-descriptions-item>
            <el-descriptions-item label="购买时间">{{
              currentProduct.purchaseTime || '未知'
            }}</el-descriptions-item>
            <el-descriptions-item label="保修情况">{{
              currentProduct.warranty || '无保修'
            }}</el-descriptions-item>
            <el-descriptions-item label="发货地">{{
              currentProduct.location || '未知'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="product-detail-section">
          <h4>交易信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="支持自提">{{
              currentProduct.selfPickup ? '是' : '否'
            }}</el-descriptions-item>
            <el-descriptions-item label="支持验货">{{
              currentProduct.inspection ? '是' : '否'
            }}</el-descriptions-item>
            <el-descriptions-item label="运费">{{
              currentProduct.shippingFee || '卖家承担'
            }}</el-descriptions-item>
            <el-descriptions-item label="支付方式">{{
              currentProduct.paymentMethods || '在线支付'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productDetailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editProduct(currentProduct.id)">编辑商品</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, View, Star, Timer } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TopNav from '@/components/shared/TopNav.vue'
import Footer from '@/components/shared/Footer.vue'
import SellerProfileCard from '@/components/seller/SellerProfileCard.vue'
import SellerStatsCard from '@/components/seller/SellerStatsCard.vue'

const router = useRouter()

// TabBar相关
const activeTab = ref('products')

// 分页相关 - 商品
const currentPage = ref(1)
const pageSize = ref(10)
const totalProducts = ref(0)
const sortBy = ref('newest')
const filterStatus = ref('all')

// 分页相关 - 订单
const orderPage = ref(1)
const orderPageSize = ref(10)
const totalOrders = ref(0)
const orderStatus = ref('all')

// 评论相关数据
const reviewPage = ref(1)
const reviewPageSize = ref(10)
const totalReviews = ref(0)
const reviewFilterProduct = ref('all')
const reviewFilterRating = ref('all')
const reviewSearchKeyword = ref('')
const replyDialogVisible = ref(false)
const currentReview = ref(null)
const replyForm = ref({
  content: '',
})

// 商品详情对话框相关
const productDetailDialogVisible = ref(false)
const currentProduct = ref(null)

// 卖家信息
const sellerInfo = ref({
  id: '1001',
  name: '我的二手店',
  avatar: 'https://via.placeholder.com/100',
  rating: 4.8,
  joinDate: '2023-01-01',
  description: '专注优质二手商品，信誉至上',
  location: '北京市朝阳区',
  tags: ['优质卖家', '快速发货', '正品保证'],
})

// 卖家表单
const sellerForm = ref({
  name: '我的二手店',
  description: '专注优质二手商品，信誉至上',
  avatar: 'https://via.placeholder.com/100',
  tags: ['优质卖家', '快速发货', '正品保证'],
  location: ['北京市', '朝阳区'],
})

// 可选标签
const availableTags = ref([
  '优质卖家',
  '快速发货',
  '正品保证',
  '品质保证',
  '价格实惠',
  '诚信经营',
  '服务周到',
])

// 地区选项
const locationOptions = ref([
  {
    value: '北京市',
    label: '北京市',
    children: [
      { value: '朝阳区', label: '朝阳区' },
      { value: '海淀区', label: '海淀区' },
      { value: '东城区', label: '东城区' },
      { value: '西城区', label: '西城区' },
    ],
  },
  // 其他省市区...
])

// 卖家统计数据
const sellerStats = ref({
  totalSales: 1256,
  productCount: 48,
  reviewCount: 189,
  positiveRate: 98,
  followerCount: 523,
})

// 商品列表
const myProducts = ref([
  {
    id: '1',
    name: 'iPhone 13 Pro Max 256GB 深蓝色',
    currentPrice: '5999.00',
    originalPrice: '9999.00',
    imageUrl: 'https://via.placeholder.com/100',
    status: 'selling',
    publishTime: '2024-03-15 14:30',
    views: 356,
    favorites: 42,
    description: '99新，购买不到半年，无划痕，配件齐全，原装正品，性能完好。',
    category: '手机数码',
    brand: 'Apple',
    condition: '9成新',
    purchaseTime: '2023-10-01',
    warranty: '保修至2024-10-01',
    location: '北京市朝阳区',
    selfPickup: true,
    inspection: true,
    shippingFee: '包邮',
    paymentMethods: '支付宝、微信支付',
  },
  {
    id: '2',
    name: 'MacBook Pro 2021 M1 Pro 16英寸',
    currentPrice: '12999.00',
    originalPrice: '16999.00',
    imageUrl: 'https://via.placeholder.com/100',
    status: 'sold',
    publishTime: '2024-03-10 09:15',
    views: 423,
    favorites: 56,
    description: '8成新，使用一年多，无划痕，性能完好，配件齐全。',
    category: '电脑办公',
    brand: 'Apple',
    condition: '8成新',
    purchaseTime: '2022-01-15',
    warranty: '已过保修期',
    location: '上海市浦东新区',
    selfPickup: true,
    inspection: true,
    shippingFee: '卖家承担',
    paymentMethods: '支付宝、微信支付',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4 无线降噪耳机',
    currentPrice: '1899.00',
    originalPrice: '2399.00',
    imageUrl: 'https://via.placeholder.com/100',
    status: 'offline',
    publishTime: '2024-03-05 16:45',
    views: 256,
    favorites: 28,
    description: '9.5成新，使用不到3个月，音质极佳，降噪效果出色。',
    category: '耳机音响',
    brand: 'Sony',
    condition: '9.5成新',
    purchaseTime: '2023-12-25',
    warranty: '保修至2024-12-25',
    location: '广州市天河区',
    selfPickup: false,
    inspection: true,
    shippingFee: '15元',
    paymentMethods: '支付宝、微信支付',
  },
])

// 订单列表
const sellerOrders = ref([
  {
    id: '1001',
    orderNumber: '202404011234',
    productName: 'iPhone 13 Pro Max 256GB 深蓝色',
    productImage: 'https://via.placeholder.com/100',
    totalAmount: '5999.00',
    buyerName: '张三',
    status: 'paid',
    createTime: '2024-04-01 14:30',
  },
  {
    id: '1002',
    orderNumber: '202403311548',
    productName: 'MacBook Pro 2021 M1 Pro 16英寸',
    productImage: 'https://via.placeholder.com/100',
    totalAmount: '12999.00',
    buyerName: '李四',
    status: 'shipped',
    createTime: '2024-03-31 15:48',
  },
  {
    id: '1003',
    orderNumber: '202403301023',
    productName: 'Sony WH-1000XM4 无线降噪耳机',
    productImage: 'https://via.placeholder.com/100',
    totalAmount: '1899.00',
    buyerName: '王五',
    status: 'refunding',
    createTime: '2024-03-30 10:23',
  },
])

// 热门商品
const topProducts = ref([
  {
    id: '1',
    name: 'iPhone 13 Pro Max 256GB 深蓝色',
    currentPrice: '5999.00',
    imageUrl: 'https://via.placeholder.com/100',
    sales: 12,
    revenue: '71988.00',
    views: 1256,
  },
  {
    id: '2',
    name: 'MacBook Pro 2021 M1 Pro 16英寸',
    currentPrice: '12999.00',
    imageUrl: 'https://via.placeholder.com/100',
    sales: 5,
    revenue: '64995.00',
    views: 958,
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4 无线降噪耳机',
    currentPrice: '1899.00',
    imageUrl: 'https://via.placeholder.com/100',
    sales: 8,
    revenue: '15192.00',
    views: 754,
  },
])

// 评论列表数据
const sellerReviews = ref([
  {
    id: 'r1',
    productId: '1',
    productName: 'iPhone 13 Pro Max 256GB 深蓝色',
    productImage: 'https://via.placeholder.com/100',
    userName: '李小明',
    userAvatar: 'https://via.placeholder.com/40',
    rating: 5,
    content: '手机外观完好，性能正常，发货速度快，很满意的购物体验！',
    time: '2024-04-01 12:30',
    reply: '感谢您的支持，欢迎下次再来选购！',
    images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
  },
  {
    id: 'r2',
    productId: '2',
    productName: 'MacBook Pro 2021 M1 Pro 16英寸',
    productImage: 'https://via.placeholder.com/100',
    userName: '王大力',
    userAvatar: 'https://via.placeholder.com/40',
    rating: 4,
    content: '电脑性能良好，但运输过程中包装有轻微损伤，好在产品本身没问题。',
    time: '2024-03-28 15:45',
    reply: '',
    images: [],
  },
  {
    id: 'r3',
    productId: '3',
    productName: 'Sony WH-1000XM4 无线降噪耳机',
    productImage: 'https://via.placeholder.com/100',
    userName: '张小琳',
    userAvatar: 'https://via.placeholder.com/40',
    rating: 3,
    content: '音质还行，但降噪效果不如预期，可能是二手的原因吧。',
    time: '2024-03-25 09:20',
    reply: '',
    images: [],
  },
])

// 获取卖家信息
const fetchSellerInfo = async () => {
  try {
    // TODO: 调用API获取卖家信息
    console.log('获取卖家信息')
    // 更新sellerForm
    sellerForm.value.name = sellerInfo.value.name
    sellerForm.value.description = sellerInfo.value.description
    sellerForm.value.avatar = sellerInfo.value.avatar
    sellerForm.value.tags = sellerInfo.value.tags
  } catch (error) {
    console.error('获取卖家信息失败:', error)
  }
}

// 获取卖家统计数据
const fetchSellerStats = async () => {
  try {
    // TODO: 调用API获取卖家统计数据
    console.log('获取卖家统计数据')
  } catch (error) {
    console.error('获取卖家统计数据失败:', error)
  }
}

// 获取卖家商品列表
const fetchSellerProducts = async () => {
  try {
    // TODO: 调用API获取卖家商品列表
    console.log('获取卖家商品列表', {
      page: currentPage.value,
      size: pageSize.value,
      sort: sortBy.value,
      status: filterStatus.value,
    })
    totalProducts.value = 48 // 假设总共有48个商品
  } catch (error) {
    console.error('获取卖家商品列表失败:', error)
  }
}

// 获取卖家订单列表
const fetchSellerOrders = async () => {
  try {
    // TODO: 调用API获取卖家订单列表
    console.log('获取卖家订单列表', {
      page: orderPage.value,
      size: orderPageSize.value,
      status: orderStatus.value,
    })
    totalOrders.value = 35 // 假设总共有35个订单
  } catch (error) {
    console.error('获取卖家订单列表失败:', error)
  }
}

// 获取评论列表
const fetchSellerReviews = async () => {
  try {
    // TODO: 调用API获取卖家评论列表
    console.log('获取卖家评论列表', {
      page: reviewPage.value,
      size: reviewPageSize.value,
      product: reviewFilterProduct.value,
      rating: reviewFilterRating.value,
      keyword: reviewSearchKeyword.value,
    })
    totalReviews.value = 36 // 示例数据：总共36条评论
  } catch (error) {
    console.error('获取卖家评论列表失败:', error)
    ElMessage.error('获取评论失败，请重试')
  }
}

// 处理头像上传成功
const handleAvatarSuccess = (response) => {
  sellerForm.value.avatar = response.url
}

// 保存卖家信息
const saveSellerInfo = async () => {
  try {
    // TODO: 调用API保存卖家信息
    console.log('保存卖家信息', sellerForm.value)
    ElMessage.success('店铺信息保存成功')
  } catch (error) {
    console.error('保存卖家信息失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 获取商品状态标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case 'selling':
      return 'success'
    case 'sold':
      return 'info'
    case 'offline':
      return 'danger'
    default:
      return ''
  }
}

// 获取商品状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'selling':
      return '在售中'
    case 'sold':
      return '已售出'
    case 'offline':
      return '已下架'
    default:
      return '未知'
  }
}

// 获取订单状态标签类型
const getOrderStatusType = (status) => {
  switch (status) {
    case 'unpaid':
      return 'warning'
    case 'paid':
      return 'primary'
    case 'shipped':
      return 'success'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'info'
    case 'refunding':
      return 'danger'
    default:
      return ''
  }
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  switch (status) {
    case 'unpaid':
      return '待付款'
    case 'paid':
      return '待发货'
    case 'shipped':
      return '已发货'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    case 'refunding':
      return '退款中'
    default:
      return '未知'
  }
}

// 处理商品分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchSellerProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchSellerProducts()
}

// 处理订单分页
const handleOrderSizeChange = (val) => {
  orderPageSize.value = val
  fetchSellerOrders()
}

const handleOrderPageChange = (val) => {
  orderPage.value = val
  fetchSellerOrders()
}

// 处理评论分页
const handleReviewSizeChange = (val) => {
  reviewPageSize.value = val
  fetchSellerReviews()
}

const handleReviewPageChange = (val) => {
  reviewPage.value = val
  fetchSellerReviews()
}

// 评论搜索
const handleReviewSearch = () => {
  reviewPage.value = 1
  fetchSellerReviews()
}

// 跳转到发布页面
const navigateToPublish = () => {
  router.push('/publish')
}

// 编辑商品
const editProduct = (productId) => {
  router.push(`/publish?edit=${productId}`)
}

// 切换商品状态（上架/下架）
const toggleProductStatus = async (product) => {
  try {
    const action = product.status === 'selling' ? '下架' : '上架'
    const newStatus = product.status === 'selling' ? 'offline' : 'selling'

    // TODO: 调用API更改商品状态
    console.log(`${action}商品`, product.id)

    // 更新本地状态
    product.status = newStatus
    ElMessage.success(`商品已${action}`)
  } catch (error) {
    console.error('更改商品状态失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 确认删除商品
const confirmDeleteProduct = (productId) => {
  ElMessageBox.confirm('确定要删除这个商品吗？此操作不可撤销', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteProduct(productId)
    })
    .catch(() => {
      // 取消删除
    })
}

// 删除商品
const deleteProduct = async (productId) => {
  try {
    // TODO: 调用API删除商品
    console.log('删除商品', productId)

    // 从列表中移除
    myProducts.value = myProducts.value.filter((item) => item.id !== productId)
    ElMessage.success('商品已删除')
  } catch (error) {
    console.error('删除商品失败:', error)
    ElMessage.error('删除失败，请重试')
  }
}

// 查看订单详情
const viewOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}

// 发货
const shipOrder = async (orderId) => {
  try {
    // TODO: 调用API处理发货
    console.log('处理发货', orderId)

    // 更新本地状态
    const order = sellerOrders.value.find((item) => item.id === orderId)
    if (order) {
      order.status = 'shipped'
    }
    ElMessage.success('发货成功')
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 处理退款
const handleRefund = (orderId) => {
  router.push(`/refund/${orderId}`)
}

// 回复评论
const replyReview = (review) => {
  currentReview.value = review
  replyForm.value.content = review.reply || ''
  replyDialogVisible.value = true
}

// 提交回复
const submitReply = async () => {
  if (!currentReview.value) return

  try {
    // TODO: 调用API提交回复
    console.log('提交评论回复', {
      reviewId: currentReview.value.id,
      content: replyForm.value.content,
    })

    // 更新本地数据
    const review = sellerReviews.value.find((r) => r.id === currentReview.value.id)
    if (review) {
      review.reply = replyForm.value.content
    }

    replyDialogVisible.value = false
    ElMessage.success('回复成功')
  } catch (error) {
    console.error('提交回复失败:', error)
    ElMessage.error('回复失败，请重试')
  }
}

// 隐藏评论
const hideReview = async (reviewId) => {
  try {
    // TODO: 调用API隐藏评论
    console.log('隐藏评论', reviewId)
    ElMessage.success('评论已隐藏')
  } catch (error) {
    console.error('隐藏评论失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 确认删除评论
const confirmDeleteReview = (reviewId) => {
  ElMessageBox.confirm('确定要删除这条评论吗？此操作不可撤销', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteReview(reviewId)
    })
    .catch(() => {})
}

// 删除评论
const deleteReview = async (reviewId) => {
  try {
    // TODO: 调用API删除评论
    console.log('删除评论', reviewId)

    // 更新本地数据
    sellerReviews.value = sellerReviews.value.filter((r) => r.id !== reviewId)
    ElMessage.success('评论已删除')
  } catch (error) {
    console.error('删除评论失败:', error)
    ElMessage.error('删除失败，请重试')
  }
}

// 查看商品详情
const viewProductDetail = (productId) => {
  const product = myProducts.value.find((item) => item.id === productId)
  if (product) {
    currentProduct.value = product
    productDetailDialogVisible.value = true
  }
}

onMounted(() => {
  fetchSellerInfo()
  fetchSellerStats()
  fetchSellerProducts()
  fetchSellerOrders()
  fetchSellerReviews()
})
</script>

<style scoped>
.seller-management-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.main-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  padding-left: 5px;
  border-left: 4px solid #ff6f00;
}

/* 改进卡片样式 */
.card {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.stats-container {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

@media (max-width: 992px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}

.profile-card,
.stats-card {
  margin-bottom: 0;
}

.tab-section {
  padding: 0;
  overflow: hidden;
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
  height: 55px;
  line-height: 55px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.seller-tabs :deep(.el-tabs__item.is-active) {
  color: #ff6f00;
  font-weight: 600;
}

.seller-tabs :deep(.el-tabs__active-bar) {
  background-color: #ff6f00;
  height: 3px;
  border-radius: 3px;
}

.management-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.management-actions.actions-right {
  justify-content: flex-end;
}

.filter-options {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-select {
  min-width: 150px;
}

.products-list,
.orders-list,
.analytics-section,
.settings-section,
.reviews-list {
  padding: 20px;
}

/* 表格行样式 */
.table-row {
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f9f9f9;
}

.product-info-cell {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-thumbnail {
  width: 65px;
  height: 65px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-name {
  font-weight: 500;
  color: #333;
  font-size: 15px;
}

.product-price {
  color: #ff6f00;
  font-weight: 600;
  font-size: 16px;
}

/* 美化统计数字 */
.stat-number {
  font-weight: 500;
  color: #333;
  font-size: 15px;
}

.stat-number.highlight {
  color: #ff6f00;
  font-weight: 600;
}

.stat-number.income {
  color: #67c23a;
  font-weight: 600;
}

.time-text {
  color: #888;
  font-size: 14px;
}

.order-number {
  font-family: monospace;
  color: #555;
  font-weight: 500;
}

.buyer-name {
  font-weight: 500;
  color: #444;
}

/* 美化按钮区域 */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-button {
  font-weight: 500;
}

/* 图表区域 */
.analytics-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 992px) {
  .analytics-cards {
    grid-template-columns: 1fr;
  }
}

.analytics-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.chart-container {
  margin-bottom: 10px;
  height: 300px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #eee;
  transition: all 0.2s ease;
}

.chart-container:hover {
  background-color: #f5f5f5;
}

.placeholder-chart {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  font-size: 16px;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
}

.avatar-uploader :deep(.el-upload) {
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 100px;
  height: 100px;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #ff6f00;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 改进评论管理 UI */
.reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 992px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }
}

.review-card {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background-color: #f9f9f9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom: 1px solid #eee;
}

.review-body {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-actions {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-info-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.review-content {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}

.review-content p {
  margin: 0 0 10px 0;
  color: #333;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.review-image {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #eee;
}

.review-image:hover {
  transform: scale(1.05);
}

.review-reply {
  margin-top: 8px;
  background-color: #fff8f2;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #ff6f00;
}

.reply-label {
  font-weight: 500;
  color: #666;
  margin-bottom: 5px;
}

.reply-content {
  color: #333;
}

.review-search {
  width: 280px;
}

.buyer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 店铺设置样式 */
.settings-card {
  max-width: 800px;
  margin: 0 auto;
}

.settings-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

.seller-form :deep(.el-input__inner) {
  border-radius: 8px;
}

.seller-form :deep(.el-textarea__inner) {
  border-radius: 8px;
}

/* 对话框样式 */
.custom-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.review-dialog-content {
  margin-bottom: 20px;
}

.review-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.user-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.review-text {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #333;
  font-size: 14px;
}

.review-date {
  font-size: 12px;
  color: #999;
}

/* 商品详情对话框样式 */
.product-detail-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.product-detail-content {
  color: #333;
}

.product-detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.product-detail-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-detail-info .product-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.current-price {
  font-size: 24px;
  font-weight: 600;
  color: #ff6f00;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.product-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 14px;
}

.product-detail-section {
  margin-bottom: 20px;
}

.product-detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.product-detail-section p {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

/* 移动端响应式设计 */
@media screen and (max-width: 768px) {
  .main-content {
    padding: 15px;
  }

  .management-actions {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .filter-options {
    flex-wrap: wrap;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .analytics-cards {
    grid-template-columns: 1fr;
  }

  /* 商品详情对话框移动端适配 */
  .product-detail-header {
    flex-direction: column;
  }

  .product-detail-image {
    width: 100%;
    height: auto;
  }

  .product-stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
