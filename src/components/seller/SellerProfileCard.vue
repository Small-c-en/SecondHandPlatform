<template>
  <div class="seller-profile-card">
    <div class="profile-header">
      <div class="avatar-section">
        <el-avatar :size="80" :src="seller.avatar" />
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
      <div class="action-buttons">
        <el-button type="primary" class="orange-button" @click="handleFollow">
          <el-icon><Plus /></el-icon>
          关注
        </el-button>
        <el-button class="orange-outline-button" @click="handleMessage">
          <el-icon><ChatDotRound /></el-icon>
          发消息
        </el-button>
      </div>
    </div>

    <div class="profile-info">
      <div class="info-item">
        <el-icon><Location /></el-icon>
        <span>{{ seller.location }}</span>
      </div>
      <div class="info-item">
        <el-icon><Calendar /></el-icon>
        <span>加入时间：{{ seller.joinDate }}</span>
      </div>
    </div>

    <div class="profile-description">
      <h3>店铺简介</h3>
      <p>{{ seller.description }}</p>
    </div>

    <div class="profile-tags">
      <el-tag v-for="tag in seller.tags" :key="tag" class="tag-item" type="success" effect="light">
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { Plus, ChatDotRound, Location, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  seller: {
    type: Object,
    required: true,
  },
})

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
.seller-profile-card {
  padding: 24px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.seller-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.profile-info {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.profile-description {
  margin-bottom: 20px;
}

.profile-description h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 12px;
}

.profile-description p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  border-radius: 4px;
}

@media screen and (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  .profile-info {
    flex-direction: column;
    gap: 12px;
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
