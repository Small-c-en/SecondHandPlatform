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
        <el-input
          v-model="localInfo.description"
          type="textarea"
          :rows="6"
          placeholder="请详细描述商品的使用感受、配置参数、存在的问题等（10-2000字）"
          maxlength="2000"
          show-word-limit
          resize="none"
          class="description-textarea"
          @input="handleInput"
        />
      </el-form-item>

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

      <!-- 规格参数 -->
      <el-form-item label="规格参数" prop="specs" class="full-width">
        <el-input
          v-model="localInfo.specs"
          type="textarea"
          :rows="4"
          placeholder="请输入商品的具体规格参数，如：容量、尺寸、配置等"
          maxlength="1000"
          show-word-limit
          resize="none"
          class="description-textarea"
          @input="handleInput"
        />
      </el-form-item>

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

      <!-- 损耗情况 -->
      <el-form-item label="损耗情况" prop="wearCondition" class="full-width">
        <el-checkbox-group v-model="localInfo.wearCondition" @change="handleInput">
          <div class="wear-condition-group">
            <el-checkbox label="screen">屏幕有划痕</el-checkbox>
            <el-checkbox label="shell">外壳有磨损</el-checkbox>
            <el-checkbox label="battery">电池性能降低</el-checkbox>
            <el-checkbox label="function">功能完好</el-checkbox>
            <el-checkbox label="accessories">配件齐全</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-form-item>

      <!-- 验机服务 -->
      <el-form-item label="验机服务" prop="inspection" class="full-width">
        <el-radio-group v-model="localInfo.inspection" @change="handleInput">
          <el-radio label="needed">需要提供验机服务</el-radio>
          <el-radio label="not_needed">无需验机服务</el-radio>
        </el-radio-group>
      </el-form-item>
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
  wearCondition: [],
  inspection: 'not_needed',
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
  wearCondition: [{ required: true, message: '请选择损耗情况', trigger: 'change' }],
  inspection: [{ required: true, message: '请选择是否需要验机服务', trigger: 'change' }],
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

.publish-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-date-picker) {
  width: 100%;
}

:deep(.el-checkbox-group) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}

:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.medium-input {
  width: 300px;
}

.description-textarea {
  width: 100%;
}

.wear-condition-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

:deep(.el-form-item__content) {
  flex-wrap: wrap;
}
</style>
