<template>
  <div class="browsing-history">
    <div class="section-header">
      <h2>浏览足迹</h2>
      <div class="header-actions">
        <button class="clear-btn" @click="clearHistory">
          <i class="fas fa-trash"></i>
          清空记录
        </button>
        <div class="date-filter">
          <button
            v-for="filter in dateFilters"
            :key="filter.value"
            :class="['filter-btn', { active: currentFilter === filter.value }]"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="history-timeline">
      <div v-for="group in groupedHistory" :key="group.date" class="history-group">
        <div class="date-header">
          <span class="date">{{ formatDate(group.date) }}</span>
          <span class="count">{{ group.items.length }}件商品</span>
        </div>
        <div class="history-items">
          <div v-for="item in group.items" :key="item.id" class="history-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
              <div class="item-actions">
                <button class="action-btn" @click="addToFavorites(item)">
                  <i class="fas fa-heart"></i>
                  收藏
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
                <span class="view-time">{{ formatTime(item.viewTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!hasHistory" class="empty-state">
      <i class="fas fa-history"></i>
      <p>暂无浏览记录</p>
      <button class="browse-btn" @click="$router.push('/')">去逛逛</button>
    </div>

    <div v-if="hasHistory" class="load-more">
      <button class="load-more-btn" :disabled="isLoading || noMoreData" @click="loadMore">
        <template v-if="isLoading">
          <i class="fas fa-spinner fa-spin"></i>
          加载中...
        </template>
        <template v-else-if="noMoreData"> 没有更多记录了 </template>
        <template v-else> 加载更多 </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const currentFilter = ref('all')
const isLoading = ref(false)
const noMoreData = ref(false)

const dateFilters = [
  { label: '全部', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
]

// 模拟浏览历史数据
const historyItems = ref([
  {
    id: 1,
    title: 'iPhone 13 Pro Max',
    description: '95新 全网通 256GB 暗夜绿',
    price: 6999,
    originalPrice: 9599,
    image: '/products/iphone13.jpg',
    viewTime: new Date('2024-01-15T14:30:00'),
  },
  {
    id: 2,
    title: 'MacBook Pro M1',
    description: '2021款 16G 512GB 深空灰',
    price: 9999,
    originalPrice: 12999,
    image: '/products/macbook.jpg',
    viewTime: new Date('2024-01-15T10:20:00'),
  },
  {
    id: 3,
    title: 'Sony WH-1000XM4',
    description: '无线降噪耳机',
    price: 1899,
    originalPrice: 2599,
    image: '/products/sony.jpg',
    viewTime: new Date('2024-01-14T16:45:00'),
  },
])

const hasHistory = computed(() => historyItems.value.length > 0)

const groupedHistory = computed(() => {
  const groups = {}
  historyItems.value.forEach((item) => {
    const date = item.viewTime.toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = {
        date: new Date(date),
        items: [],
      }
    }
    groups[date].items.push(item)
  })
  return Object.values(groups).sort((a, b) => b.date - a.date)
})

const formatDate = (date) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const clearHistory = async () => {
  if (!confirm('确定要清空所有浏览记录吗？')) return

  try {
    // 这里应该调用API清空浏览记录
    historyItems.value = []
  } catch (error) {
    console.error('清空浏览记录失败:', error)
  }
}

const addToFavorites = async (item) => {
  try {
    // 这里应该调用API添加到收藏
    console.log('已添加到收藏:', item)
  } catch (error) {
    console.error('添加到收藏失败:', error)
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

const loadMore = async () => {
  if (isLoading.value || noMoreData.value) return

  isLoading.value = true
  try {
    // 这里应该调用API加载更多数据
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // 模拟没有更多数据
    noMoreData.value = true
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.browsing-history {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.clear-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #ff5722;
  color: #ff5722;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #ff5722;
  color: white;
}

.date-filter {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 16px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #ff5722;
  color: white;
  border-color: #ff5722;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.history-group {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
}

.date {
  font-weight: 500;
  color: #333;
}

.count {
  font-size: 14px;
  color: #666;
}

.history-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
}

.history-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.history-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
  padding-top: 100%;
}

.item-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.view-time {
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

.load-more {
  text-align: center;
  margin-top: 24px;
}

.load-more-btn {
  padding: 8px 24px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 20px;
  color: #666;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.load-more-btn:not(:disabled):hover {
  border-color: #ff5722;
  color: #ff5722;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
