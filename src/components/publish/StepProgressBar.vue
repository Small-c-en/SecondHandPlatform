<template>
  <div class="step-progress-bar">
    <div
      v-for="step in totalSteps"
      :key="step"
      class="step"
      :class="{
        active: step === currentStep,
        completed: step < currentStep || (step === totalSteps && currentStep === totalSteps),
      }"
    >
      <div class="step-indicator">
        <div class="step-number">{{ step }}</div>
      </div>
      <div class="step-label">{{ getStepLabel(step) }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// props are used implicitly in the template when defined with defineProps
// No need to assign to a variable like 'const props = defineProps(...)'
defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
})

const getStepLabel = (stepNumber) => {
  const labels = ['基础信息', '详细描述', '确认发布']
  return labels[stepNumber - 1] || `步骤 ${stepNumber}`
}
</script>

<style scoped>
.step-progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to the top for label positioning */
  margin-bottom: 30px;
  padding-top: 15px; /* 与 PublishNav 的间距 */
  position: relative; /* For the main connecting line if needed as a single element */
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #adb5bd; /* 未完成步骤的标签默认颜色 */
  flex: 1;
  position: relative; /* For the pseudo-elements for lines */
}

.step-indicator {
  position: relative;
  z-index: 2; /* 确保指示器在连接线之上 */
}

.step-number {
  width: 70px;
  height: 70px;
  font-size: 25px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #adb5bd; /* 未完成步骤的数字默认边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition:
    background-color 0.3s,
    border-color 0.3s,
    color 0.3s;
  color: #adb5bd; /* 未完成步骤的数字默认颜色 */
}

.step-label {
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
}

/* 每个步骤（第一个除外）之前的连接线 */
.step:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 35px; /* 与步骤数字的中心对齐 */
  right: 50%; /* 从当前步骤的中心开始向左延伸 */
  width: 100%; /* 延伸到上一个步骤 */
  height: 4px;
  background-color: #dee2e6; /* 默认连接线颜色 */
  z-index: 1; /* 在步骤数字之后 */
}

/* 第一个步骤没有前置连接线 */
.step:first-child::before {
  display: none;
}

/* 已完成步骤的样式 */
.step.completed .step-number {
  border-color: #a7d7c5; /* 浅绿色 - 已完成 */
  background-color: #a7d7c5;
  color: #fff;
}
.step.completed .step-label {
  color: #a7d7c5; /* 浅绿色 */
}
/* 已完成步骤（第一个除外）之前的连接线 */
.step.completed:not(:first-child)::before {
  background-color: #a7d7c5; /* 浅绿色连接线 */
}

/* 当前激活步骤的样式 */
.step.active .step-number {
  border-color: #a0cfff; /* 浅蓝色 - 当前激活 */
  background-color: #a0cfff;
  color: #fff;
}
.step.active .step-label {
  color: #a0cfff; /* 浅蓝色 */
  font-weight: bold;
}
/* 当前激活步骤（第一个除外）之前的连接线应为已完成状态 */
.step.active:not(:first-child)::before {
  background-color: #a7d7c5; /* 浅绿色连接线 */
}

/* 如果当前激活的步骤也是最后一个步骤（即已完成），确保其之前的连接线是浅绿色 */
.step.active.completed:not(:first-child)::before {
  background-color: #a7d7c5;
}
</style>
