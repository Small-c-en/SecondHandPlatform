<template>
  <div class="product-description-card scrollable-content">
    <h3 class="section-title">商品介绍</h3>
    <div class="description-content">
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  description: {
    type: String,
    required: true,
    default: '暂无商品介绍。',
  },
})
</script>

<style scoped>
.product-description-card {
  /* scrollable-content 类将从 ProductDetailView 继承，提供滚动和固定高度 */
  /* 这里可以定义卡片内部的特定样式 */
  padding: 15px;
  background-color: #fdfdfd;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 0;
  margin-bottom: 12px;
}

.description-content p {
  margin: 0;
  white-space: pre-wrap; /* 保留文本中的换行和空格 */
  font-size: 14px;
  line-height: 1.7;
  color: #555;
}

/* 继承的 .scrollable-content 样式将负责高度和滚动条 */
</style>
