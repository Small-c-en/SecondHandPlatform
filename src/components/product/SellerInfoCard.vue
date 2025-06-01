<template>
  <div class="seller-info-card">
    <div class="seller-basic-info">
      <img
        :src="seller.avatarUrl || 'https://via.placeholder.com/60?text=头像'"
        alt="卖家头像"
        class="seller-avatar"
      />
      <div class="seller-name-id">
        <span class="seller-nickname">{{ seller.nickname || '卖家昵称' }}</span>
        <span v-if="seller.isVerified" class="verified-badge">实名认证</span>
      </div>
    </div>
    <div class="seller-credit-section">
      <div class="credit-score">
        <span class="score-label">信用评分：</span>
        <!-- 占位：星级评分 -->
        <span class="stars">★★★★☆</span>
        <span class="rating-count">({{ seller.ratingCount || 0 }}人评分)</span>
      </div>
      <button class="contact-seller-button">联系卖家</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

// 模拟卖家数据
const seller = ref({
  avatarUrl: '', // 留空则使用占位图
  nickname: '诚信卖家小明',
  isVerified: true,
  ratingCount: 125,
  // 实际星级评分逻辑会更复杂
})

// 如果需要从父组件传入卖家数据，可以取消以下注释
// defineProps({
//   seller: {
//     type: Object,
//     required: true,
//     default: () => ({})
//   }
// });
</script>

<style scoped>
.seller-info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa; /* 浅灰背景 */
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}

.seller-basic-info {
  display: flex;
  align-items: center;
}

.seller-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
  border: 2px solid #ddd;
}

.seller-name-id {
  display: flex;
  flex-direction: column;
}

.seller-nickname {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.verified-badge {
  font-size: 12px;
  color: #ff6f00; /* 橙色 */
  background-color: #fff0e0;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ffcc80;
  align-self: flex-start;
}

.seller-credit-section {
  display: flex;
  align-items: center;
}

.credit-score {
  text-align: right;
  margin-right: 20px;
  color: #555;
}

.score-label {
  font-size: 14px;
}

.stars {
  font-size: 18px;
  color: #ffb300; /* 星星颜色 */
  margin: 0 5px;
}

.rating-count {
  font-size: 13px;
  color: #777;
}

.contact-seller-button {
  background-color: #6c757d; /* 灰色背景 */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.contact-seller-button:hover {
  background-color: #5a6268;
}
</style>
