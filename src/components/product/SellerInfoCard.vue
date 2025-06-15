<template>
  <div class="seller-info-card" @click="navigateToSeller">
    <div class="seller-header">
      <div class="seller-avatar">
        <el-avatar :size="60" :src="seller.avatar" />
      </div>
      <div class="seller-info">
        <div class="seller-name">{{ seller.name }}</div>
        <div class="seller-rating">
          <el-rate
            v-model="seller.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          />
        </div>
      </div>
      <div class="seller-actions">
        <el-button type="primary" size="small" class="orange-button" @click.stop="handleFollow">
          <el-icon><Plus /></el-icon>
          关注
        </el-button>
        <el-button size="small" class="orange-outline-button" @click.stop="handleMessage">
          <el-icon><ChatDotRound /></el-icon>
          发消息
        </el-button>
      </div>
    </div>

    <div class="seller-stats">
      <div class="stat-item">
        <div class="stat-value">{{ seller.totalSales || 0 }}</div>
        <div class="stat-label">总销量</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ seller.productCount || 0 }}</div>
        <div class="stat-label">在售商品</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ seller.reviewCount || 0 }}</div>
        <div class="stat-label">评价数</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, ChatDotRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  seller: {
    type: Object,
    required: true,
  },
})

const navigateToSeller = () => {
  router.push(`/seller/${props.seller.id}`)
}

const handleFollow = () => {
  // TODO: 实现关注功能
  console.log('关注卖家:', props.seller.id)
}

const handleMessage = () => {
  // TODO: 实现发送消息功能
  router.push(`/chat/${props.seller.id}`)
}
</script>

<style scoped>
.seller-info-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.seller-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.seller-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.seller-info {
  flex: 1;
}

.seller-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seller-actions {
  display: flex;
  gap: 8px;
}

.seller-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #ff6f00;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

@media screen and (max-width: 768px) {
  .seller-header {
    flex-direction: column;
    text-align: center;
  }

  .seller-actions {
    width: 100%;
    justify-content: center;
  }
}

.orange-button {
  background-color: #ff6f00 !important;
  border-color: #ff6f00 !important;
}

.orange-button:hover {
  background-color: #f26100 !important;
  border-color: #f26100 !important;
}

.orange-outline-button {
  color: #ff6f00 !important;
  border-color: #ff6f00 !important;
}

.orange-outline-button:hover {
  color: #fff !important;
  background-color: #ff6f00 !important;
  border-color: #ff6f00 !important;
}
</style>
