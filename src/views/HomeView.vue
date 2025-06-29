<template>
  <div class="home">
    <TopNav />

    <!-- Hero section with improved layout -->
    <div class="hero-banner">
      <div class="container">
        <div class="hero-content">
          <div class="category-wrapper">
            <CategoryNav />
          </div>
          <div class="carousel-wrapper">
            <Carousel />
          </div>
        </div>
      </div>
    </div>

    <div class="container main-content">
      <!-- Recommended products section -->
      <section class="section recommended-section">
        <div class="section-header">
          <h2>猜你喜欢</h2>
          <div class="filter-tabs">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              :class="['tab-btn', { active: currentTab === tab.value }]"
              @click="currentTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="products-grid" @click="navigateToProductDetail">
          <div
            v-for="product in displayedProducts"
            :key="product.id"
            class="product-card"
            :data-id="product.id"
          >
            <div class="product-image-wrapper">
              <LazyImage :src="product.image" :alt="product.title" ratio="1/1" objectFit="cover" />
              <div class="product-tags" v-if="product.tags && product.tags.length">
                <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
              <div class="product-meta">
                <span class="sales">已售 {{ product.sales }}+</span>
                <span class="rating">
                  <i class="fas fa-star"></i>
                  {{ product.rating }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="load-more-container" ref="loadMoreTrigger">
          <div v-if="loading" class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          <div v-else-if="!hasMore" class="no-more-products">
            <p>没有更多商品了</p>
          </div>
        </div>
      </section>

      <!-- Curated recommendations -->
      <section class="section featured-section">
        <div class="section-header">
          <h2>精选推荐</h2>
          <a href="/category/digital" class="view-more"
            >查看更多 <i class="fas fa-chevron-right"></i
          ></a>
        </div>
        <div class="recommendations-grid" @click="navigateToProductDetail">
          <div
            v-for="product in recommendedProducts"
            :key="product.id"
            class="recommendation-card"
            :data-id="product.id"
          >
            <div class="product-image-wrapper">
              <LazyImage :src="product.image" :alt="product.title" ratio="4/3" objectFit="cover" />
              <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories showcase -->
      <section class="section categories-showcase">
        <div class="section-header">
          <h2>热门分类</h2>
        </div>
        <div class="categories-grid">
          <div
            v-for="(category, index) in popularCategories"
            :key="index"
            class="category-card"
            @click="navigateToCategory(category.link)"
          >
            <LazyImage :src="category.image" :alt="category.name" ratio="16/9" objectFit="cover" />
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.itemCount }}+ 件商品</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/shared/TopNav.vue'
import Carousel from '@/components/home/Carousel.vue'
import CategoryNav from '@/components/home/CategoryNav.vue'
import LazyImage from '@/components/shared/LazyImage.vue'

const router = useRouter()

// Tab filtering
const currentTab = ref('all')
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '最新上架', value: 'new' },
  { label: '价格优先', value: 'price' },
  { label: '信用优先', value: 'credit' },
]

