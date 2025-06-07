<template>
  <div class="order-detail-multi-products detail-card">
    <!-- 商品总览信息 -->
    <div class="products-summary" @click="toggleExpand" v-if="!isExpanded">
      <div class="summary-left">
        <div class="thumbnail-stack">
          <img
            v-for="(product, index) in products.slice(0, 3)"
            :key="product.id"
            :src="product.thumbnail"
            :style="{ zIndex: 3 - index, marginLeft: index * -15 + 'px' }"
            class="stacked-thumbnail"
            :alt="product.name"
          />
        </div>
        <span class="products-count">共 {{ products.length }} 件商品</span>
      </div>
      <div class="summary-right">
        <span class="total-amount">总计：¥{{ totalAmount }}</span>
        <i class="el-icon-arrow-right expand-icon"></i>
      </div>
    </div>

    <!-- 展开的商品列表 -->
    <div class="products-list" v-if="isExpanded">
      <div class="list-header">
        <span>共 {{ products.length }} 件商品</span>
        <el-button type="text" @click="toggleExpand">
          <i class="el-icon-arrow-up"></i> 收起
        </el-button>
      </div>
      <div class="products-container">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="product-item"
          :class="{ 'with-divider': index < products.length - 1 }"
        >
          <div class="product-image-container">
            <img :src="product.thumbnail" :alt="product.name" class="product-thumbnail" />
          </div>
          <div class="product-info-container">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-specs">{{ product.specs }}</p>
            <div class="product-meta">
              <span class="product-condition-tag">{{ product.condition }}</span>
              <span class="product-quantity">x{{ product.quantity }}</span>
              <span class="product-price">¥{{ product.price }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="list-footer">
        <span class="total-amount">总计：¥{{ totalAmount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const isExpanded = ref(false)

const totalAmount = computed(() => {
  return props.products
    .reduce((sum, product) => {
      return sum + product.price * product.quantity
    }, 0)
    .toFixed(2)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.order-detail-multi-products {
  transition: all 0.3s ease;
}

.products-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumbnail-stack {
  display: flex;
  align-items: center;
  position: relative;
  height: 60px;
}

.stacked-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.products-summary:hover .stacked-thumbnail {
  transform: translateY(-2px);
}

.products-count {
  font-size: 14px;
  color: #666;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
  color: #ff5722;
}

.expand-icon {
  color: #999;
  transition: transform 0.3s ease;
}

.products-summary:hover .expand-icon {
  transform: translateX(4px);
}

.products-list {
  padding: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.products-container {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
}

.with-divider {
  border-bottom: 1px solid #f0f0f0;
}

.product-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
}

.product-info-container {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-specs {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-condition-tag {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.product-quantity {
  font-size: 12px;
  color: #666;
}

.product-price {
  font-size: 14px;
  font-weight: 500;
  color: #ff5722;
}

.list-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

/* 自定义滚动条样式 */
.products-container::-webkit-scrollbar {
  width: 6px;
}

.products-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.products-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.products-container::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>
