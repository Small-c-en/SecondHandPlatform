<template>
  <div class="product-detail-page">
    <TopNav />
    <div class="main-content">
      <div class="page-header">
        <el-button :icon="ArrowLeftBold" circle @click="handleBack" class="back-button" />
        <!-- 商品标题，独占一行在最上方 -->
        <ProductTitle :title="product.title" class="page-main-title" />
      </div>

      <!-- 商品核心信息行 -->
      <div class="product-main-info-row">
        <div class="product-image-column">
          <ProductImageCarousel :images="product.images" />
        </div>
        <div class="product-details-content-column">
          <ProductDescription :description="product.description" class="description-section" />
          <ProductDetailsCard :product="product.details" class="params-section" />

          <div class="price-display-external">
            <span class="current-price">¥{{ product.details.currentPrice || '0.00' }}</span>
            <span class="original-price">¥{{ product.details.originalPrice || '0.00' }}</span>
          </div>
          <div class="actions-footer-external">
            <button class="action-button add-to-cart" @click="handleAddToCart">
              <i class="fas fa-shopping-cart"></i>
              加入购物车
            </button>
            <button class="action-button buy-now" @click="handleBuyNow">
              <i class="fas fa-bolt"></i>
              立即购买
            </button>
          </div>
        </div>
      </div>

      <SellerInfoCard :seller="product.seller" class="full-width-card" />
      <ProductReviewsSection :reviews="product.reviews" class="full-width-card" />
    </div>
    <Footer />
    <DetailFixedNav @share="showShareDialog = true" @back="handleBack" />

    <!-- 分享弹窗 -->
    <ShareDialog
      v-model="showShareDialog"
      :product-title="product.title"
      :product-price="product.details.currentPrice"
      :product-image="product.images[0]"
    />

    <!-- 加入购物车成功提示 -->
    <el-dialog
      v-model="showCartDialog"
      title="加入购物车成功"
      width="360px"
      :show-close="true"
      class="cart-success-dialog"
    >
      <div class="cart-success-content">
        <div class="cart-product-info">
          <img :src="product.images[0]" :alt="product.title" class="cart-product-image" />
          <div class="cart-product-details">
            <h4>{{ product.title }}</h4>
            <p class="cart-product-price">¥{{ product.details.currentPrice }}</p>
          </div>
        </div>
        <div class="cart-actions">
          <el-button @click="showCartDialog = false">继续购物</el-button>
          <el-button type="primary" @click="goToCart">去购物车结算</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import TopNav from '@/components/shared/TopNav.vue'
import Footer from '@/components/shared/Footer.vue'
import ProductImageCarousel from '@/components/product/ProductImageCarousel.vue'
import ProductTitle from '@/components/product/ProductTitle.vue'
import ProductDetailsCard from '@/components/product/ProductDetailsCard.vue'
import ProductDescription from '@/components/product/ProductDescription.vue'
import SellerInfoCard from '@/components/product/SellerInfoCard.vue'
import ProductReviewsSection from '@/components/product/ProductReviewsSection.vue'
import DetailFixedNav from '@/components/product/DetailFixedNav.vue'
import ShareDialog from '@/components/shared/ShareDialog.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const showShareDialog = ref(false)
const showCartDialog = ref(false)

// Mock product data - should come from API
const product = ref({
  id: route.params.id,
  title: '示例商品标题',
  images: [
    'https://tse2-mm.cn.bing.net/th/id/OIP-C.yunYpx6nnxDzPIFM78esHgHaE8?w=251&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.t3dzgZlPAZVJLe44wDlT1AHaEK?w=299&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.FaoGRPwmwb5pC6xEK1RqiQHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.FaoGRPwmwb5pC6xEK1RqiQHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.FaoGRPwmwb5pC6xEK1RqiQHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.FaoGRPwmwb5pC6xEK1RqiQHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.FaoGRPwmwb5pC6xEK1RqiQHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.FaoGRPwmwb5pC6xEK1RqiQHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7',
  ],
  description: '这是一个示例商品描述...',
  details: {
    currentPrice: '299.00',
    originalPrice: '399.00',
    condition: '9成新',
    category: '电子产品',
    brand: '示例品牌',
  },
  seller: {
    id: 'seller123',
    name: '示例卖家',
    avatar: 'https://via.placeholder.com/100',
    rating: 4.8,
  },
  reviews: [],
})

const handleAddToCart = () => {
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.title,
    price: product.value.details.currentPrice,
    image: product.value.images[0],
    seller: product.value.seller,
  })
  showCartDialog.value = true
}

const handleBuyNow = () => {
  // 添加到购物车并直接跳转到订单页面
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.title,
    price: product.value.details.currentPrice,
    image: product.value.images[0],
    seller: product.value.seller,
  })

  router.push({
    path: '/orderDetail/order1-topay',
    query: {
      products: [product.value.id],
      type: 'buy_now',
    },
  })
}

const goToCart = () => {
  showCartDialog.value = false
  router.push('/cart')
}

const handleBack = () => {
  router.push('/products')
}

onMounted(() => {
  // Fetch product data based on route.params.id
  console.log('Fetching product data for ID:', route.params.id)
})
</script>

<style scoped>
.product-detail-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  position: relative;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.back-button {
  border: 1px solid #e0e0e0;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  border-color: #ff6f00;
  background-color: #fff7f2;
  color: #ff6f00;
}

.page-main-title {
  margin-bottom: 0;
  flex: 1;
}

.product-main-info-row {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  position: relative;
  min-height: 500px;
  overflow: visible;
}

.product-image-column {
  flex: 0 0 500px;
  position: relative;
}

.product-details-content-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.description-section {
  margin-bottom: 20px;
}

.params-section {
  margin-bottom: 30px;
}

.price-display-external {
  margin-bottom: 20px;
}

.current-price {
  font-size: 24px;
  color: #ff6f00;
  font-weight: bold;
  margin-right: 10px;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.actions-footer-external {
  display: flex;
  gap: 15px;
}

.action-button {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.add-to-cart {
  background-color: #fff0e6;
  color: #ff6f00;
  border: 1px solid #ff6f00;
}

.add-to-cart:hover {
  background-color: #ffe4cc;
}

.buy-now {
  background-color: #ff6f00;
  color: white;
}

.buy-now:hover {
  background-color: #f26100;
}

.full-width-card {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cart-success-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.cart-success-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-product-info {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
}

.cart-product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.cart-product-details {
  flex: 1;
}

.cart-product-details h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.cart-product-price {
  margin: 0;
  color: #ff6f00;
  font-size: 16px;
  font-weight: bold;
}

.cart-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