// Product data
const allProducts = ref([
  {
    id: 1,
    title: '九成新 iPhone 13 Pro Max',
    price: 6999,
    originalPrice: 8999,
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.AohnGW4oyTiGIfjuc9GTaAHaFj?w=232&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 1234,
    rating: 4.8,
    tags: ['95新', '官方验机'],
  },
  {
    id: 6,
    title: '九成新 OnePlus 10 Pro',
    price: 1799,
    originalPrice: 5299,
    image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.eDMIsb4BqARJZCtUvLjO-QHaFS?w=245&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 785,
    rating: 4.7,
    tags: ['9成新', '一加官方认证', '哈苏影像'],
  },
  {
    id: 5,
    title: '九五新 Xiaomi 12S Ultra',
    price: 2699,
    originalPrice: 5999,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.jGJYrrNqfoghfn_y90e01QHaEK?w=291&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 1120,
    rating: 4.8,
    tags: ['95新', '小米官方验机', '骁龙8+ Gen1'],
  },
  {
    id: 4,
    title: '八成新 Huawei P50 Pro',
    price: 1999,
    originalPrice: 6488,
    image:
      'https://imgslim.geekpark.net/uploads/image/file/49/65/496540728e3c9b06343080516d795466.png',
    sales: 543,
    rating: 4.6,
    tags: ['8成新', '鸿蒙系统', '徕卡四摄'],
  },
  // 添加更多产品...
  {
    id: 7,
    title: 'iPhone 12 Pro 256GB',
    price: 3999,
    originalPrice: 6999,
    image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.YAFvzm0j7SFjpvvkh-lroAHaFj?w=247&h=185&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 892,
    rating: 4.7,
    tags: ['95新', 'A14仿生'],
  },
  {
    id: 8,
    title: '全新未拆封 Xiaomi 13 Pro',
    price: 4899,
    originalPrice: 5299,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.O4e8l1cxvlW4KjR-F1WYWwHaHa?w=187&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 356,
    rating: 5.0,
    tags: ['全新', '徕卡光学'],
  },
  {
    id: 9,
    title: 'Huawei Mate 50 Pro',
    price: 3899,
    originalPrice: 6799,
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.RUE-KzCT-6lrrNu3UJrhMQHaHa?w=194&h=194&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 478,
    rating: 4.9,
    tags: ['9成新', '昆仑玻璃'],
  },
  {
    id: 10,
    title: 'iPhone SE 第三代',
    price: 2199,
    originalPrice: 3499,
    image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.13hsbF7yzo1RLhuAiJYSaQAAAA?w=203&h=203&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 621,
    rating: 4.5,
    tags: ['95新', 'A15芯片'],
  },
])

// 推荐模块商品数据
const recommendedProducts = [
  {
    id: 1,
    title: 'iPhone 13 Pro Max',
    description: '95新 全网通 256GB',
    price: 6999,
    originalPrice: 9599,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.-q-QFg2bYQUBubNgc5DW_gHaEK?w=288&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    badge: '严选认证',
  },
  {
    id: 2,
    title: 'MacBook Pro M1',
    description: '2021款 16G 512GB',
    price: 9999,
    originalPrice: 12999,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.DYGEkjfGc1HRF4EV-N6eMQHaEj?w=292&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    badge: '官方翻新',
  },
  {
    id: 3,
    title: 'Sony WH-1000XM4',
    description: '无线降噪耳机',
    price: 1899,
    originalPrice: 2599,
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.rL5w1XV4trp35nEI7bSquAHaFc?w=218&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    badge: '超值优选',
  },
  {
    id: 4,
    title: 'iPad Pro 2022',
    description: '12.9寸 WIFI版',
    price: 5999,
    originalPrice: 7999,
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.7uR8rGRn_Gj01ewFyB79aQHaFj?w=224&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    badge: '品质优选',
  },
]

// Popular categories
const popularCategories = [
  {
    name: '数码电子',
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.tY0NUQbkOAlRRbrSwDi1EQHaE8?w=292&h=195&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    link: 'digital',
    itemCount: 1258,
  },
  {
    name: '服装鞋包',
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.j5Rjc3wQcgRd9C7YUL7oDAHaE8?w=236&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    link: 'fashion',
    itemCount: 2475,
  },
  {
    name: '家居家具',
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.RvA5bP2Y4nig4M3bx0rQKQHaE8?w=279&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    link: 'furniture',
    itemCount: 982,
  },
]

// Infinite scroll setup
const page = ref(1)
const pageSize = 8
const loading = ref(false)
const hasMore = ref(true)
const loadMoreTrigger = ref(null)
const loadMoreObserver = ref(null)

