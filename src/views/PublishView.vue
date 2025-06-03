<template>
  <div class="publish-view-container">
    <PublishNav @save-draft="saveDraft" @exit="exitPublish" />
    <div class="publish-view-content">
      <StepProgressBar :current-step="currentStep" :total-steps="totalSteps" />

      <div v-if="currentStep === 1" class="form-step">
        <h2 class="step-title">
          <span class="step-number">1</span>
          <span class="step-text">基础信息</span>
        </h2>
        <BasicInfoForm
          ref="basicInfoFormRef"
          :basic-info="formData.basicInfo"
          @update:basic-info="updateBasicInfo"
        />
      </div>

      <div v-if="currentStep === 2" class="form-step">
        <h2 class="step-title">
          <span class="step-number">2</span>
          <span class="step-text">详细描述</span>
        </h2>
        <DetailedDescriptionForm
          ref="detailFormRef"
          :detailed-info="formData.detailedInfo"
          @update:detailed-info="updateDetailedInfo"
        />
        <ImageUploadArea :images="formData.images" @update:images="updateImages" />
      </div>

      <div v-if="currentStep === 3" class="form-step">
        <h2 class="step-title">
          <span class="step-number">3</span>
          <span class="step-text">确认发布</span>
        </h2>
        <ConfirmationStep
          :form-data="formData"
          @go-back="currentStep--"
          @submit-publish="handlePublish"
        />
      </div>

      <div class="step-navigation" v-if="currentStep < totalSteps">
        <el-button @click="prevStep" :disabled="currentStep === 1" class="prev-btn">
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button type="primary" @click="nextStep" class="next-btn">
          下一步
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
    <TipsBar :current-form-step="currentStep" />

    <!-- Loading Dialog -->
    <el-dialog
      v-model="isPublishing"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="300px"
      class="publishing-dialog"
    >
      <div class="publishing-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>正在发布商品...</p>
      </div>
    </el-dialog>

    <!-- Draft Saving Dialog -->
    <el-dialog
      v-model="isSavingDraft"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="300px"
      class="publishing-dialog"
    >
      <div class="publishing-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>正在保存草稿...</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

import PublishNav from '../components/publish/PublishNav.vue'
import StepProgressBar from '../components/publish/StepProgressBar.vue'
import BasicInfoForm from '../components/publish/BasicInfoForm.vue'
import DetailedDescriptionForm from '../components/publish/DetailedDescriptionForm.vue'
import ImageUploadArea from '../components/publish/ImageUploadArea.vue'
import ConfirmationStep from '../components/publish/ConfirmationStep.vue'
import TipsBar from '../components/publish/TipsBar.vue'

const router = useRouter()
const route = useRoute()
const currentStep = ref(1)
const totalSteps = 3
const isPublishing = ref(false)
const isSavingDraft = ref(false)
const isEditMode = ref(false)

const basicInfoFormRef = ref(null)
const detailFormRef = ref(null)

// 初始化表单数据结构
const formData = reactive({
  basicInfo: {
    title: '',
    category: [],
    price: null,
    originalPrice: null,
    condition: '',
    publishStatus: 2, // 默认立即发布
    customTags: [], // 自定义标签
    location: [],
  },
  detailedInfo: {
    description: '',
    brand: '',
    model: '',
    specs: '',
    purchaseDate: '',
    warranty: '',
    wearCondition: [],
    inspection: 'not_needed',
  },
  images: [],
})

// 更新函数
const updateBasicInfo = (newBasicInfo) => {
  formData.basicInfo = { ...newBasicInfo }
}

const updateDetailedInfo = (newDetailedInfo) => {
  formData.detailedInfo = { ...newDetailedInfo }
}

const updateImages = (newImages) => {
  formData.images = [...newImages]
}

onMounted(() => {
  // 检查是否是编辑模式或草稿模式
  if (route.query.mode === 'edit' && route.query.productId) {
    isEditMode.value = true
    loadEditData(route.query.productId)
  } else if (route.query.mode === 'draft' && route.query.draftId) {
    loadDraftData(route.query.draftId)
  }
})

// 加载编辑数据
const loadEditData = async (productId) => {
  try {
    // 这里应该是从API获取数据
    // const response = await getProductDetail(productId)
    // const productData = response.data
    const productData = route.query

    // 填充基本信息
    formData.basicInfo = {
      title: productData.title || '',
      category: productData.category ? JSON.parse(productData.category) : [],
      price: parseFloat(productData.price) || null,
      originalPrice: parseFloat(productData.originalPrice) || null,
      condition: productData.condition || '',
      publishStatus: 2,
      customTags: productData.customTags ? JSON.parse(productData.customTags) : [],
      location: productData.location ? JSON.parse(productData.location) : [],
    }

    // 填充详细信息
    formData.detailedInfo = {
      description: productData.description || '',
      brand: productData.brand || '',
      model: productData.model || '',
      specs: productData.specs || '',
      purchaseDate: productData.purchaseDate || '',
      warranty: productData.warranty || '',
      wearCondition: productData.wearCondition ? JSON.parse(productData.wearCondition) : [],
      inspection: productData.inspection || 'not_needed',
    }

    // 填充图片
    formData.images = productData.images
      ? JSON.parse(productData.images)
      : productData.mainImage
        ? [{ url: productData.mainImage, name: 'main-image' }]
        : []
  } catch (error) {
    console.error('加载商品数据失败:', error)
    ElMessage.error('加载商品数据失败')
  }
}

