<template>
  <div class="category-page">
    <TopNav />

    <div class="main-content">
      <div class="category-header">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <span>{{ categoryName }}</span>
        </div>
        <h1>{{ categoryName }}</h1>
      </div>

      <div class="category-content">
        <div class="sidebar">
          <div class="filter-section">
            <h3>分类筛选</h3>
            <div class="filter-list">
              <div
                v-for="cat in subCategories"
                :key="cat.id"
                class="filter-item"
                :class="{ active: currentSubCategory === cat.id }"
                @click="currentSubCategory = cat.id"
              >
                {{ cat.name }}
                <span class="count">({{ cat.count }})</span>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <h3>价格区间</h3>
            <div class="price-range">
              <div class="price-inputs">
                <input type="number" placeholder="最低价" v-model="priceMin" />
                <span class="price-separator">-</span>
                <input type="number" placeholder="最高价" v-model="priceMax" />
              </div>
              <button @click="applyPriceFilter" class="filter-button">筛选</button>
            </div>
          </div>

          <div class="filter-section">
            <h3>卖家评分</h3>
            <div class="filter-list">
              <div
                class="filter-item"
                :class="{ active: sellerRating === 4.5 }"
                @click="sellerRating = sellerRating === 4.5 ? null : 4.5"
              >
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i
                ><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                <span>4.5分以上</span>
              </div>
              <div
                class="filter-item"
                :class="{ active: sellerRating === 4 }"
                @click="sellerRating = sellerRating === 4 ? null : 4"
              >
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i
                ><i class="fas fa-star"></i>
                <span>4分以上</span>
              </div>
              <div
                class="filter-item"
                :class="{ active: sellerRating === 3 }"
                @click="sellerRating = sellerRating === 3 ? null : 3"
              >
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                <span>3分以上</span>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <h3>商品状态</h3>
            <div class="filter-list">
              <div
                class="filter-item"
                :class="{ active: productCondition === '全新' }"
                @click="productCondition = productCondition === '全新' ? null : '全新'"
              >
                全新
              </div>
              <div
                class="filter-item"
                :class="{ active: productCondition === '9成新' }"
                @click="productCondition = productCondition === '9成新' ? null : '9成新'"
              >
                9成新
              </div>
              <div
                class="filter-item"
                :class="{ active: productCondition === '8成新' }"
                @click="productCondition = productCondition === '8成新' ? null : '8成新'"
              >
                8成新
              </div>
              <div
                class="filter-item"
                :class="{ active: productCondition === '7成新及以下' }"
                @click="
                  productCondition = productCondition === '7成新及以下' ? null : '7成新及以下'
                "
              >
                7成新及以下
              </div>
            </div>
          </div>

          <button class="reset-button" @click="resetFilters">重置筛选</button>
        </div>

        <div class="products-section">
          <div class="products-header">
            <div class="sort-options">
              <span class="sort-label">排序:</span>
              <div class="sort-buttons">
                <button
                  class="sort-btn"
                  :class="{ active: sortBy === 'default' }"
                  @click="sortBy = 'default'"
                >
                  默认
                </button>
                <button
                  class="sort-btn"
                  :class="{ active: sortBy === 'newest' }"
                  @click="sortBy = 'newest'"
                >
                  最新上架
                </button>
                <button
                  class="sort-btn"
                  :class="{ active: sortBy === 'price_asc' || sortBy === 'price_desc' }"
                  @click="togglePriceSort"
                >
                  价格
                  <i
                    class="fas"
                    :class="sortBy === 'price_asc' ? 'fa-sort-up' : 'fa-sort-down'"
                  ></i>
                </button>
                <button
                  class="sort-btn"
                  :class="{ active: sortBy === 'sales' }"
                  @click="sortBy = 'sales'"
                >
                  销量优先
                </button>
              </div>
            </div>
            <div class="products-count">
              共 <span>{{ filteredProducts.length }}</span> 件商品
            </div>
          </div>

          <div v-if="filteredProducts.length > 0" class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
              @click="navigateToProductDetail(product.id)"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.title" />
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

          <div v-else class="no-products">
            <img src="/empty-products.svg" alt="暂无商品" class="empty-image" />
            <p class="empty-text">暂无符合条件的商品</p>
            <button class="reset-button" @click="resetFilters">重置筛选条件</button>
          </div>

          <div class="pagination">
            <button class="page-btn prev" :disabled="currentPage === 1" @click="currentPage--">
              <i class="fas fa-chevron-left"></i> 上一页
            </button>
            <div class="page-numbers">
              <button
                v-for="page in totalPages"
                :key="page"
                class="page-number"
                :class="{ active: page === currentPage }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="page-btn next"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页 <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopNav from '@/components/shared/TopNav.vue'

