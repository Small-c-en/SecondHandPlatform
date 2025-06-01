<template>
  <div class="my-favorites">
    <div class="section-header">
      <h2>我的收藏</h2>
      <div class="view-options">
        <button
          v-for="option in viewOptions"
          :key="option.value"
          :class="['view-btn', { active: currentView === option.value }]"
          @click="currentView = option.value"
        >
          <i :class="option.icon"></i>
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="favorites-grid" :class="currentView">
      <div v-for="item in favorites" :key="item.id" class="favorite-item">
        <div class="item-image">
          <img :src="item.image" :alt="item.title" />
          <div class="item-actions">
            <button class="action-btn" @click="removeFavorite(item.id)">
              <i class="fas fa-heart-broken"></i>
              取消收藏
            </button>
            <button class="action-btn" @click="addToCart(item)">
              <i class="fas fa-shopping-cart"></i>
              加入购物车
            </button>
          </div>
        </div>
        <div class="item-info">
          <h3 class="item-title">{{ item.title }}</h3>
          <p class="item-desc">{{ item.description }}</p>
          <div class="item-meta">
            <div class="price-info">
              <span class="current-price">¥{{ item.price }}</span>
              <span class="original-price" v-if="item.originalPrice"
                >¥{{ item.originalPrice }}</span
              >
            </div>
            <span class="collect-time">收藏于 {{ formatDate(item.collectTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <i class="fas fa-heart"></i>
      <p>暂无收藏商品</p>
      <button class="browse-btn" @click="$router.push('/')">去逛逛</button>
    </div>

    <div v-if="favorites.length > 0" class="pagination">
      <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">{{ currentPage }}/{{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const currentView = ref('grid')
const currentPage = ref(1)
const totalPages = ref(5)

const viewOptions = [
  { label: '网格视图', value: 'grid', icon: 'fas fa-th-large' },
  { label: '列表视图', value: 'list', icon: 'fas fa-list' },
]

// 模拟收藏数据
const favorites = ref([
  {
    id: 1,
    title: 'iPhone 13 Pro Max',
    description: '95新 全网通 256GB 暗夜绿',
    price: 6999,
    originalPrice: 9599,
    image: '/products/iphone13.jpg',
    collectTime: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'MacBook Pro M1',
    description: '2021款 16G 512GB 深空灰',
    price: 9999,
    originalPrice: 12999,
    image: '/products/macbook.jpg',
    collectTime: new Date('2024-01-10'),
  },
  // 更多收藏项...
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const removeFavorite = async (itemId) => {
  if (!confirm('确定要取消收藏该商品吗？')) return

  try {
    // 这里应该调用API取消收藏
    favorites.value = favorites.value.filter((item) => item.id !== itemId)
  } catch (error) {
    console.error('取消收藏失败:', error)
  }
}

const addToCart = async (item) => {
  try {
    await cartStore.addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    alert('已添加到购物车')
  } catch (error) {
    console.error('添加到购物车失败:', error)
  }
}
</script>

<style scoped>
.my-favorites {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.view-options {
  display: flex;
  gap: 12px;
}

.view-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 20px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: #ff5722;
  color: white;
  border-color: #ff5722;
}

.favorites-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.favorites-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.favorites-grid.list {
  grid-template-columns: 1fr;
}

.favorite-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
  padding-top: 100%;
}

.favorites-grid.list .favorite-item {
  display: flex;
  padding: 16px;
}

.favorites-grid.list .item-image {
  width: 200px;
  height: 200px;
  padding-top: 0;
  flex-shrink: 0;
}

.item-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorites-grid.list .item-image img {
  position: static;
}

.item-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.item-image:hover .item-actions {
  opacity: 1;
}

.action-btn {
  padding: 8px 20px;
  background: white;
  border: none;
  border-radius: 20px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #ff5722;
  color: white;
}

.item-info {
  padding: 16px;
}

.favorites-grid.list .item-info {
  flex: 1;
  padding: 0 0 0 20px;
}

.item-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff5722;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.collect-time {
  font-size: 12px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #666;
}

.empty-state i {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0 0 20px;
}

.browse-btn {
  padding: 8px 24px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.browse-btn:hover {
  background: #f4511e;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  border-color: #ff5722;
  color: #ff5722;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style>
