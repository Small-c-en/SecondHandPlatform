<template>
  <div class="publish-view-container">
    <PublishNav @save-draft="saveDraft" @exit="exitPublish" />
    <div class="publish-view-content">
      <StepProgressBar :current-step="currentStep" :total-steps="totalSteps" />

      <div v-if="currentStep === 1" class="form-step">
        <h2 class="step-title">1/3 基础信息</h2>
        <BasicInfoForm ref="basicInfoFormRef" v-model:basicInfo="formData.basicInfo" />
      </div>

      <div v-if="currentStep === 2" class="form-step">
        <h2 class="step-title">2/3 详细描述</h2>
        <DetailedDescriptionForm ref="detailFormRef" v-model:detailedInfo="formData.detailedInfo" />
        <ImageUploadArea v-model:images="formData.images" />
      </div>

      <div v-if="currentStep === 3" class="form-step">
        <h2 class="step-title">3/3 确认发布</h2>
        <ConfirmationStep
          :form-data="formData"
          @go-back="currentStep--"
          @submit-publish="handlePublish"
        />
      </div>

      <div class="step-navigation" v-if="currentStep < totalSteps">
        <el-button @click="prevStep" :disabled="currentStep === 1">上一步</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
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
import { Loading } from '@element-plus/icons-vue'

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

const formData = reactive({
  basicInfo: {},
  detailedInfo: {},
  images: [],
})

onMounted(() => {
  // 检查是否是编辑模式或草稿模式
  if (route.query.mode === 'edit' && route.query.productId) {
    isEditMode.value = true
    // 预填充表单数据
    const productData = route.query
    formData.basicInfo = {
      category: productData.category,
      title: productData.title,
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice),
      condition: productData.condition,
      location: productData.location || [],
    }
    formData.detailedInfo = {
      description: productData.description || '',
      brand: productData.brand || '',
      model: productData.model || '',
      specs: productData.specs || '',
      purchaseDate: productData.purchaseDate || '',
      warranty: productData.warranty || '',
    }
    formData.images = productData.images
      ? JSON.parse(productData.images)
      : [{ url: productData.mainImage, name: 'main-image' }]
  } else if (route.query.mode === 'draft' && route.query.draftId) {
    // 加载草稿数据
    const drafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
    const draft = drafts.find((d) => d.id === parseInt(route.query.draftId))
    if (draft) {
      formData.basicInfo = draft.basicInfo
      formData.detailedInfo = draft.detailedInfo
      formData.images = draft.images
    }
  }
})

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

    // 跳转到商品管理页面的草稿箱
    router.push({
      path: '/manage-products',
      query: { status: 'draft' },
    })
  } catch (error) {
    ElMessage.error('保存草稿失败')
    console.error('保存草稿失败:', error)
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
      status: 'pending',
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
      path: '/manage-products',
      query: { status: 'pending' },
    })
  } catch (error) {
    ElMessage.error('发布失败，请重试')
    console.error('发布失败:', error)
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.publish-view-container {
  background-color: #fff;
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
}

.step-navigation {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
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
  color: #409eff;
  margin-bottom: 10px;
}

.publishing-content p {
  margin: 0;
  color: #666;
}

/* Add loading dialog styles */
.el-dialog.publishing-dialog {
  width: 300px !important;
  border-radius: 8px;
  overflow: hidden;
}

.el-dialog.publishing-dialog :deep(.el-dialog__body) {
  padding: 30px 20px;
}
</style>
