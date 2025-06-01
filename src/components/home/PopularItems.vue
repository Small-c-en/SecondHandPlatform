<template>
  <div class="popular-items-section">
    <h2>热门推荐</h2>
    <div class="items-grid">
      <div v-for="item in items" :key="item.id" class="item-card">
        <img :src="item.image" :alt="item.name" class="item-image" />
        <div class="item-info">
          <h3 class="item-name">{{ item.name }}</h3>
          <p class="item-price">¥{{ item.price }}</p>
          <span class="item-condition">{{ item.condition }}</span>
        </div>
        <button class="view-details-btn">查看详情</button>
      </div>
    </div>
    <!-- 瀑布流加载更多逻辑 -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  // 示例数据，实际应从 API 获取
  {
    id: 1,
    name: '商品A',
    price: '199.00',
    condition: '9成新',
    image: 'https://via.placeholder.com/150?text=ItemA',
  },
  {
    id: 2,
    name: '商品B',
    price: '29.50',
    condition: '全新',
    image: 'https://via.placeholder.com/150?text=ItemB',
  },
  {
    id: 3,
    name: '商品C',
    price: '500.00',
    condition: '8成新',
    image: 'https://via.placeholder.com/150?text=ItemC',
  },
  {
    id: 4,
    name: '商品D',
    price: '75.00',
    condition: '95新',
    image: 'https://via.placeholder.com/150?text=ItemD',
  },
  // ... 更多商品，目标12个初始展示
])

// 瀑布流加载、按热度更新等逻辑
</script>

<style scoped>
.popular-items-section {
  padding: 20px;
  background-color: #f5f5f5; /* 与 HomeView 背景色一致 */
}

.popular-items-section h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.items-grid {
  /* 瀑布流布局通常用 JS 控制或 CSS Grid/Flexbox 结合实现 */
  /* 这里用简单的 Grid 模拟 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.item-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.item-image {
  width: 100%;
  height: 180px; /* 固定高度或按比例 */
  object-fit: cover;
}

.item-info {
  padding: 15px;
  flex-grow: 1;
}

.item-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.item-price {
  font-size: 18px;
  color: #ff6f00; /* 橙色品牌色 */
  font-weight: bold;
  margin-bottom: 5px;
}

.item-condition {
  font-size: 12px;
  color: #666;
  background-color: #eee;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.view-details-btn {
  background-color: #ff6f00; /* 橙色品牌色 */
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  cursor: pointer;
  display: block; /* 使按钮占据卡片底部全部宽度 */
  margin: 0; /* 移除按钮默认的边距 */
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
}
</style>
