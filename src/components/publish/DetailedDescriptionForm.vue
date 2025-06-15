<template>
  <div class="detailed-description-form">
    <el-form
      ref="formRef"
      :model="localInfo"
      :rules="rules"
      label-position="top"
      class="publish-form"
    >
      <!-- 商品描述 -->
      <el-form-item label="商品描述" prop="description" class="full-width">
        <div class="description-tips">
          <i class="el-icon-info"></i>
          请详细描述商品的使用感受、配置参数、存在的问题等
        </div>
        <el-input
          v-model="localInfo.description"
          type="textarea"
          :rows="6"
          placeholder="建议从以下方面描述：商品的基本信息、使用感受、是否有保修、商品的优缺点等（10-2000字）"
          maxlength="2000"
          show-word-limit
          resize="none"
          class="description-textarea"
          @input="handleInput"
        />
      </el-form-item>

      <div class="form-section">
        <div class="section-title">基本参数</div>
        <div class="form-grid">
          <!-- 品牌 -->
          <el-form-item label="品牌" prop="brand">
            <el-input
              v-model="localInfo.brand"
              placeholder="请输入品牌名称"
              clearable
              class="medium-input"
              @input="handleInput"
            />
          </el-form-item>

          <!-- 型号 -->
          <el-form-item label="型号" prop="model">
            <el-input
              v-model="localInfo.model"
              placeholder="请输入具体型号"
              clearable
              class="medium-input"
              @input="handleInput"
            />
          </el-form-item>
        </div>
      </div>

      <!-- 规格参数 -->
      <div class="form-section">
        <div class="section-title">规格参数</div>
        <el-form-item prop="specs" class="full-width">
          <div class="description-tips">
            <i class="el-icon-info"></i>
            请填写商品的具体规格参数，如：容量、尺寸、配置等
          </div>
          <el-input
            v-model="localInfo.specs"
            type="textarea"
            :rows="4"
            placeholder="例如：内存容量、屏幕尺寸、处理器型号等"
            maxlength="1000"
            show-word-limit
            resize="none"
            class="description-textarea"
            @input="handleInput"
          />
        </el-form-item>
      </div>

      <div class="form-section">
        <div class="section-title">购买信息</div>
        <div class="form-grid">
          <!-- 购买日期 -->
          <el-form-item label="购买日期" prop="purchaseDate">
            <el-date-picker
              v-model="localInfo.purchaseDate"
              type="date"
              placeholder="请选择购买日期"
              :disabled-date="disableFutureDates"
              value-format="YYYY-MM-DD"
              class="medium-input"
              @change="handleInput"
            />
          </el-form-item>

          <!-- 保修信息 -->
          <el-form-item label="保修信息" prop="warranty">
            <el-select
              v-model="localInfo.warranty"
              placeholder="请选择保修情况"
              class="medium-input"
              @change="handleInput"
            >
              <el-option label="无保修" value="none" />
              <el-option label="保修已过期" value="expired" />
              <el-option label="官方保修中" value="official" />
              <el-option label="延长保修中" value="extended" />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  detailedInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:detailedInfo'])
const formRef = ref(null)

// 本地状态
const localInfo = reactive({
  description: '',
  brand: '',
  model: '',
  specs: '',
  purchaseDate: '',
  warranty: '',
  ...props.detailedInfo,
})

// 监听props变化
watch(
  () => props.detailedInfo,
  (newVal) => {
    Object.assign(localInfo, newVal)
  },
  { deep: true },
)

// 处理输入更新
const handleInput = () => {
  emit('update:detailedInfo', { ...localInfo })
}

// 表单验证规则
const rules = {
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, max: 2000, message: '描述长度在10-2000个字符之间', trigger: 'blur' },
  ],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  model: [{ required: true, message: '请输入型号', trigger: 'blur' }],
  specs: [{ required: true, message: '请输入规格参数', trigger: 'blur' }],
  purchaseDate: [{ required: true, message: '请选择购买日期', trigger: 'change' }],
  warranty: [{ required: true, message: '请选择保修情况', trigger: 'change' }],
}

// 禁用未来日期
const disableFutureDates = (date) => {
  return date > new Date()
}

// 表单验证方法
const validateAll = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

defineExpose({
  validateAll,
})
</script>

<style scoped>
.detailed-description-form {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.form-section {
  margin-bottom: 32px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.description-tips {
  margin-bottom: 8px;
  color: #666;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.description-tips i {
  color: #909399;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}

:deep(.el-form-item.is-required .el-form-item__label:before) {
  color: #ff6f00;
}

.medium-input {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}
</style>