// 加载草稿数据
const loadDraftData = (draftId) => {
  try {
    const drafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
    const draft = drafts.find((d) => d.id === parseInt(draftId))
    if (draft) {
      Object.assign(formData.basicInfo, draft.basicInfo)
      Object.assign(formData.detailedInfo, draft.detailedInfo)
      formData.images = [...draft.images]
    }
  } catch (error) {
    console.error('加载草稿数据失败:', error)
    ElMessage.error('加载草稿数据失败')
  }
}

const validateCurrentStep = async () => {
  if (currentStep.value === 1) {
    return basicInfoFormRef.value?.validateAll()
  } else if (currentStep.value === 2) {
    const isDetailValid = await detailFormRef.value?.validateAll()
    if (!isDetailValid) {
      return false
    }
    // 验证图片上传
    if (formData.images.length === 0) {
      ElMessage.error('请至少上传一张商品图片')
      return false
    }
    return true
  }
  return true
}

const nextStep = async () => {
  const isValid = await validateCurrentStep()
  if (!isValid) {
    ElMessage.error('请完善必填信息')
    return
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const saveDraft = async () => {
  try {
    isSavingDraft.value = true
    // 保存草稿到本地存储
    const draft = {
      id: Date.now(),
      ...formData,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }

    const existingDrafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
    existingDrafts.push(draft)
    localStorage.setItem('productDrafts', JSON.stringify(existingDrafts))

    await new Promise((resolve) => setTimeout(resolve, 800)) // 模拟保存延迟
    ElMessage.success('草稿已保存')

    router.push({
      path: '/manage-products',
      query: { status: 'draft' },
    })
  } catch (error) {
    console.error('保存草稿失败:', error)
    ElMessage.error('保存草稿失败')
  } finally {
    isSavingDraft.value = false
  }
}

const exitPublish = () => {
  router.push('/')
}

const handlePublish = async () => {
  try {
    isPublishing.value = true
    // 创建商品数据
    const productData = {
      id: Date.now(),
      title: formData.basicInfo.title,
      mainImage: formData.images[0]?.url,
      category: formData.basicInfo.category,
      condition: formData.basicInfo.condition,
      price: formData.basicInfo.price,
      originalPrice: formData.basicInfo.originalPrice,
      status: formData.basicInfo.publishStatus === 2 ? 'pending' : 'draft',
      isTop: false,
      createdAt: new Date().toISOString(),
      ...formData,
    }

    // 保存到本地存储
    const publishedProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]')
    publishedProducts.push(productData)
    localStorage.setItem('publishedProducts', JSON.stringify(publishedProducts))

    // 如果是从草稿发布，删除对应的草稿
    if (route.query.mode === 'draft') {
      const drafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
      const updatedDrafts = drafts.filter((d) => d.id !== parseInt(route.query.draftId))
      localStorage.setItem('productDrafts', JSON.stringify(updatedDrafts))
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API延迟
    ElMessage.success('商品发布成功，等待审核')

    router.push({
      path: '/my-products',
      query: { status: 'pending' },
    })
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败，请重试')
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.publish-view-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.publish-view-content {
  padding: 20px 50px;
  flex-grow: 1;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.form-step {
  margin-top: 20px;
}

.step-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  width: 32px;
  height: 32px;
  background-color: #ff6f00;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.step-text {
  color: #333;
}

.step-navigation {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 80px;
}

.prev-btn,
.next-btn {
  min-width: 150px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  padding: 0 24px;
}

.prev-btn :deep(.el-icon),
.next-btn :deep(.el-icon) {
  margin: 0;
}

.prev-btn span,
.next-btn span {
  flex: 1;
  text-align: center;
}

.publishing-dialog :deep(.el-dialog__header) {
  display: none;
}

.publishing-content {
  text-align: center;
  padding: 20px;
}

.publishing-content .el-icon {
  font-size: 24px;
  color: #ff6f00;
  margin-bottom: 10px;
}

.publishing-content p {
  margin: 0;
  color: #666;
}

.el-dialog.publishing-dialog {
  width: 300px !important;
  border-radius: 8px;
  overflow: hidden;
}

.el-dialog.publishing-dialog :deep(.el-dialog__body) {
  padding: 30px 20px;
}

:deep(.el-button--primary) {
  --el-button-bg-color: #ff6f00;
  --el-button-border-color: #ff6f00;
  --el-button-hover-bg-color: #ff8f00;
  --el-button-hover-border-color: #ff8f00;
  --el-button-active-bg-color: #f57c00;
  --el-button-active-border-color: #f57c00;
}

/* 添加全局主题色样式 */
:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #ff6f00;
}

:deep(.el-cascader),
:deep(.el-select),
:deep(.el-date-picker) {
  --el-color-primary: #ff6f00;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #ff6f00;
  background: #ff6f00;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #ff6f00;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff6f00;
  border-color: #ff6f00;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #ff6f00;
}

:deep(.el-cascader-node.is-active) {
  color: #ff6f00;
}

:deep(.el-cascader-node.in-active-path) {
  color: #ff6f00;
}

:deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
}
</style>