// Filter and paginate products
const filteredProducts = computed(() => {
  let result = [...allProducts.value]

  if (currentTab.value === 'new') {
    result = result.sort((a, b) => b.id - a.id)
  } else if (currentTab.value === 'price') {
    result = result.sort((a, b) => a.price - b.price)
  } else if (currentTab.value === 'credit') {
    result = result.sort((a, b) => b.rating - a.rating)
  }

  return result
})

// Currently displayed products (for pagination)
const displayedProducts = ref([])

// Navigation functions
const navigateToProductDetail = (event) => {
  const productCard = event.target.closest('.product-card, .recommendation-card')
  if (productCard) {
    const productId = productCard.getAttribute('data-id')
    router.push(`/product/${productId}`)
  }
}

const navigateToCategory = (categoryId) => {
  router.push(`/category/${categoryId}`)
}

// Load more products when scrolling
const loadMoreProducts = () => {
  if (loading.value || !hasMore.value) return

  loading.value = true

  // Simulate API call delay
  setTimeout(() => {
    const startIndex = (page.value - 1) * pageSize
    const endIndex = startIndex + pageSize
    const newProducts = filteredProducts.value.slice(startIndex, endIndex)

    if (newProducts.length > 0) {
      displayedProducts.value.push(...newProducts)
      page.value++

      // Check if we've loaded all products
      if (displayedProducts.value.length >= filteredProducts.value.length) {
        hasMore.value = false
      }
    } else {
      hasMore.value = false
    }

    loading.value = false
  }, 800)
}

// Reset pagination when filter changes
const resetPagination = () => {
  page.value = 1
  displayedProducts.value = []
  hasMore.value = true
  loadMoreProducts()
}

// Watch for filter changes
watch(currentTab, () => {
  resetPagination()
})

// Setup intersection observer for infinite scroll
onMounted(() => {
  // Initial load
  loadMoreProducts()

  // Set up intersection observer for infinite scroll
  if ('IntersectionObserver' in window) {
    loadMoreObserver.value = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts()
        }
      },
      { threshold: 0.5 },
    )

    if (loadMoreTrigger.value) {
      loadMoreObserver.value.observe(loadMoreTrigger.value)
    }
  }
})

// Cleanup
onUnmounted(() => {
  if (loadMoreObserver.value) {
    loadMoreObserver.value.disconnect()
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero section with improved styling */
.hero-banner {
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  padding-top: 80px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);
}

.hero-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  align-items: start;
}

.category-wrapper {
  height: 400px;
}

.carousel-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* Section styling */
.section {
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
  position: relative;
  padding-left: 16px;
}

.section-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #ff5722;
  border-radius: 2px;
}

.view-more {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.3s;
}

.view-more:hover {
  color: #ff5722;
}

.view-more i {
  font-size: 12px;
  margin-left: 4px;
}

/* Filter tabs */
.filter-tabs {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tab-btn:hover {
  border-color: #ff5722;
  color: #ff5722;
}

.tab-btn.active {
  background: #ff5722;
  color: white;
  border-color: #ff5722;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.25);
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid #eee;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-color: #ddd;
}

.product-image-wrapper {
  position: relative;
}

.product-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 1;
}

.tag {
  padding: 2px 8px;
  background: rgba(255, 87, 34, 0.85);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.product-info {
  padding: 16px;
}

.product-title {
  margin: 0 0 12px;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
}

.current-price {
  font-size: 20px;
  color: #ff5722;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating i {
  color: #ffb800;
}

/* Recommendations grid */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 1px solid #eee;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-color: #ddd;
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 87, 34, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.product-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Categories showcase */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  height: 200px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: scale(1.02);
}

.category-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.category-info h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.category-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

/* Infinite scroll loading */
.load-more-container {
  text-align: center;
  padding: 20px 0;
  min-height: 60px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid rgba(255, 87, 34, 0.1);
  border-top-color: #ff5722;
  animation: spin 1s linear infinite;
}

.no-more-products {
  color: #999;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .category-wrapper {
    display: none;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
    flex-wrap: nowrap;
  }

  .products-grid,
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
