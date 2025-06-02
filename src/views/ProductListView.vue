<template>
  <div class="product-list-page">
    <TopNav />
    <FilterBar @filters-updated="updateAppliedFilters" />

    <div class="product-list-content">
      <div v-if="isLoading && displayedProducts.length === 0" class="loading-initial">
        <div class="spinner"></div>
        <p>正在加载商品...</p>
      </div>
      <div v-else-if="!isLoading && displayedProducts.length === 0 && !hasMore" class="no-results">
        <p>没有找到符合条件的商品，试试调整筛选条件吧！</p>
      </div>

      <div v-if="displayedProducts.length > 0" class="product-grid">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
          @view-details="navigateToProductDetail"
        />
      </div>

      <div class="pagination-controls">
        <button v-if="hasMore && !isLoading" @click="loadMoreProducts" class="load-more-button">
          加载更多
        </button>
        <div v-if="isLoading && displayedProducts.length > 0" class="loading-more">
          <div class="spinner-small"></div>
          正在加载...
        </div>
        <p v-if="!hasMore && displayedProducts.length > 0" class="no-more-products">已无更多商品</p>
      </div>
    </div>

    <!-- Quick Actions (PC only) -->
    <div class="quick-actions-panel">
      <button @click="resetAllFilters" class="quick-action-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="18"
          height="18"
        >
          <path
            d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
          />
        </svg>
        重置筛选
      </button>
      <button @click="scrollToTop" class="quick-action-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
        </svg>
        回到顶部
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/shared/TopNav.vue'
import FilterBar from '@/components/productlist/FilterBar.vue'
import ProductCard from '@/components/productlist/ProductCard.vue'

const router = useRouter()

const allMockProducts = ref([])
const displayedProducts = ref([])
const appliedFilters = reactive({
  category: null,
  priceRange: [null, null],
  condition: null,
  sortBy: 'comprehensive',
})

const isLoading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const itemsPerPage = 12

// --- Mock Product Data Generation ---
const generateMockProducts = (count = 50) => {
  const sampleNames = [
    '复古风手提包',
    '智能降噪耳机',
    '纯棉白T恤',
    '多功能料理机',
    '经典款帆布鞋',
    '《代码大全》绝版',
    '二手品牌山地车',
    '9成新游戏显卡',
    '办公用人体工学椅',
    '限量版动漫手办',
  ]
  const imagesUrl = [
    'https://tse3-mm.cn.bing.net/th/id/OIP-C.PR8Hg7c-B-7Sak531AtcmQHaHa?w=208&h=208&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.hg84NUM4zuHQ0ByaZtOO8AHaHa?w=173&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.i6g-IiuoETRsy6L-dka24wHaHa?w=211&h=211&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse2-mm.cn.bing.net/th/id/OIP-C.l1JHX-p2U8TqXUBjSqSl5gHaE9?w=280&h=187&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse2-mm.cn.bing.net/th/id/OIP-C.FOhw8_yGWKj9SU1KZ3XvKgHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.HUR1sXu2a0JcWaUqF8hKyQHaD0?w=265&h=179&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.W6qWX7nzMFQPobOiioFo8AHaE8?w=272&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.7xGHnyxPmyZpterLL6cA8gHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'data:image/jpeg;base64,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',
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.WTT-PMZKo6FRi4qJmqTblQHaHa?w=171&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
  ]
  const conditions = ['全新', '95新', '9成新', '8成新', '7成新']
  const categories = ['服饰鞋包', '电子产品', '图书音像', '家具家居', '其他']
  const products = []
  for (let i = 1; i <= count; i++) {
    const currentPrice = parseFloat((Math.random() * 500 + 20).toFixed(2))
    const originalPrice =
      Math.random() > 0.3
        ? parseFloat((currentPrice * (1 + Math.random() * 0.5 + 0.1)).toFixed(2))
        : null
    products.push({
      id: `prod-${Date.now()}-${i}`,
      imageUrl: imagesUrl[i % imagesUrl.length],
      name: `${sampleNames[i % sampleNames.length]} - ${conditions[i % conditions.length]}特惠 No.${i}`,
      currentPrice: currentPrice.toFixed(2),
      originalPrice: originalPrice ? originalPrice.toFixed(2) : null,
      conditionTag: conditions[i % conditions.length],
      sellerRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      category: categories[i % categories.length],
      postedDate: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ).toISOString(),
    })
  }
  return products
}

