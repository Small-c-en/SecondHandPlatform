<template>
  <div class="cart-page">
    <!-- 假设已有 TopNav 组件 -->
    <TopNav />
    <TopActionBar
      :select-all-state="isAllSelected"
      @update:selectAllState="handleSelectAll"
      @delete-selected="handleDeleteSelected"
      @move-to-favorites="handleMoveToFavorites"
      @merge-checkout="handleMergeCheckout"
    />

    <div class="cart-content-area">
      <div v-if="isLoading" class="loading-cart">
        <div class="spinner"></div>
        <p>正在加载购物车...</p>
      </div>
      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <img src="https://placekitten.com/150/150" alt="购物车为空" class="empty-cart-img" />
        <p>购物车还是空的，快去挑选喜欢的商品吧！</p>
        <button @click="goToShopping" class="go-shopping-btn">去逛逛</button>
      </div>
      <div v-else class="cart-items-list">
        <CartItemCard
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
          @update:selected="toggleItemSelection(item.id, $event)"
          @update:quantity="updateItemQuantity"
          @delete-item="deleteSingleItem"
        />
      </div>

      <PromotionArea
        v-if="cartItems.length > 0"
        :promotions="activePromotions"
        @view-all-promos="showAllPromotionsModal"
      />
    </div>

    <PriceSummaryBar
      v-if="cartItems.length > 0"
      :total-price="totalPrice"
      :total-discount="totalDiscount"
      :selected-item-count="selectedItemsCount"
      :checkout-disabled="selectedItemsCount === 0"
      @checkout="handleCheckout"
    />
    <BottomTipsBar v-if="cartItems.length > 0" :tips="checkoutTips" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import TopActionBar from '@/components/cart/TopActionBar.vue'
import CartItemCard from '@/components/cart/CartItemCard.vue'
import PromotionArea from '@/components/cart/PromotionArea.vue'
import PriceSummaryBar from '@/components/cart/PriceSummaryBar.vue'
import BottomTipsBar from '@/components/cart/BottomTipsBar.vue'
import TopNav from '@/components/shared/TopNav.vue'

const router = useRouter()
const showModal = inject('showModal') // For global modal

const isLoading = ref(true)
const cartItems = ref([]) // Array of item objects { id, name, ..., quantity, selected }

// Mock Promotions
const allPromotions = reactive([
  {
    id: 'promo1',
    description: '满1件享9折',
    type: 'percentage',
    threshold: 1,
    value: 0.1,
    applicable: (items) => items.length >= 1,
  },
  {
    id: 'promo2',
    description: '满100元减10元',
    type: 'fixed',
    threshold: 100,
    value: 10,
    applicable: (total) => total >= 100,
  },
  {
    id: 'promo3',
    description: '指定商品第二件半价',
    type: 'special',
    itemIds: ['prod-cart-2'],
    value: 0.5,
    applicable: (items) => items.some((item) => item.id === 'prod-cart-2' && item.quantity >= 2),
  },
  {
    id: 'promo4',
    description: '新用户专享平台券抵扣5元',
    type: 'coupon',
    value: 5,
    applicable: () => true,
  }, // Assuming new user
])

const activePromotions = computed(() => {
  const selected = cartItems.value.filter((item) => item.selected)
  const currentTotalPrice = selected.reduce(
    (sum, item) => sum + parseFloat(item.currentPrice) * item.quantity,
    0,
  )
  return allPromotions
    .filter((promo) => {
      if (promo.type === 'fixed') return promo.applicable(currentTotalPrice)
      if (promo.type === 'percentage') return promo.applicable(selected)
      if (promo.type === 'special') return promo.applicable(selected)
      if (promo.type === 'coupon') return promo.applicable()
      return false
    })
    .map((p) => ({
      description: p.description,
      amount: calculateDiscountForItem(p, selected, currentTotalPrice),
    }))
})

const calculateDiscountForItem = (promo, selectedItems, currentTotalPrice) => {
  if (promo.type === 'percentage') return currentTotalPrice * promo.value
  if (promo.type === 'fixed' && currentTotalPrice >= promo.threshold) return promo.value
  if (promo.type === 'coupon') return promo.value
  if (promo.type === 'special' && promo.itemIds) {
    const specialItem = selectedItems.find((i) => promo.itemIds.includes(i.id) && i.quantity >= 2)
    if (specialItem) return parseFloat(specialItem.currentPrice) * promo.value
  }
  return 0
}

const checkoutTips = ref([
  '商品价格信息仅供参考，最终价格以结算页为准。',
  '优惠活动和优惠券的可用性及具体规则请在结算时确认。',
  '请在提交订单前仔细核对商品信息、数量、收货地址等。',
])