const route = useRoute()
const router = useRouter()

// 分类数据
const categoryId = computed(() => route.params.categoryId)
const categoryName = ref('数码电子')

// 分页
const currentPage = ref(1)
const pageSize = 12
const totalPages = ref(5)

// 筛选条件
const currentSubCategory = ref(null)
const priceMin = ref('')
const priceMax = ref('')
const sellerRating = ref(null)
const productCondition = ref(null)
const sortBy = ref('default')

// 子分类
const subCategories = ref([
  { id: 1, name: 'iPhone', count: 42 },
  { id: 2, name: '华为', count: 37 },
  { id: 3, name: '小米', count: 48 },
  { id: 4, name: 'OPPO', count: 24 },
  { id: 5, name: '三星', count: 19 },
  { id: 6, name: '魅族', count: 15 },
])

// 商品数据
const products = ref([
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
    subCategoryId: 1,
    condition: '9成新',
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
    subCategoryId: 2,
    condition: '9成新',
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
    subCategoryId: 3,
    condition: '9成新',
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
    subCategoryId: 2,
    condition: '8成新',
  },
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
    subCategoryId: 1,
    condition: '9成新',
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
    subCategoryId: 3,
    condition: '全新',
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
    subCategoryId: 2,
    condition: '9成新',
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
    subCategoryId: 1,
    condition: '9成新',
  },
  {
    id: 11,
    title: 'Redmi Note 12 Pro',
    price: 1099,
    originalPrice: 1999,
    image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.Kp5wN-YxqFT9KTp9kSRx9AHaHa?w=203&h=203&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 1823,
    rating: 4.3,
    tags: ['8成新', '天玑1080'],
    subCategoryId: 3,
    condition: '8成新',
  },
  {
    id: 12,
    title: 'OPPO Find X6 Pro',
    price: 3699,
    originalPrice: 5999,
    image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.gzKLCUuAs-VvZVomM_bh3gHaHa?w=190&h=190&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 386,
    rating: 4.8,
    tags: ['9成新', '哈苏调校'],
    subCategoryId: 4,
    condition: '9成新',
  },
  {
    id: 13,
    title: 'Samsung Galaxy S23',
    price: 3599,
    originalPrice: 6199,
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.5F0QQ3iCfpPQE2YYiDNj-AHaHM?w=183&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 467,
    rating: 4.7,
    tags: ['95新', '高通骁龙8+'],
    subCategoryId: 5,
    condition: '9成新',
  },
  {
    id: 14,
    title: 'Meizu 20 Pro',
    price: 2399,
    originalPrice: 3999,
    image:
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.lpibz7r-4HHXwT_KHNv6GgHaHa?w=203&h=203&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 245,
    rating: 4.5,
    tags: ['85新', 'FlymeOS'],
    subCategoryId: 6,
    condition: '8成新',
  },
  {
    id: 15,
    title: 'iPhone 14 Pro',
    price: 5499,
    originalPrice: 7999,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.cO1CRYcPiHXZXEVcnzK0iQHaHa?w=201&h=201&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 935,
    rating: 4.9,
    tags: ['95新', '灵动岛设计'],
    subCategoryId: 1,
    condition: '9成新',
  },
  {
    id: 16,
    title: '全新 Xiaomi 14',
    price: 4299,
    originalPrice: 4599,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.0UcT1KcIpqRWGD5fJnJX0wHaF3?w=277&h=219&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    sales: 189,
    rating: 5.0,
    tags: ['全新', '骁龙8 Gen3'],
    subCategoryId: 3,
    condition: '全新',
  },
])

