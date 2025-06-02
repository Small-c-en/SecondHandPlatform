<template>
  <div class="product-details">
    <div class="section-title">
      <h3>商品参数</h3>
    </div>
    <div class="details-content">
      <div class="detail-item">
        <span class="label">商品品牌</span>
        <span class="value">{{ product.brand }}</span>
      </div>
      <div class="detail-item">
        <span class="label">商品型号</span>
        <span class="value">{{ product.model }}</span>
      </div>
      <div class="detail-item">
        <span class="label">商品规格</span>
        <span class="value">{{ product.specs }}</span>
      </div>
      <div class="detail-item">
        <span class="label">购买日期</span>
        <span class="value">{{ product.purchaseDate }}</span>
      </div>
      <div class="detail-item">
        <span class="label">保修情况</span>
        <span class="value">{{ product.warranty }}</span>
      </div>
      <div class="detail-item">
        <span class="label">商品成色</span>
        <span class="value">{{ product.condition }}</span>
      </div>
      <div class="detail-item">
        <span class="label">所在地区</span>
        <span class="value">{{ formatLocation(product.location) }}</span>
      </div>
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
      brand: '暂无',
      model: '暂无',
      specs: '暂无',
      purchaseDate: '暂无',
      warranty: '暂无',
      condition: '暂无',
      location: [],
    }),
  },
})

const formatLocation = (location) => {
  return Array.isArray(location) ? location.join(' ') : location || '暂无'
}
</script>

<style scoped>
.product-details {
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

.details-content {
  padding: 16px 20px;
  height: 150px;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  width: 100px;
  color: #999;
  font-size: 14px;
}

.detail-item .value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

/* 自定义滚动条样式 */
.details-content::-webkit-scrollbar {
  width: 6px;
}

.details-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.details-content::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.details-content::-webkit-scrollbar-thumb:hover {
  background-color: #ccc;
}
</style>