// --- Filtering and Sorting Logic ---
const getFilteredAndSortedProducts = () => {
  let productsToFilter = [...allMockProducts.value]

  if (appliedFilters.category) {
    productsToFilter = productsToFilter.filter((p) => p.category === appliedFilters.category)
  }

  const [minPrice, maxPrice] = appliedFilters.priceRange
  if (minPrice !== null) {
    productsToFilter = productsToFilter.filter((p) => parseFloat(p.currentPrice) >= minPrice)
  }
  if (maxPrice !== null) {
    productsToFilter = productsToFilter.filter((p) => parseFloat(p.currentPrice) <= maxPrice)
  }

  if (appliedFilters.condition) {
    productsToFilter = productsToFilter.filter((p) =>
      p.conditionTag.includes(appliedFilters.condition.replace('new', '').replace('_', '')),
    )
  }

  switch (appliedFilters.sortBy) {
    case 'price_asc':
      productsToFilter.sort((a, b) => parseFloat(a.currentPrice) - parseFloat(b.currentPrice))
      break
    case 'price_desc':
      productsToFilter.sort((a, b) => parseFloat(b.currentPrice) - parseFloat(a.currentPrice))
      break
    case 'time_desc':
      productsToFilter.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      break
    case 'comprehensive':
    default:
      productsToFilter.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      break
  }
  return productsToFilter
}

// --- Data Fetching and Pagination ---
const fetchProducts = (isLoadMore = false) => {
  if (isLoading.value) return
  isLoading.value = true

  if (!isLoadMore) {
    currentPage.value = 1
    displayedProducts.value = []
  }

  setTimeout(() => {
    const filteredSorted = getFilteredAndSortedProducts()
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newProducts = filteredSorted.slice(startIndex, endIndex)

    if (newProducts.length > 0) {
      displayedProducts.value = isLoadMore
        ? [...displayedProducts.value, ...newProducts]
        : newProducts
      currentPage.value++
    }

    hasMore.value = endIndex < filteredSorted.length
    isLoading.value = false
  }, 700)
}

const loadMoreProducts = () => {
  if (hasMore.value && !isLoading.value) {
    fetchProducts(true)
  }
}

// --- Event Handlers ---
const updateAppliedFilters = (newFilters) => {
  appliedFilters.category = newFilters.category
  appliedFilters.priceRange = [...newFilters.priceRange]
  appliedFilters.condition = newFilters.condition
  appliedFilters.sortBy = newFilters.sortBy
  fetchProducts()
}

const navigateToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetAllFilters = () => {
  appliedFilters.category = null
  appliedFilters.priceRange = [null, null]
  appliedFilters.condition = null
  appliedFilters.sortBy = 'comprehensive'
  fetchProducts()
  const filterBarComponent = document.querySelector('.filter-bar select')
  if (filterBarComponent) filterBarComponent.value = ''
}

onMounted(() => {
  allMockProducts.value = generateMockProducts(60)
  fetchProducts()
})
</script>

<style scoped>
.product-list-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

:deep(.filter-bar-sticky-wrapper) {
  top: 60px;
}

.product-list-content {
  padding: 20px;
  max-width: 1200px;
  margin: 30px auto 0;
  width: 100%;
  flex-grow: 1;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

@media (min-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (min-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

.loading-initial,
.no-results,
.loading-more,
.no-more-products {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.spinner,
.spinner-small {
  border: 4px solid rgba(255, 87, 34, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #ff5722;
  animation: spin 1s ease infinite;
  margin: 0 auto 10px auto;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border-width: 3px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pagination-controls {
  margin-top: 30px;
  text-align: center;
}

.load-more-button {
  background-color: #ff5622c5;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.2);
}

.load-more-button:hover {
  background-color: #f4501e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

.load-more-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.quick-actions-panel {
  position: fixed;
  bottom: 45px;
  right: 45px;
  z-index: 950;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-action-button {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #716d6c;
  border-radius: 50%;
  width: 65px;
  height: 65px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #716d6c;
  transition: all 0.3s ease;
  padding: 5px;
}

.quick-action-button svg {
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.quick-action-button:hover {
  color: #ffffff;
  transform: translateY(-2px);
  border-color: #ff5722;
  color: #ff5722;
  background-color: rgba(255, 87, 34, 0.05);
}
/* 
.quick-action-button:hover svg {
  transform: scale(1.1);
} */

@media (max-width: 768px) {
  .quick-actions-panel {
    display: none;
  }
}

.product-grid > * {
  transition: all 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-grid > * {
  animation: fadeInUp 0.5s ease forwards;
}

.no-results {
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.no-results p {
  color: #666;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}
</style>
