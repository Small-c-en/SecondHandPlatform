<template>
  <div class="order-detail-product-item detail-card">
    <div class="product-image-container">
      <img
        :src="product.thumbnail || 'https://via.placeholder.com/100x100?text=商品图'"
        alt="商品缩略图"
        class="product-thumbnail"
      />
    </div>
    <div class="product-info-container">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-specs">{{ product.specs }}</p>
      <div class="product-meta">
        <span class="product-quantity">数量：x{{ product.quantity }}</span>
        <span class="product-condition-tag">{{ product.condition }}</span>
      </div>
      <router-link
        v-if="product.originalProductUrl"
        :to="product.originalProductUrl"
        class="view-product-link"
      >
        查看商品详情 &rarr;
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      thumbnail: '',
      name: '商品名称加载中...',
      specs: '规格参数加载中...',
      quantity: 1,
      condition: '未知',
      originalProductUrl: null,
    }),
  },
})
</script>

<style scoped>
.order-detail-product-item {
  /* Uses .detail-card from parent for background, padding, shadow, border-radius */
  display: flex;
  gap: 20px;
  align-items: flex-start; /* Align items to the top */
}

.product-image-container {
  flex-shrink: 0;
}

.product-thumbnail {
  width: 100px; /* As per description 1:1, let's assume 100px or 120px like mock data */
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #f0f0f0; /* Placeholder bg */
  border: 1px solid #eee;
}

.product-info-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 16px;
  font-weight: 600; /* Black, bold */
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;

  /* Multiline truncation */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.4em * 2); /* Fallback for max-height based on line-height and clamp */
}

.product-specs {
  font-size: 13px;
  color: #6c757d; /* Grey text */
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.product-quantity {
  font-size: 13px;
  color: #555;
}

.product-condition-tag {
  background-color: #e9ecef; /* Light grey tag */
  color: #495057;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.view-product-link {
  font-size: 14px;
  color: #007bff; /* Blue link text */
  text-decoration: none;
  align-self: flex-start; /* Align to the left of its container */
  transition: color 0.2s;
}

.view-product-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>
