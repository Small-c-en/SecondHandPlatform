<template>
  <div class="product-card" @click="viewDetails">
    <div class="product-image-wrapper">
      <img
        :src="product.imageUrl || 'https://via.placeholder.com/300x400?text=商品图片'"
        :alt="product.name"
        class="product-image"
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
        <!-- Placeholder for star rating component -->
        <span
          v-for="i in 5"
          :key="i"
          :class="['star', { filled: i <= (product.sellerRating || 0) }]"
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
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
  cursor: pointer; /* Make the whole card clickable */
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 133.33%; /* 3:4 aspect ratio (400/300 * 100) */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the area, might crop */
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.condition-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff6f00; /* Orange background */
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 10px; /* Circular */
  z-index: 1;
}

.product-info {
  padding: 12px;
  flex-grow: 1; /* Allows this section to take up remaining space */
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  height: 2.8em; /* 1.4 * 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price-container {
  margin-bottom: 8px;
  display: flex;
  align-items: baseline; /* Align prices properly */
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6f00; /* Orange color for current price */
}

.original-price {
  font-size: 13px;
  color: #888;
  text-decoration: line-through;
}

.seller-rating {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Pushes button down slightly */
}

.seller-rating .star {
  color: #ccc; /* Empty star color */
  font-size: 14px;
  margin-right: 1px;
}

.seller-rating .star.filled {
  color: #ffc107; /* Gold star */
}

.seller-rating .rating-text {
  margin-left: 4px;
}

.details-button {
  background-color: #f0f0f0; /* Light grey button */
  color: #333;
  border: none;
  padding: 10px 0; /* Full width padding */
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: auto; /* Pushes button to the bottom of the flex container */
}

.details-button:hover {
  background-color: #e0e0e0; /* Darker grey on hover */
}
</style>
