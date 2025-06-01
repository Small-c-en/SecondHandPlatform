<template>
  <div class="top-action-bar">
    <div class="select-all-section">
      <input
        type="checkbox"
        id="select-all-cart"
        v-model="internalSelectAll"
        @change="onSelectAllChange"
      />
      <label for="select-all-cart">全选</label>
    </div>
    <div class="actions-section">
      <button class="action-button" @click="$emit('delete-selected')">删除</button>
      <button class="action-button" @click="$emit('move-to-favorites')">移至收藏</button>
      <button class="action-button primary-action" @click="$emit('merge-checkout')">
        合并结算
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectAllState: {
    // 父组件控制的全选状态
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:selectAllState',
  'delete-selected',
  'move-to-favorites',
  'merge-checkout',
])

const internalSelectAll = ref(props.selectAllState)

watch(
  () => props.selectAllState,
  (newState) => {
    internalSelectAll.value = newState
  },
)

const onSelectAllChange = () => {
  emit('update:selectAllState', internalSelectAll.value)
}
</script>

<style scoped>
.top-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff; /* 白色背景 */
  border-bottom: 1px solid #f0f0f0; /* 浅灰色分隔线 */
  position: sticky;
  top: -100px; /* 固定在顶部，上移100px */
  z-index: -1;
  height: 60px; /* Define a fixed height */
  box-sizing: border-box;
}

.select-all-section {
  display: flex;
  align-items: center;
}

.select-all-section input[type='checkbox'] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.select-all-section label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.actions-section {
  display: flex;
  gap: 15px;
}

.action-button {
  padding: 8px 15px;
  border: 1px solid #ccc; /* 灰色边框 */
  background-color: #fff; /* 白色背景 */
  color: #555; /* 深灰色文字 */
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.action-button:hover {
  background-color: #f9f9f9; /* 鼠标悬停时背景色变浅 */
  border-color: #bbb;
}

.action-button.primary-action {
  background-color: #ff6f00; /* 橙色背景 */
  color: #fff; /* 白色文字 */
  border-color: #ff6f00;
}

.action-button.primary-action:hover {
  background-color: #e66000; /* 鼠标悬停时橙色加深 */
  border-color: #e66000;
}
</style>
