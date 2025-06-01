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
          width="18"
          height="18"
        >
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
        </svg>
        回到顶部
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/shared/TopNav.vue'
import FilterBar from '@/components/productlist/FilterBar.vue'
import ProductCard from '@/components/productlist/ProductCard.vue'

const router = useRouter()

const allMockProducts = ref([]) // Stores all fetched mock products initially
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
const itemsPerPage = 12 // Number of items to load per page

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
      imageUrl: `https://via.placeholder.com/300x400/EFEFEF/777777?text=商品${i}`,
      name: `${sampleNames[i % sampleNames.length]} - ${conditions[i % conditions.length]}特惠 No.${i}`,
      currentPrice: currentPrice.toFixed(2),
      originalPrice: originalPrice ? originalPrice.toFixed(2) : null,
      conditionTag: conditions[i % conditions.length],
      sellerRating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
      category: categories[i % categories.length],
      postedDate: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ).toISOString(), // Random date in last 30 days
    })
  }
  return products
}

// --- Filtering and Sorting Logic ---
const getFilteredAndSortedProducts = () => {
  let productsToFilter = [...allMockProducts.value]

  // Category filter
  if (appliedFilters.category) {
    productsToFilter = productsToFilter.filter((p) => p.category === appliedFilters.category)
  }

  // Price range filter
  const [minPrice, maxPrice] = appliedFilters.priceRange
  if (minPrice !== null) {
    productsToFilter = productsToFilter.filter((p) => parseFloat(p.currentPrice) >= minPrice)
  }
  if (maxPrice !== null) {
    productsToFilter = productsToFilter.filter((p) => parseFloat(p.currentPrice) <= maxPrice)
  }

  // Condition filter
  if (appliedFilters.condition) {
    // This mock assumes conditionTag is a direct match. Real scenario might be more complex.
    productsToFilter = productsToFilter.filter((p) =>
      p.conditionTag.includes(appliedFilters.condition.replace('new', '').replace('_', '')),
    )
  }

  // Sorting
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
      // For comprehensive, could be a mix or just by date as a default
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

  console.log(
    `[ProductListView] Fetching products. Page: ${currentPage.value}, Filters:`,
    JSON.parse(JSON.stringify(appliedFilters)),
  )

  // Simulate API call
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
    console.log(
      '[ProductListView] Products loaded. Has more:',
      hasMore.value,
      'Displayed count:',
      displayedProducts.value.length,
    )
  }, 700) // Simulate network delay
}

const loadMoreProducts = () => {
  if (hasMore.value && !isLoading.value) {
    fetchProducts(true)
  }
}

// --- Event Handlers ---
const updateAppliedFilters = (newFilters) => {
  console.log('[ProductListView] Filters received from FilterBar:', newFilters)
  appliedFilters.category = newFilters.category
  appliedFilters.priceRange = [...newFilters.priceRange]
  appliedFilters.condition = newFilters.condition
  appliedFilters.sortBy = newFilters.sortBy
  fetchProducts() // Refetch products with new filters from page 1
}

const navigateToProductDetail = (productId) => {
  console.log('[ProductListView] Navigate to product:', productId)
  router.push(`/product/${productId}`)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetAllFilters = () => {
  // This should ideally reset the FilterBar component's internal state too.
  // For now, we reset local filters and re-fetch.
  // A more robust solution would involve the FilterBar emitting a 'reset' or accepting props to reset.
  appliedFilters.category = null
  appliedFilters.priceRange = [null, null]
  appliedFilters.condition = null
  appliedFilters.sortBy = 'comprehensive'
  // Potentially call a method on FilterBar child component if a ref is used, or emit an event to it.
  fetchProducts()
  // Manually reset FilterBar (simple way, might need ref or event for complex FilterBar)
  const filterBarComponent = document.querySelector('.filter-bar select') // very basic reset
  if (filterBarComponent) filterBarComponent.value = ''
  // This is a simplified reset, real FilterBar would need a dedicated reset method or prop.
}

// --- Lifecycle and Watchers ---
onMounted(() => {
  allMockProducts.value = generateMockProducts(60) // Generate initial full list
  fetchProducts() // Initial fetch
})

// Watch for filter changes to automatically refetch (optional, if not relying on button clicks only)
// watch(appliedFilters, () => {
//   fetchProducts();
// }, { deep: true });
</script>

<style scoped>
.product-list-page {
  background-color: #f4f6f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Adjust FilterBar's sticky top position to account for TopNav's height */
:deep(.filter-bar-sticky-wrapper) {
  top: 60px; /* TopNav height */
}

.product-list-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex-grow: 1;
}

.product-grid {
  display: grid;
  /* Responsive columns: 1 on small, 2 on medium, 3 on large, 4 on x-large */
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
  color: #777;
  font-size: 16px;
}

.spinner,
.spinner-small {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #007bff; /* Blue accent */
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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 25px;
  font-size: 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.load-more-button:hover {
  background-color: #0056b3;
}

.load-more-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.quick-actions-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 950; /* Below filter bar if it's very wide, above content */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-action-button {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 50%; /* Make them circular */
  width: 48px;
  height: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  flex-direction: column; /* Icon above text */
  align-items: center;
  justify-content: center;
  font-size: 10px; /* Smaller text for inside button */
  color: #333;
  transition: all 0.2s ease;
  padding: 5px; /* Adjust padding for content */
}

.quick-action-button svg {
  margin-bottom: 2px; /* Space between icon and text */
}

.quick-action-button:hover {
  background-color: #ffffff;
  border-color: #007bff;
  color: #007bff;
}

/* Hide quick actions on mobile, as per typical UX */
@media (max-width: 768px) {
  .quick-actions-panel {
    display: none;
  }
}
</style>