// 根据筛选条件过滤商品
const filteredProducts = computed(() => {
  let result = [...products.value]

  // 子分类筛选
  if (currentSubCategory.value) {
    result = result.filter((item) => item.subCategoryId === currentSubCategory.value)
  }

  // 价格筛选
  if (priceMin.value !== '' && priceMax.value !== '') {
    result = result.filter(
      (item) => item.price >= Number(priceMin.value) && item.price <= Number(priceMax.value),
    )
  } else if (priceMin.value !== '') {
    result = result.filter((item) => item.price >= Number(priceMin.value))
  } else if (priceMax.value !== '') {
    result = result.filter((item) => item.price <= Number(priceMax.value))
  }

  // 卖家评分筛选
  if (sellerRating.value) {
    result = result.filter((item) => item.rating >= sellerRating.value)
  }

  // 商品状态筛选
  if (productCondition.value) {
    result = result.filter((item) => item.condition === productCondition.value)
  }

  // 排序
  if (sortBy.value === 'newest') {
    // 假设id越大的商品越新
    result = result.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'price_asc') {
    result = result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price_desc') {
    result = result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'sales') {
    result = result.sort((a, b) => b.sales - a.sales)
  }

  // 计算总页数
  totalPages.value = Math.ceil(result.length / pageSize)

  // 分页
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize

  return result.slice(start, end)
})

// 切换价格排序方向
const togglePriceSort = () => {
  sortBy.value = sortBy.value === 'price_asc' ? 'price_desc' : 'price_asc'
}

// 应用价格筛选
const applyPriceFilter = () => {
  // 已经通过计算属性自动应用了
  // 这里只需要重置页码
  currentPage.value = 1
}

// 重置所有筛选条件
const resetFilters = () => {
  currentSubCategory.value = null
  priceMin.value = ''
  priceMax.value = ''
  sellerRating.value = null
  productCondition.value = null
  sortBy.value = 'default'
  currentPage.value = 1
}

// 跳转到商品详情页
const navigateToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 在组件挂载时从路由参数中获取分类信息
onMounted(() => {
  // 根据路由参数设置当前分类
  const categoryParam = route.params.category

  // 这里应该通过API获取分类信息，现在用模拟数据
  if (categoryParam === 'digital') {
    categoryName.value = '数码电子'
  } else if (categoryParam === 'fashion') {
    categoryName.value = '服装鞋包'
  } else if (categoryParam === 'furniture') {
    categoryName.value = '家居家具'
  }
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 60px;
}

.category-header {
  margin-bottom: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #ff5722;
}

.separator {
  margin: 0 8px;
}

.category-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.category-content {
  display: flex;
  gap: 24px;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-section h3 {
  font-size: 16px;
  margin: 0 0 12px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.filter-item:hover {
  background: #f9f9f9;
  color: #ff5722;
}

.filter-item.active {
  background: #fff0eb;
  color: #ff5722;
}

.count {
  color: #999;
  font-size: 12px;
}

.price-range {
  margin-top: 8px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.price-inputs input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 80px;
}

.price-separator {
  color: #999;
}

.filter-button {
  width: 100%;
  padding: 8px;
  border: none;
  background: #ff5722;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.filter-button:hover {
  background: #f4511e;
}

.reset-button {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.reset-button:hover {
  border-color: #ff5722;
  color: #ff5722;
}

.products-section {
  flex: 1;
}

.products-header {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sort-options {
  display: flex;
  align-items: center;
}

.sort-label {
  color: #666;
  margin-right: 12px;
  font-size: 14px;
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 6px 12px;
  border: 1px solid transparent;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-btn:hover {
  color: #ff5722;
}

.sort-btn.active {
  color: #ff5722;
  border-color: #ffebe5;
  background: #fff5f2;
}

.products-count {
  color: #666;
  font-size: 14px;
}

.products-count span {
  color: #ff5722;
  font-weight: bold;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  padding-top: 100%;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.tag {
  padding: 2px 6px;
  background: rgba(255, 87, 34, 0.9);
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.product-info {
  padding: 12px;
}

.product-title {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 8px;
}

.current-price {
  font-size: 18px;
  color: #ff5722;
  font-weight: bold;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  gap: 12px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn:hover:not(:disabled) {
  border-color: #ff5722;
  color: #ff5722;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.page-number:hover {
  border-color: #ff5722;
  color: #ff5722;
}

.page-number.active {
  background: #ff5722;
  color: white;
  border-color: #ff5722;
}

.no-products {
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-image {
  width: 160px;
  margin-bottom: 20px;
}

.empty-text {
  color: #999;
  margin-bottom: 16px;
}

@media (max-width: 992px) {
  .category-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .sort-options {
    width: 100%;
    overflow-x: auto;
  }

  .sort-buttons {
    flex-wrap: nowrap;
    width: max-content;
  }
}
</style>
