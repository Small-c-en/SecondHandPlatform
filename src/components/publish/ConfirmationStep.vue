<template>
  <div class="confirmation-step">
    <div class="preview-card">
      <h3>商品预览</h3>
      <div class="preview-content">
        <div class="preview-images">
          <el-carousel :interval="4000" type="card" height="300px">
            <el-carousel-item v-for="(image, index) in formData.images" :key="index">
              <img :src="image.url" :alt="`商品图片${index + 1}`" />
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="preview-info">
          <h2 class="product-title">{{ formData.basicInfo.title }}</h2>

          <div class="price-section">
            <div class="current-price">
              <span class="label">售价：</span>
              <span class="price">¥{{ formData.basicInfo.price }}</span>
            </div>
            <div class="original-price" v-if="formData.basicInfo.originalPrice">
              <span class="label">原价：</span>
              <span class="price">¥{{ formData.basicInfo.originalPrice }}</span>
            </div>
          </div>

          <div class="tags-section">
            <el-tag v-if="formData.basicInfo.condition" :type="getConditionTagType">
              {{ getConditionLabel(formData.basicInfo.condition) }}
            </el-tag>
            <el-tag v-for="tag in formData.basicInfo.customTags" :key="tag" type="warning">
              {{ tag }}
            </el-tag>
            <el-tag type="info" v-if="formData.detailedInfo.inspection === 'needed'">
              提供验机
            </el-tag>
          </div>

          <div class="info-section">
            <h3>基础信息</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="商品标题">
                {{ formData.basicInfo.title }}
              </el-descriptions-item>
              <el-descriptions-item label="商品分类">
                {{ formData.basicInfo.categoryLabels?.join(' / ') }}
              </el-descriptions-item>
              <el-descriptions-item label="商品价格">
                <div class="price-info">
                  <span class="current-price">¥{{ formData.basicInfo.price }}</span>
                  <span v-if="formData.basicInfo.originalPrice" class="original-price">
                    原价: ¥{{ formData.basicInfo.originalPrice }}
                  </span>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="商品成色">
                {{ formData.basicInfo.condition }}成新
              </el-descriptions-item>
              <el-descriptions-item label="发布状态">
                {{ formData.basicInfo.publishStatus === 2 ? '立即发布' : '保存草稿' }}
              </el-descriptions-item>
              <el-descriptions-item label="商品标签" v-if="formData.basicInfo.customTags?.length">
                <el-tag
                  v-for="tag in formData.basicInfo.customTags"
                  :key="tag"
                  class="mx-1"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="商品所在地">
                {{ formData.basicInfo.locationLabels?.join(' / ') }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="info-group">
            <h4>商品详情</h4>
            <div class="info-item">
              <span class="label">品牌：</span>
              <span>{{ formData.detailedInfo.brand }}</span>
            </div>
            <div class="info-item">
              <span class="label">型号：</span>
              <span>{{ formData.detailedInfo.model }}</span>
            </div>
            <div class="info-item">
              <span class="label">购买日期：</span>
              <span>{{ formData.detailedInfo.purchaseDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">保修信息：</span>
              <span>{{ getWarrantyLabel(formData.detailedInfo.warranty) }}</span>
            </div>
          </div>

          <div class="info-group">
            <h4>损耗情况</h4>
            <div class="wear-conditions">
              <el-tag
                v-for="condition in formData.detailedInfo.wearCondition"
                :key="condition"
                :type="getWearConditionType(condition)"
                class="wear-tag"
              >
                {{ getWearConditionLabel(condition) }}
              </el-tag>
            </div>
          </div>

          <div class="info-group">
            <h4>规格参数</h4>
            <p class="specs-text">{{ formData.detailedInfo.specs }}</p>
          </div>

          <div class="info-group">
            <h4>商品描述</h4>
            <p class="description-text">{{ formData.detailedInfo.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <el-button @click="$emit('go-back')">返回修改</el-button>
      <el-button type="primary" @click="$emit('submit-publish')">确认发布</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
})

defineEmits(['go-back', 'submit-publish'])

const getConditionTagType = computed(() => {
  const condition = props.formData.basicInfo.condition
  switch (condition) {
    case 'new':
      return 'success'
    case 'like_new':
    case 'excellent':
      return ''
    case 'good':
      return 'warning'
    default:
      return 'info'
  }
})

const getConditionLabel = (condition) => {
  const labels = {
    new: '全新',
    like_new: '99新',
    excellent: '95新',
    good: '9成新',
    fair: '8成新',
    poor: '7成新及以下',
  }
  return labels[condition] || condition
}

const getWarrantyLabel = (warranty) => {
  const labels = {
    none: '无保修',
    expired: '保修已过期',
    official: '官方保修中',
    extended: '延长保修中',
  }
  return labels[warranty] || warranty
}

const getWearConditionLabel = (condition) => {
  const labels = {
    screen: '屏幕有划痕',
    shell: '外壳有磨损',
    battery: '电池性能降低',
    function: '功能完好',
    accessories: '配件齐全',
  }
  return labels[condition] || condition
}

const getWearConditionType = (condition) => {
  switch (condition) {
    case 'function':
    case 'accessories':
      return 'success'
    case 'battery':
      return 'warning'
    case 'screen':
    case 'shell':
      return 'danger'
    default:
      return 'info'
  }
}

const getCategoryPath = (category) => {
  return Array.isArray(category) ? category.join(' > ') : category
}

const getLocationPath = (location) => {
  return Array.isArray(location) ? location.join(' ') : location
}
</script>

<style scoped>
.confirmation-step {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.preview-card {
  margin-bottom: 24px;
}

.preview-card h3 {
  margin: 0 0 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.preview-content {
  display: grid;
  gap: 24px;
}

.preview-images {
  width: 100%;
  margin-bottom: 24px;
}

.preview-images :deep(.el-carousel__item img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-title {
  font-size: 24px;
  margin: 0 0 20px;
  color: #333;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 20px;
}

.current-price .price {
  font-size: 28px;
  color: #ff5722;
  font-weight: bold;
}

.original-price .price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-group {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.info-group h4 {
  margin: 0 0 12px;
  color: #333;
  font-size: 16px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  line-height: 1.6;
}

.info-item .label {
  color: #666;
  width: 100px;
  flex-shrink: 0;
}

.wear-conditions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wear-tag {
  margin: 0;
}

.specs-text,
.description-text {
  margin: 0;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

:deep(.el-carousel__item) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
}
</style>