const imageUrlArr = [
  'https://tse4-mm.cn.bing.net/th/id/OIP-C.u7j5hb9TMOhV872ccIYCrAHaD_?w=287&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',

  'https://tse2-mm.cn.bing.net/th/id/OIP-C.qG95FMXqqCOxOjiLJfxEuwHaD4?w=334&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',

  'https://tse1-mm.cn.bing.net/th/id/OIP-C.AohnGW4oyTiGIfjuc9GTaAHaFj?w=232&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',

  'https://tse3-mm.cn.bing.net/th/id/OIP-C.jGJYrrNqfoghfn_y90e01QHaEK?w=291&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',

  'https://imgslim.geekpark.net/uploads/image/file/49/65/496540728e3c9b06343080516d795466.png',

  'https://tse3-mm.cn.bing.net/th/id/OIP-C.-q-QFg2bYQUBubNgc5DW_gHaEK?w=288&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
]

// --- Mock Data Generation ---
const generateMockCartItems = (count = 3) => {
  const items = []
  const sampleNames = [
    '精选品牌连衣裙',
    '高性能无线鼠标',
    '经典文学名著套装',
    '便携式咖啡机',
    '户外运动冲锋衣',
  ]
  const conditions = ['全新', '9成新', '几乎全新']

  for (let i = 1; i <= count; i++) {
    const currentPrice = parseFloat((Math.random() * 200 + 50).toFixed(2))
    const originalPrice =
      Math.random() > 0.4
        ? parseFloat((currentPrice * (1 + Math.random() * 0.3 + 0.2)).toFixed(2))
        : null
    items.push({
      id: `prod-cart-${i}`,
      imageUrl: imageUrlArr[i], //`https://via.placeholder.com/120x120/FFE0B2/FF6F00?text=商品${i}`
      name: `${sampleNames[i % sampleNames.length]} - ${i % 2 === 0 ? '特惠款' : '热销中'}`,
      conditionTag: conditions[i % conditions.length],
      currentPrice: currentPrice.toFixed(2),
      originalPrice: originalPrice ? originalPrice.toFixed(2) : null,
      quantity: Math.floor(Math.random() * 3) + 1,
      selected: i % 2 === 0, // Pre-select some items
      // Potentially add stock, sellerId etc.
    })
  }
  return items
}
console.log(generateMockCartItems())
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    cartItems.value = generateMockCartItems(5)
    isLoading.value = false
  }, 1000)
})

// --- Selection Logic ---
const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every((item) => item.selected)
})

const selectedItemsCount = computed(() => {
  return cartItems.value.filter((item) => item.selected).length
})

const handleSelectAll = (shouldSelectAll) => {
  cartItems.value.forEach((item) => (item.selected = shouldSelectAll))
}

const toggleItemSelection = (itemId, isSelected) => {
  const item = cartItems.value.find((i) => i.id === itemId)
  if (item) {
    item.selected = isSelected
  }
}

// --- Quantity Logic ---
const updateItemQuantity = ({ id, quantity }) => {
  const item = cartItems.value.find((i) => i.id === id)
  if (item) {
    item.quantity = quantity
  }
}

// --- Price Calculation ---
const totalPrice = computed(() => {
  return cartItems.value
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + parseFloat(item.currentPrice) * item.quantity, 0)
})

const totalDiscount = computed(() => {
  const selected = cartItems.value.filter((item) => item.selected)
  const currentTotalPrice = selected.reduce(
    (sum, item) => sum + parseFloat(item.currentPrice) * item.quantity,
    0,
  )

  let discount = 0
  activePromotions.value.forEach((promo) => {
    // This is a simplified sum; real scenarios might have non-stackable promos
    discount += promo.amount || 0
  })
  // Ensure discount doesn't exceed total price
  return Math.min(discount, currentTotalPrice)
})

// --- Action Handlers ---
const handleDeleteSelected = async () => {
  if (selectedItemsCount.value === 0) {
    showModal({ title: '提示', message: '请先选择要删除的商品。' })
    return
  }
  const confirmed = await showModal({
    title: '确认删除',
    message: `确定要删除选中的 ${selectedItemsCount.value} 件商品吗？`,
    showCancelButton: true,
  })
  if (confirmed) {
    cartItems.value = cartItems.value.filter((item) => !item.selected)
    showModal({ title: '成功', message: '选中的商品已删除。' })
  }
}

