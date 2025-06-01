<template>
  <div class="detailed-description-form">
    <div class="form-content">
      <div class="form-section rich-text-editor">
        <label>图文描述</label>
        <el-input
          type="textarea"
          v-model="localDetailedInfo.description"
          :rows="6"
          :class="{ 'is-error': errors.description }"
          placeholder="请输入商品详情描述，建议从以下方面描述：
1. 商品的基本信息
2. 商品的具体参数
3. 商品的使用感受
4. 商品的成色描述"
          @input="validateField('description')"
        />
        <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
      </div>

      <div class="form-section parameter-inputs">
        <label>参数填写</label>
        <div class="parameter-group">
          <div class="parameter-item">
            <label>品牌</label>
            <el-input
              v-model="localDetailedInfo.brand"
              placeholder="请输入品牌"
              :class="{ 'is-error': errors.brand }"
              @input="validateField('brand')"
            />
            <span class="error-message" v-if="errors.brand">{{ errors.brand }}</span>
          </div>

          <div class="parameter-item">
            <label>型号</label>
            <el-input
              v-model="localDetailedInfo.model"
              placeholder="请输入型号"
              :class="{ 'is-error': errors.model }"
              @input="validateField('model')"
            />
            <span class="error-message" v-if="errors.model">{{ errors.model }}</span>
          </div>

          <div class="parameter-item">
            <label>规格</label>
            <el-input
              v-model="localDetailedInfo.specs"
              placeholder="请输入规格（如：尺寸、容量等）"
              :class="{ 'is-error': errors.specs }"
              @input="validateField('specs')"
            />
            <span class="error-message" v-if="errors.specs">{{ errors.specs }}</span>
          </div>

          <div class="parameter-item">
            <label>购买日期</label>
            <el-date-picker
              v-model="localDetailedInfo.purchaseDate"
              type="date"
              placeholder="请选择购买日期"
              :class="{ 'is-error': errors.purchaseDate }"
              @change="validateField('purchaseDate')"
            />
            <span class="error-message" v-if="errors.purchaseDate">{{ errors.purchaseDate }}</span>
          </div>

          <div class="parameter-item">
            <label>保修情况</label>
            <el-select
              v-model="localDetailedInfo.warranty"
              placeholder="请选择保修情况"
              :class="{ 'is-error': errors.warranty }"
              @change="validateField('warranty')"
            >
              <el-option label="无保修" value="none" />
              <el-option label="保修中" value="active" />
              <el-option label="过保修期" value="expired" />
            </el-select>
            <span class="error-message" v-if="errors.warranty">{{ errors.warranty }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({ detailedInfo: Object })
const emit = defineEmits(['update:detailedInfo'])

const localDetailedInfo = reactive({
  description: '',
  brand: '',
  model: '',
  specs: '',
  purchaseDate: '',
  warranty: '',
  ...props.detailedInfo,
})

const errors = reactive({
  description: '',
  brand: '',
  model: '',
  specs: '',
  purchaseDate: '',
  warranty: '',
})

const validateField = (field) => {
  errors[field] = ''

  switch (field) {
    case 'description':
      if (!localDetailedInfo.description) {
        errors.description = '请填写商品描述'
      } else if (localDetailedInfo.description.length < 20) {
        errors.description = '描述至少需要20个字符'
      }
      break
    case 'brand':
      if (!localDetailedInfo.brand) {
        errors.brand = '请填写品牌'
      }
      break
    case 'model':
      if (!localDetailedInfo.model) {
        errors.model = '请填写型号'
      }
      break
    case 'specs':
      if (!localDetailedInfo.specs) {
        errors.specs = '请填写规格'
      }
      break
    case 'purchaseDate':
      if (!localDetailedInfo.purchaseDate) {
        errors.purchaseDate = '请选择购买日期'
      }
      break
    case 'warranty':
      if (!localDetailedInfo.warranty) {
        errors.warranty = '请选择保修情况'
      }
      break
  }

  emit('update:detailedInfo', { ...localDetailedInfo })
}

const validateAll = () => {
  validateField('description')
  validateField('brand')
  validateField('model')
  validateField('specs')
  validateField('purchaseDate')
  validateField('warranty')

  return !Object.values(errors).some((error) => error !== '')
}

watch(
  () => props.detailedInfo,
  (newVal) => {
    Object.assign(localDetailedInfo, newVal)
  },
  { deep: true },
)

defineExpose({
  validateAll,
})
</script>

<style scoped>
.detailed-description-form {
  width: 100%;
}

.form-content {
  display: flex;
  gap: 24px;
}

.form-section {
  background: #fff5f0; /* Light orange background */
  padding: 20px;
  border-radius: 8px;
}

.rich-text-editor {
  flex: 1;
  min-width: 400px;
}

.parameter-inputs {
  width: 400px;
}

.form-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.rich-text-editor :deep(.el-textarea__inner) {
  height: 400px !important; /* Fixed height */
  resize: none; /* Disable resize */
  padding: 15px;
  line-height: 1.6;
}

.rich-text-editor :deep(.el-textarea.is-error .el-textarea__inner) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.parameter-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.parameter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parameter-item label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
}

:deep(.el-input.is-error .el-input__wrapper),
:deep(.el-select.is-error .el-input__wrapper),
:deep(.el-date-picker.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-date-picker) {
  width: 100%;
}

:deep(.el-select .el-input) {
  width: 100%;
}
</style>
