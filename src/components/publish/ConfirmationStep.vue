<template>
  <div class="confirmation-step">
    <h4>商品信息汇总</h4>
    <div class="summary-section">
      <p><strong>标题:</strong> {{ formData.basicInfo?.title || '未填写' }}</p>
      <p><strong>分类:</strong> {{ formData.basicInfo?.category || '未填写' }}</p>
      <p><strong>价格:</strong> ¥{{ formData.basicInfo?.price || '0.00' }}</p>
      <p><strong>原价:</strong> ¥{{ formData.basicInfo?.originalPrice || 'N/A' }}</p>
      <p><strong>新旧程度:</strong> {{ formData.basicInfo?.condition || '未选择' }}</p>
      <p><strong>地区:</strong> {{ formData.basicInfo?.location || '未填写' }}</p>
      <p><strong>描述:</strong> {{ formData.detailedInfo?.description || '未填写' }}</p>
      <!-- 可以添加品牌、型号等 -->
    </div>
    <div class="image-summary">
      <h5>商品图片:</h5>
      <div v-if="formData.images?.length" class="preview-gallery">
        <img
          v-for="(image, index) in formData.images"
          :key="index"
          :src="image.url"
          :alt="image.name"
        />
      </div>
      <p v-else>未上传图片</p>
    </div>
    <div class="actions">
      <button class="btn-secondary" @click="$emit('go-back')">返回修改</button>
      <button class="btn-primary" @click="submit">发布商品</button>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <p>发布中...</p>
      <!-- 简单加载提示 -->
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({ formData: Object })
const emit = defineEmits(['go-back', 'submit-publish'])

const isLoading = ref(false)

const submit = async () => {
  isLoading.value = true
  // 实际API调用
  // await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟网络延迟
  emit('submit-publish')
  // isLoading.value = false; // 成功后跳转，这个可能不需要了
}
</script>

<style scoped>
.confirmation-step {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.confirmation-step h4 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.summary-section p {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #555;
}

.summary-section p strong {
  color: #333;
  min-width: 80px; /* 对齐标签 */
  display: inline-block;
}

.image-summary {
  margin-top: 20px;
}

.image-summary h5 {
  font-size: 16px;
  margin-bottom: 10px;
}

.preview-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-gallery img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.actions button {
  padding: 10px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.btn-primary {
  background-color: #ff6f00; /* 橙色按钮 */
  color: white;
  border: none;
}

.btn-secondary {
  background-color: #6c757d; /* 灰色按钮 */
  color: white;
  border: none;
}

.loading-overlay {
  position: fixed; /* 或 absolute 相对于父容器 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-overlay p {
  font-size: 18px;
  color: #333;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