const deleteSingleItem = async (itemId) => {
  const item = cartItems.value.find((i) => i.id === itemId)
  const confirmed = await showModal({
    title: '确认删除',
    message: `确定要删除商品 " ${item?.name?.substring(0, 20)}..." 吗？`,
    showCancelButton: true,
  })
  if (confirmed) {
    cartItems.value = cartItems.value.filter((item) => item.id !== itemId)
    showModal({ title: '成功', message: '商品已删除。' })
  }
}

const handleMoveToFavorites = async () => {
  if (selectedItemsCount.value === 0) {
    showModal({ title: '提示', message: '请先选择要移至收藏的商品。' })
    return
  }
  const confirmed = await showModal({
    title: '移至收藏',
    message: `确定要将选中的 ${selectedItemsCount.value} 件商品移至收藏夹吗？`,
    showCancelButton: true,
  })
  if (confirmed) {
    // Here you would typically call an API to move items
    // For mock, we'll just remove them from cart as if moved
    cartItems.value = cartItems.value.filter((item) => !item.selected)
    showModal({ title: '成功', message: '选中的商品已移至收藏夹。' })
  }
}

const handleMergeCheckout = () => {
  if (selectedItemsCount.value === 0) {
    showModal({ title: '提示', message: '请选择要结算的商品。' })
    return
  }
  // Navigate to order confirmation page or similar
  showModal({
    title: '提示',
    message: `准备结算 ${selectedItemsCount.value} 件商品，总计 ¥${totalPrice.value.toFixed(2)} (已优惠 ¥${totalDiscount.value.toFixed(2)})。此功能待开发。`,
  })
  // router.push('/order-confirmation');
}

const handleCheckout = () => {
  handleMergeCheckout() // Same logic for now
}

const showAllPromotionsModal = () => {
  // Construct a more detailed message for the modal
  let promoDetails = '可应用的优惠活动：\n\n'
  if (activePromotions.value.length > 0) {
    activePromotions.value.forEach((p) => {
      promoDetails += `- ${p.description}`
      if (p.amount) promoDetails += ` (预计可减 ¥${p.amount.toFixed(2)})`
      promoDetails += '\n'
    })
  } else {
    promoDetails = '当前选中的商品暂无额外优惠活动。'
  }

  showModal({
    title: '全部优惠详情',
    message: promoDetails,
    isHtml: true, // Allow newline char to render
  })
}

const goToShopping = () => {
  router.push('/productsList') // Or your main product listing page
}
</script>

<style scoped>
.cart-page {
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  padding-left: 40px; /* 添加左边距 */
  padding-right: 40px; /* 添加右边距 */
}

.cart-content-area {
  flex-grow: 1;
  padding-bottom: 150px; /* Space for fixed bottom bars (PriceSummaryBar + BottomTipsBar) */
  /* TopActionBar height 60px, PriceSummaryBar 70px, BottomTipsBar ~50px */
}

.loading-cart,
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #777;
}

.empty-cart-img {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-cart p {
  font-size: 16px;
  margin-bottom: 25px;
}

.go-shopping-btn {
  background-color: #ff6f00;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.go-shopping-btn:hover {
  background-color: #e66000;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #ff6f00; /* Orange accent */
  animation: spin 1s ease infinite;
  margin: 0 auto 15px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cart-items-list {
  /* Styles for the list itself, if any, beyond item cards */
}

/* Ensure content doesn't get hidden by fixed bars */
.cart-page {
  padding-top: 60px; /* Height of TopActionBar */
  /* padding-bottom will be handled by specific components or a wrapper if needed */
}
:deep(.top-action-bar) {
  position: fixed; /* Changed from sticky to fixed for better cross-browser compatibility */
  top: 65px;
  left: 0;
  right: 0;
  background-color: #fff; /* Ensure it has a background */
  z-index: 50; /* Higher than content, lower than modals */
}

:deep(.price-summary-bar) {
  position: fixed; /* Ensure it's fixed at the bottom */
  left: 0;
  right: 0;
  bottom: 80px;
  background-color: #fff;
  z-index: 50;
}

:deep(.bottom-tips-bar) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  z-index: 50;
}

/* Add padding to the main content area to prevent overlap with fixed bars */
.cart-content-area {
  padding-top: 10px; /* Small gap below top action bar */
  /* padding-bottom is dynamically adjusted or can be set to PriceSummaryBar + BottomTipsBar height */
  /* Total approx height: PriceSummaryBar (70px) + BottomTipsBar (around 40-50px) = ~120px */
  padding-bottom: calc(70px + 50px + 20px); /* Heights + some margin */
}
</style>

import TopNav from '@/components/shared/TopNav.vue' // 假设组件路径
