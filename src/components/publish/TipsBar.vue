<template>
  <div class="tips-bar">
    <p>{{ currentTip }}</p>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'

// 简单示例，实际项目中可以根据当前表单焦点或步骤显示不同提示
const props = defineProps({
  currentFormStep: Number, // 可以从 PublishView 传入当前步骤
})

const currentTip = ref('提示：请确保所有必填项都已正确填写。')

const tipsByStep = {
  1: '提示：标题需包含核心关键词，分类要准确哦！',
  2: '提示：图片需清晰展示商品全貌，详细描述有助于成交！',
  3: '提示：请仔细核对所有信息，确认无误后即可发布。',
}

watch(
  () => props.currentFormStep,
  (newStep) => {
    currentTip.value = tipsByStep[newStep] || '提示：请规范填写商品信息。'
  },
  { immediate: true },
)

// 也可以根据具体字段的 focus/blur 事件来更新提示
</script>

<style scoped>
.tips-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff5e6; /* 浅橙色背景，更柔和些 */
  padding: 15px 20px;
  text-align: center;
  border-top: 1px solid #ffe0b3;
  z-index: 900;
}

.tips-bar p {
  margin: 0;
  color: #ff6f00; /* 橙色文字 */
  font-size: 14px;
}
</style>
