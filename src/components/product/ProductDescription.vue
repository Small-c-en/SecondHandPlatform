<template>
  <div class="product-description">
    <div class="section-title">
      <h3>商品介绍</h3>
    </div>
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
.product-description {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
}

.section-title {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.section-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.description-content {
  padding: 16px 20px;
  height: 200px;
  overflow-y: auto;
}

.description-content p {
  margin: 0;
  line-height: 1.6;
  color: #666;
  font-size: 14px;
  white-space: pre-wrap;
}

/* 自定义滚动条样式 */
.description-content::-webkit-scrollbar {
  width: 6px;
}

.description-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.description-content::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.description-content::-webkit-scrollbar-thumb:hover {
  background-color: #ccc;
}
</style>
