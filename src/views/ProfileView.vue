<template>
  <div class="profile-view-container">
    <TopNav />
    <div class="profile-view">
      <div class="profile-content">
        <div class="left-section">
          <UserInfoCard />
          <div class="nav-section">
            <button
              v-for="nav in navItems"
              :key="nav.value"
              :class="['nav-btn', { active: activeTab === nav.value }]"
              @click="handleNavigation(nav.value)"
            >
              <i :class="nav.icon"></i>
              {{ nav.label }}
            </button>
          </div>
        </div>
        <div class="right-section">
          <AccountManagement v-if="activeTab === 'account'" />
          <MyProducts v-if="activeTab === 'products'" />
          <MyFavorites v-if="activeTab === 'favorites'" />
          <BrowsingHistory v-if="activeTab === 'history'" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopNav from '../components/shared/TopNav.vue'
import Footer from '../components/shared/Footer.vue'
import UserInfoCard from '../components/profile/UserInfoCard.vue'
import AccountManagement from '../components/profile/AccountManagement.vue'
import MyFavorites from '../components/profile/MyFavorites.vue'
import BrowsingHistory from '../components/profile/BrowsingHistory.vue'
import MyProducts from '../components/product/MyProducts.vue'

const activeTab = ref('account')

const navItems = [
  { label: '账号管理', value: 'account', icon: 'fas fa-user-cog' },
  { label: '发布管理', value: 'products', icon: 'fas fa-store' },
  { label: '我的收藏', value: 'favorites', icon: 'fas fa-heart' },
  { label: '浏览足迹', value: 'history', icon: 'fas fa-history' },
]

const handleNavigation = (tabName) => {
  activeTab.value = tabName
}
</script>

<style scoped>
.profile-view-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nav-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  text-align: left;
}

.nav-btn i {
  width: 24px;
  font-size: 18px;
}

.nav-btn:hover {
  background: #fff5f2;
  color: #ff5722;
}

.nav-btn.active {
  background: #ff5722;
  color: white;
}

.right-section {
  min-height: 600px;
}
</style>
