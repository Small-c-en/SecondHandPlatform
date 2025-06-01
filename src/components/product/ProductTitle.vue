<template>
  <div class="product-title-container">
    <h1 class="product-title">{{ title }}</h1>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
    default: '商品标题占位符，这是一个非常非常非常非常非常长的商品标题用于测试截断效果',
  },
})
</script>

<style scoped>
.product-title-container {
  padding: 0 20px; /* 左右留白，与页面整体风格一致 */
  margin-bottom: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  color: #333; /* 黑色字体 */
  line-height: 1.4;
  /* 最多显示两行，超出部分以省略号截断 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.4em * 2); /* 约等于两行的高度，确保兼容性 */
}
</style>
