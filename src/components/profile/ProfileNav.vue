<template>
  <nav class="profile-nav">
    <button
      v-for="item in navItems"
      :key="item.name"
      :class="{ active: localActiveTab === item.name }"
      @click="selectTab(item.name)"
    >
      <!-- 使用真实图标或 SVG 代替 -->
      <span class="icon">{{ item.icon }}</span>
      <span class="text">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['navigate'])
const localActiveTab = ref('account') // 内部状态，与 ProfileView 同步

const navItems = ref([
  { name: 'account', label: '账户管理', icon: '⚙️' },
  { name: 'products', label: '商品管理', icon: '🏪' },
  { name: 'favorites', label: '我的收藏', icon: '❤️' },
  { name: 'history', label: '浏览足迹', icon: '👣' },
  { name: 'orders', label: '订单管理', icon: '🧾' },
  { name: 'settings', label: '设置', icon: '🔧' },
])

const selectTab = (tabName) => {
  localActiveTab.value = tabName
  emit('navigate', tabName)
}
</script>

<style scoped>
.profile-nav {
  display: flex;
  justify-content: space-around; /* 或者 flex-start 如果需要滑动 */
  background-color: #fff;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 20px;
  /* 如果支持左右滑动，需要 overflow-x: auto; 和 white-space: nowrap; 以及调整按钮宽度 */
}

.profile-nav button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555555; /* 深灰色文字 */
  transition: color 0.2s;
}

.profile-nav button .icon {
  font-size: 24px; /* 线性图标，emoji 占位 */
  margin-bottom: 4px;
}

.profile-nav button .text {
  font-size: 14px;
}

.profile-nav button.active {
  color: #ff6f00; /* 橙色 */
}

.profile-nav button.active .icon {
  /* 选中图标填充橙色 - 如果是SVG可以通过 fill 属性控制 */
}

.profile-nav button.active .text::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: #ff6f00; /* 橙色下划线 */
  margin-top: 4px;
}
</style>
