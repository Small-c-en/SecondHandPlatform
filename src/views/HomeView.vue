<template>
  <div class="home">
    <TopNav />

    <div class="main-content">
      <div class="hero-section">
        <div class="category-wrapper">
          <CategoryNav />
        </div>
        <div class="carousel-wrapper">
          <Carousel />
        </div>
      </div>

      <section class="recommended-section">
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

        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
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

        <!-- 排行 -->
        <div class="rankings-section">
          <div class="ranking-lists">
            <div v-for="ranking in rankings" :key="ranking.type" class="ranking-card">
              <div class="ranking-header">
                <i :class="ranking.icon"></i>
                <h3>{{ ranking.title }}</h3>
              </div>
              <div class="ranking-items">
                <div v-for="(item, index) in ranking.items" :key="index" class="ranking-item">
                  <div class="rank-number" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                  <img :src="item.image" :alt="item.title" />
                  <div class="item-info">
                    <h4>{{ item.title }}</h4>
                    <p class="price">¥{{ item.price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="recommendations-section">
        <div class="section-header">
          <h2>精选推荐</h2>
        </div>
        <div class="recommendations-grid">
          <div v-for="product in recommendedProducts" :key="product.id" class="recommendation-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.title" />
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

      <section class="floor-section" v-for="floor in floors" :key="floor.id">
        <div class="floor-header" :style="{ background: floor.theme.gradient }">
          <div class="floor-title">
            <h2>{{ floor.title }}</h2>
            <p>{{ floor.subtitle }}</p>
          </div>
          <img :src="floor.theme.image" :alt="floor.title" class="theme-image" />
        </div>
        <div class="floor-content">
          <div class="main-product">
            <img :src="floor.mainProduct.image" :alt="floor.mainProduct.title" />
            <div class="product-info">
              <h3>{{ floor.mainProduct.title }}</h3>
              <p class="price">¥{{ floor.mainProduct.price }}</p>
              <button class="buy-btn">立即购买</button>
            </div>
          </div>
          <div class="sub-products">
            <div v-for="product in floor.subProducts" :key="product.id" class="sub-product-card">
              <img :src="product.image" :alt="product.title" />
              <div class="product-info">
                <h4>{{ product.title }}</h4>
                <p class="price">¥{{ product.price }}</p>
              </div>
              <span class="category-tag">{{ product.category }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TopNav from '@/components/shared/TopNav.vue'
import Carousel from '@/components/home/Carousel.vue'
import CategoryNav from '@/components/home/CategoryNav.vue'

const currentTab = ref('all')
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '最新上架', value: 'new' },
  { label: '价格优先', value: 'price' },
  { label: '信用优先', value: 'credit' },
]

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
  // ... 更多商品数据
])

const rankings = [
  {
    type: 'hot',
    title: '热销榜',
    icon: 'fas fa-fire',
    items: [
      {
        title: 'MacBook Pro M1',
        price: 8999,
        image:
      'https://assets.puxiang.com/uploads/photo/image/331225/bc13d448acbf6d41ef7532d65347d516.jpg-photo_sp',
      },
      // ... 更多榜单数据
    ],
  },
  {
    type: 'hot',
    title: '热销榜',
    icon: 'fas fa-fire',
    items: [
      {
        title: 'MacBook Pro M1',
        price: 8999,
        image: 'path/to/image',
      },
      // ... 更多榜单数据
    ],
  },
  {
    type: 'hot',
    title: '热销榜',
    icon: 'fas fa-fire',
    items: [
      {
        title: 'MacBook Pro M1',
        price: 8999,
        image: 'path/to/image',
      },
      // ... 更多榜单数据
    ],
  },
  {
    type: 'hot',
    title: '热销榜',
    icon: 'fas fa-fire',
    items: [
      {
        title: 'MacBook Pro M1',
        price: 8999,
        image: 'path/to/image',
      },
      // ... 更多榜单数据
    ],
  },
  {
    type: 'hot',
    title: '热销榜',
    icon: 'fas fa-fire',
    items: [
      {
        title: 'MacBook Pro M1',
        price: 8999,
        image: 'path/to/image',
      },
      // ... 更多榜单数据
    ],
  },
  // ... 更多榜单
]

