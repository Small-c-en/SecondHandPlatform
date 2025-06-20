<template>
  <div class="product-reviews-section">
    <div class="reviews-header">
      <h3 class="section-title">历史交易评价 ({{ totalReviews }})</h3>
      <div class="review-summary">
        <span class="good-rating-tag">好评率: {{ goodReviewRate }}%</span>
        <!-- 可以添加更多筛选标签 -->
      </div>
    </div>

    <div class="review-list">
      <!-- 单个评价卡片 -->
      <div class="review-card" v-for="review in reviews" :key="review.id">
        <div class="review-card-header">
          <img
            :src="review.userAvatar || 'https://via.placeholder.com/40?text=买家'"
            alt="买家头像"
            class="reviewer-avatar"
          />
          <div class="reviewer-info">
            <span class="reviewer-nickname">{{ review.nickname || '匿名用户' }}</span>
            <span class="review-time">{{ review.time || '2023-10-27' }}</span>
          </div>
          <div class="review-stars">
            <!-- 占位：星级 -->
            <span class="stars">{{ getStars(review.rating) }}</span>
          </div>
        </div>
        <p class="review-content">
          {{ review.content || '商品非常好，物超所值！卖家发货也很快。' }}
        </p>
        <div class="review-images" v-if="review.images && review.images.length > 0">
          <el-image
            v-for="(image, index) in review.images"
            :key="index"
            :src="image.thumbnailUrl || 'https://via.placeholder.com/80x80?text=评价图'"
            :preview-src-list="review.images.map((img) => img.thumbnailUrl)"
            :initial-index="index"
            fit="cover"
            class="review-image-thumbnail"
            preview-teleported
          />
        </div>
      </div>

      <!-- 更多评价卡片... -->
      <div class="review-card">
        <div class="review-card-header">
          <img
            src="https://via.placeholder.com/40?text=买家"
            alt="买家头像"
            class="reviewer-avatar"
          />
          <div class="reviewer-info">
            <span class="reviewer-nickname">用户B</span>
            <span class="review-time">2023-10-26</span>
          </div>
          <div class="review-stars">
            <span class="stars">★★★★☆</span>
          </div>
        </div>
        <p class="review-content">习惯好评，东西还行吧，有点小瑕疵，但不影响使用。</p>
      </div>
    </div>

    <div class="pagination">
      <el-button
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="custom-page-button prev-button"
      >
        上一页
      </el-button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <el-button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="custom-page-button next-button"
      >
        下一页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElImage, ElButton } from 'element-plus'

// 模拟评价数据
const totalReviews = ref(108)
const goodReviewRate = ref(98.5)
const currentPage = ref(1)
const reviewsPerPage = ref(5)

const reviews = ref([
  {
    id: 1,
    userAvatar: '',
    nickname: '热心买家A',
    time: '2023-10-28 14:30',
    rating: 5,
    content: '非常棒的商品，成色很新，卖家描述一致，沟通也很顺畅，推荐购买！物流速度也很快。',
    images: [
      { thumbnailUrl: 'https://via.placeholder.com/80x80?text=图1' },
      { thumbnailUrl: 'https://via.placeholder.com/80x80?text=图2' },
    ],
  },
  {
    id: 2,
    userAvatar: 'https://via.placeholder.com/40?text=李四',
    nickname: '李四爱购物',
    time: '2023-10-27 10:15',
    rating: 4,
    content: '整体不错，性价比高。就是包装有点简陋，希望改进。客服回复及时。',
    images: [],
  },
  // 更多评价数据...
])

const totalPages = computed(() => Math.ceil(totalReviews.value / reviewsPerPage.value))

const getStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<style scoped>
.product-reviews-section {
  padding: 20px;
  background-color: #fff; /* 白色背景 */
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee; /* 分割线 */
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.review-summary .good-rating-tag {
  background-color: #fff0e0;
  color: #ff6f00;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #ffcc80;
}

.review-list {
  margin-bottom: 20px;
}

.review-card {
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.review-card:last-child {
  margin-bottom: 0;
}

.review-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.reviewer-info {
  flex-grow: 1;
}

.reviewer-nickname {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.review-time {
  font-size: 12px;
  color: #888;
}

.review-stars .stars {
  font-size: 16px;
  color: #ffb300; /* 星星颜色 */
}

.review-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 10px;
  white-space: pre-wrap; /* 保留换行 */
}

.review-images {
  display: flex;
  gap: 10px; /* 图片间距 */
  flex-wrap: wrap;
}

.review-image-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.review-image-thumbnail:hover {
  border-color: #ff6f00;
  transform: scale(1.05);
}

.pagination {
  text-align: center;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.custom-page-button {
  background-color: transparent;
  border: 1px solid #ff6f00;
  color: #ff6f00;
  font-size: 14px;
  transition: all 0.3s ease;
}

.custom-page-button:hover:not(:disabled) {
  background-color: #ff6f00;
  color: white;
}

.custom-page-button:disabled {
  border-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  min-width: 60px;
  text-align: center;
}

:deep(.el-image-viewer__wrapper) {
  --el-image-viewer-mask-color: rgba(0, 0, 0, 0.8);
}

:deep(.el-image-viewer__close) {
  color: #fff;
}

:deep(.el-image-viewer__actions__inner) {
  color: #fff;
}
</style>
