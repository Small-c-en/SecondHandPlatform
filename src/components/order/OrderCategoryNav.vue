<template>
  <div class="order-category-nav-wrapper">
    <div class="order-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="selectTab(tab.id)"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="order-search">
      <input
        type="text"
        v-model="searchTerm"
        @keyup.enter="performSearch"
        placeholder="订单号 / 商品名称"
        class="search-input"
      />
      <button @click="performSearch" class="search-button">搜索</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const tabs = ref([
  { id: 'topay', name: '待付款' },
  { id: 'toship', name: '待发货' },
  { id: 'toreceive', name: '待收货' },
  { id: 'completed', name: '已完成' },
  { id: 'cancelled', name: '已取消' },
])

const activeTab = ref('topay') // Default active tab
const searchTerm = ref('')

// 定义组件可以发出的事件
const emit = defineEmits(['tab-selected', 'search-orders'])

const selectTab = (tabId) => {
  activeTab.value = tabId
  emit('tab-selected', tabId)
}

const performSearch = () => {
  emit('search-orders', searchTerm.value.trim())
  // searchTerm.value = '' // 可选：搜索后清空输入框
}
</script>

<style scoped>
.order-category-nav-wrapper {
  position: sticky; /* Fixed at the top */
  top: 60px; /* Assuming TopNav is 60px high, adjust if necessary */
  z-index: 990;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff; /* White background */
  border-bottom: 1px solid #eee; /*浅灰色分割线*/
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-tabs {
  display: flex;
  gap: 10px;
}

.tab-button {
  padding: 8px 16px;
  border: none;
  background-color: transparent;
  color: #666; /* 灰色文字 for unselected */
  font-size: 15px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.tab-button.active {
  background-color: #007bff; /* 蓝色背景 for selected */
  color: white; /* 白色文字 for selected */
}

.tab-button:hover:not(.active) {
  background-color: #f0f0f0;
}

.order-search {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-button {
  padding: 8px 15px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 0 4px 4px 0;
  margin-left: -1px; /* To make the border overlap nicely */
  cursor: pointer;
  font-size: 14px;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
