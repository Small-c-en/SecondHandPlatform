<template>
  <div class="product-params-card scrollable-content">
    <h3 class="section-title">商品参数</h3>
    <ul class="params-list">
      <li>
        <span class="param-name">品牌：</span
        ><span class="param-value">{{ product.brand || '暂无' }}</span>
      </li>
      <li>
        <span class="param-name">型号：</span
        ><span class="param-value">{{ product.model || '暂无' }}</span>
      </li>
      <li>
        <span class="param-name">规格：</span
        ><span class="param-value">{{ product.specification || '暂无' }}</span>
      </li>
      <li>
        <span class="param-name">使用时长：</span
        ><span class="param-value">{{ product.usageDuration || '暂无' }}</span>
      </li>
      <li>
        <span class="param-name">新旧程度：</span
        ><span class="param-value">{{ product.condition || '暂无' }}</span>
      </li>
      <li>
        <span class="param-name">所在地区：</span
        ><span class="param-value">{{ product.location || '暂无' }}</span>
      </li>
      <!-- 更多参数可以动态添加 -->
      <li>
        <span class="param-name">颜色：</span
        ><span class="param-value">{{ product.color || '远峰蓝' }}</span>
      </li>
      <li>
        <span class="param-name">材质：</span
        ><span class="param-value">{{ product.material || '玻璃与不锈钢' }}</span>
      </li>
      <li>
        <span class="param-name">尺寸：</span
        ><span class="param-value">{{ product.dimensions || '160.8 x 78.1 x 7.65 mm' }}</span>
      </li>
      <li>
        <span class="param-name">重量：</span
        ><span class="param-value">{{ product.weight || '238克' }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      brand: '暂无',
      model: '暂无',
      specification: '暂无',
      usageDuration: '暂无',
      condition: '暂无',
      location: '暂无',
      // 添加模拟数据中可能包含的其他参数，以避免模板访问undefined
      color: 'N/A',
      material: 'N/A',
      dimensions: 'N/A',
      weight: 'N/A',
    }),
  },
})
</script>

<style scoped>
.product-params-card {
  /* scrollable-content 类将从 ProductDetailView 继承，提供滚动和固定高度 */
  /* 这里可以定义卡片内部的特定样式 */
  padding: 15px; /* 调整内边距 */
  background-color: #fcfcfc; /* 参数区略微不同的背景色 */
}

.section-title {
  font-size: 16px; /* 调整参数区标题大小 */
  font-weight: bold;
  color: #333;
  margin-top: 0; /* 移除默认的上边距，由父级控制 */
  margin-bottom: 12px;
}

.params-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.params-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  display: flex;
}

.params-list li:last-child {
  margin-bottom: 0;
}

.param-name {
  font-weight: 500;
  color: #444;
  min-width: 70px; /* 调整参数名称宽度 */
  margin-right: 8px;
}

.param-value {
  color: #666;
  flex: 1;
  word-break: break-word; /* 长内容换行 */
}

/* 继承的 .scrollable-content 样式将负责高度和滚动条 */
/* .scrollable-content {
  height: 400px; 
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
} */
</style>
