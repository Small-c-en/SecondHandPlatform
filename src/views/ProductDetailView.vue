<template>
  <div class="product-detail-page">
    <TopNav />
    <div class="main-content">
      <!-- 商品标题，独占一行在最上方 -->
      <ProductTitle :title="product.title" class="page-main-title" />

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
    <DetailFixedNav />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import TopNav from '@/components/shared/TopNav.vue'
import Footer from '@/components/shared/Footer.vue'
import ProductImageCarousel from '@/components/product/ProductImageCarousel.vue'
import ProductTitle from '@/components/product/ProductTitle.vue'
import ProductDetailsCard from '@/components/product/ProductDetailsCard.vue'
import ProductDescription from '@/components/product/ProductDescription.vue'
import SellerInfoCard from '@/components/product/SellerInfoCard.vue'
import ProductReviewsSection from '@/components/product/ProductReviewsSection.vue'
import DetailFixedNav from '@/components/product/DetailFixedNav.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const showModal = inject('showModal')

// Mock product data - should come from API
const product = ref({
  id: route.params.id,
  title: '示例商品标题',
  images: [
    'https://via.placeholder.com/500x500',
    'https://via.placeholder.com/500x500',
    'https://via.placeholder.com/500x500',
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

  showModal({
    title: '添加成功',
    message: '商品已成功加入购物车',
    confirmText: '去购物车结算',
    cancelText: '继续购物',
    showCancelButton: true,
  }).then((confirmed) => {
    if (confirmed) {
      router.push('/cart')
    }
  })
}

const handleBuyNow = () => {
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.title,
    price: product.value.details.currentPrice,
    image: product.value.images[0],
    seller: product.value.seller,
  })
  router.push('/cart')
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

.page-main-title {
  margin-bottom: 20px;
}

.product-main-info-row {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.product-image-column {
  flex: 0 0 500px;
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
</style>
