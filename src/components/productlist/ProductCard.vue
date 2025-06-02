<template>
  <div class="product-card" @click="viewDetails">
    <div class="product-image-wrapper">
      <img
        :src="product.imageUrl || 'https://via.placeholder.com/300x400?text=商品图片'"
        :alt="product.name"
        class="product-image"
        loading="lazy"
      />
      <span v-if="product.conditionTag" class="condition-tag">{{ product.conditionTag }}</span>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-price-container">
        <span class="current-price">¥{{ product.currentPrice }}</span>
        <span v-if="product.originalPrice" class="original-price"
          >¥{{ product.originalPrice }}</span
        >
      </div>
      <div class="seller-rating">
        <span
          v-for="i in 5"
          :key="i"
          :class="['star', { filled: i <= Math.floor(product.sellerRating || 0) }]"
          >★</span
        >
        <span class="rating-text">({{ product.sellerRating || 'N/A' }})</span>
      </div>
    </div>
    <button class="details-button">查看详情</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: 'unknown',
      imageUrl: '',
      name: '商品加载中...',
      currentPrice: '0.00',
      originalPrice: null,
      conditionTag: '全新',
      sellerRating: 0,
    }),
  },
})

const emit = defineEmits(['view-details'])

const viewDetails = () => {
  emit('view-details', props.product.id)
}
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 133.33%;
  overflow: hidden;
  background-color: #f8f8f8;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.condition-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #ff5722;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
  opacity: 0.95;
  transition: all 0.2s ease;
}

.product-card:hover .condition-tag {
  opacity: 1;
  transform: translateY(-2px);
}

.product-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.2s ease;
}

.product-card:hover .product-name {
  color: #ff5722;
}

.product-price-container {
  margin: 4px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff5722;
  transition: transform 0.2s ease;
}

.product-card:hover .current-price {
  transform: scale(1.05);
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.seller-rating {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  margin: 4px 0;
}

.seller-rating .star {
  color: #ddd;
  font-size: 15px;
  margin-right: 2px;
  transition: transform 0.2s ease;
}

.seller-rating .star.filled {
  color: #ffb300;
}

.product-card:hover .star.filled {
  transform: scale(1.1);
}

.seller-rating .rating-text {
  margin-left: 6px;
  font-weight: 500;
}

.details-button {
  background-color: #f8f8f8;
  color: #666;
  border: none;
  padding: 12px 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.details-button::after {
  content: '→';
  font-size: 18px;
  line-height: 1;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.product-card:hover .details-button {
  background-color: #ff5722;
  color: white;
}

.product-card:hover .details-button::after {
  opacity: 1;
  transform: translateX(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