const floors = [
  {
    id: 1,
    title: '夏日焕新',
    subtitle: '品质二手，焕然一新',
    theme: {
      gradient: 'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)',
      image:
        'https://tse3-mm.cn.bing.net/th/id/OIP-C.DYGEkjfGc1HRF4EV-N6eMQHaEj?w=292&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    },
    mainProduct: {
      title: '限量版球鞋',
      price: 1299,
      image: 'path/to/image',
    },
    subProducts: [
      {
        id: 1,
        title: '运动手表',
        price: 899,
        image: 'path/to/image',
        category: '运动装备',
      },
      // ... 更多子产品
    ],
  },
  // ... 更多楼层
]

//推荐模块商品数据
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
  {
    id: 5,
    title: 'Nintendo Switch OLED',
    description: '国行版 白色',
    price: 2199,
    originalPrice: 2599,
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.5ruGKsc6G1up5SIetEmGtQHaDt?w=343&h=174&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    badge: '热卖推荐',
  },
  {
    id: 6,
    title: 'DJI Mini 3 Pro',
    description: '无人机套装',
    price: 4599,
    originalPrice: 5199,
    image:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.pefXlt_AXMxdTkPQjSI6AwHaE8?w=242&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    badge: '新品优选',
  },
  {
    id: 7,
    title: 'Samsung S23 Ultra',
    description: '12+256GB 港版',
    price: 7299,
    originalPrice: 8999,
    image:
      'data:image/jpeg;base64,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',
    badge: '严选认证',
  },
  {
    id: 8,
    title: 'AirPods Pro 2',
    description: '第二代降噪耳机',
    price: 1499,
    originalPrice: 1999,
    image:
      'data:image/jpeg;base64,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',
    badge: '超值特惠',
  },
]

const filteredProducts = computed(() => {
  if (currentTab.value === 'all') return products.value
  // 根据不同tab实现筛选逻辑
  return products.value
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  margin-bottom: 40px;
  margin-top: 60px;
}

.category-wrapper {
  height: 400px;
}

.carousel-wrapper {
  flex: 1;
}

.recommended-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60px;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 6px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #ff5722;
  color: white;
  border-color: #ff5722;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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

.rankings-section {
  margin-bottom: 40px;
}

.ranking-lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.ranking-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.ranking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.ranking-header i {
  color: #ff5722;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  gap: 12px;
}

.rank-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
}

.rank-1 {
  background: #ffd700;
  color: white;
}
.rank-2 {
  background: #c0c0c0;
  color: white;
}
.rank-3 {
  background: #cd7f32;
  color: white;
}

.ranking-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.more-link {
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.viewer-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.anchor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.floor-section {
  margin-bottom: 40px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.floor-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.floor-title h2 {
  margin: 0 0 8px;
  font-size: 24px;
}

.floor-title p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.theme-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.floor-content {
  padding: 24px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.main-product {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.main-product img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.main-product .product-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.buy-btn {
  background: #ff5722;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.buy-btn:hover {
  background: #f4511e;
}

.sub-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.sub-product-card {
  position: relative;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.sub-product-card:hover {
  transform: translateY(-4px);
}

.sub-product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 87, 34, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.recommendations-section {
  margin-bottom: 40px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recommendation-card .product-image {
  position: relative;
  padding-top: 100%;
}

.recommendation-card .product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 87, 34, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.recommendation-card .product-info {
  padding: 16px;
}

.recommendation-card .product-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommendation-card .product-desc {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommendation-card .product-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recommendation-card .current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff5722;
}

.recommendation-card .original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}
</style>
