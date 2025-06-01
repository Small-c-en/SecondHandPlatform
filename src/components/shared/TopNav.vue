<template>
  <nav class="top-nav">
    <div class="logo">
      <router-link to="/" class="logo-link">
        <div class="logo">
          <router-link to="/" class="logo-link">
            <div class="logo-icon">
              <i class="fas fa-recycle"></i>
              <i class="fas fa-shopping-cart"></i>
            </div>
            <span>二手平台</span>
          </router-link>
        </div>
      </router-link>
    </div>

    <div class="search-bar">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="手机、家电、服饰..."
          @keyup.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          :class="{ active: searchQuery.trim() }"
          :disabled="!searchQuery.trim()"
        >
          <i class="fas fa-search"></i>
          搜索
        </button>
      </div>
    </div>

    <div class="user-actions">
      <div class="cart-container" @click="goToCart">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-text">购物车</span>
        <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
      </div>

      <div class="message-container" @click="goToMessageCenter">
        <i class="fas fa-envelope"></i>
        <span class="notifications">消息</span>
      </div>

      <div class="user-profile">
        <div class="user-avatar-container" @mouseenter="showUserMenu = true">
          <div class="avatar-frame">
            <img :src="userAvatar" :alt="userName" class="user-avatar" />
          </div>
          <span class="user-name">{{ userName }}</span>
        </div>

        <div
          v-show="showUserMenu"
          class="user-menu"
          @mouseenter="showUserMenu = true"
          @mouseleave="showUserMenu = false"
        >
          <div class="menu-header">
            <img :src="userAvatar" :alt="userName" class="menu-avatar" />
            <div class="menu-user-info">
              <span class="menu-user-name">{{ userName }}</span>
              <span class="menu-user-id">ID: {{ userId }}</span>
            </div>
          </div>

          <div class="menu-items">
            <router-link to="/profile" class="menu-item">
              <i class="fas fa-user"></i>
              个人信息
            </router-link>
            <router-link to="/orders" class="menu-item">
              <i class="fas fa-clipboard-list"></i>
              我的订单
            </router-link>
            <router-link to="/cart" class="menu-item">
              <i class="fas fa-shopping-cart"></i>
              购物车
              <span v-if="cartItemCount > 0" class="menu-badge">{{ cartItemCount }}</span>
            </router-link>
            <router-link to="/publish" class="menu-item">
              <i class="fas fa-upload"></i>
              发布商品
            </router-link>
            <router-link to="/my-products" class="menu-item">
              <i class="fas fa-store"></i>
              发布管理
            </router-link>
            <a href="#" class="menu-item" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
              退出登录
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()
const searchQuery = ref('')
const showUserMenu = ref(false)
const showModal = inject('showModal')

// Mock user data - should come from your auth system
const userName = ref('用户名')
const userId = ref('12345678')
const userAvatar = ref(
  'https://tse2-mm.cn.bing.net/th/id/OIP-C.z9MGiUP8XyI3R2DB3dT3tAHaHa?w=203&h=203&c=7&r=0&o=5&dpr=1.5&pid=1.7',
)

// Get cart count from store
const cartItemCount = computed(() => cartStore.totalQuantity)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/productsList',
      query: { search: searchQuery.value.trim() },
    })
  }
}

const goToCart = () => {
  router.push('/cart')
}

const goToMessageCenter = () => {
  router.push('/message-center')
}

const handleLogout = () => {
  // Show confirmation modal before logout
  showModal({
    title: '退出确认',
    message: '确定要退出登录吗？',
    confirmText: '确定退出',
    cancelText: '取消',
    onConfirm: () => {
      // Clear user data and cart
      cartStore.clearCart()
      // Redirect to login page
      router.push('/login')
    },
  })
}
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo-link {
  text-decoration: none;
  color: #ff6f00;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  position: relative;
  width: 32px;
  color: #ff5722;
  height: 32px;
}

.logo-icon i {
  position: absolute;
  color: #ff5722;
  font-size: 20px;
}

.logo-icon .fa-recycle {
  top: 0;
  color: #ff5722;
  left: 0;
  transform: scale(1.2);
  transform: rotate(-30deg);
}

.logo-icon .fa-shopping-cart {
  bottom: 0;
  right: 0;
  transform: scale(0.9);
}
.search-bar {
  flex-grow: 0;
  width: 400px;
  margin: 0 20px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input-wrapper input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input-wrapper input:focus {
  border-color: #ff6f00;
  box-shadow: 0 0 0 2px rgba(255, 111, 0, 0.1);
}

.search-input-wrapper button {
  padding: 8px 24px;
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input-wrapper button.active {
  background-color: #ff6f00;
  border-color: #ff6f00;
  color: white;
}

.search-input-wrapper button.active:hover {
  background-color: #f26100;
}

.search-input-wrapper button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.cart-container {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #131212a1;
  transition: all linear 0.3s;
  &:hover {
    color: #ff5722;
    .fas {
      color: #f26100;
    }
  }
}

.cart-text {
  font-size: 14px;
}

.avatar-frame {
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    border-color: #ff5622d5;
  }
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-container {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s linear;
  font-size: 15px;
  color: #131212a1;
  &:hover {
    color: #ff5722;
  }
}

.user-profile {
  position: relative;
  cursor: pointer;
}

.user-avatar-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 240px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 12px;
  padding: 16px 0;
  z-index: 9999;
}

.menu-header {
  padding: 0 16px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.menu-user-info {
  display: flex;
  flex-direction: column;
}

.menu-user-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.menu-user-id {
  font-size: 12px;
  color: #666;
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #3e3b3bd8;
  text-decoration: none;
  gap: 8px;
  position: relative;
  transition: all linear 0.3s;
}

.menu-item:hover {
  color: #ff5722;
  background: #fff5f2;
}

.menu-badge {
  position: absolute;
  right: 16px;
  background-color: #ff4444;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

/* Font Awesome icons styling */
.fas {
  font-size: 18px;
  transition: all linear 0.3s;
  /* color: #ff7c44ca; */
  margin-right: 5px;
}

.menu-item .fas {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-logo {
  height: 32px;
  width: auto;
  margin-right: 8px;
}
</style>
