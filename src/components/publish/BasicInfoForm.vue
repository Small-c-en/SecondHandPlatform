<template>
  <div class="basic-info-form">
    <el-form
      ref="formRef"
      :model="localInfo"
      :rules="rules"
      label-position="top"
      class="two-column-form"
    >
      <!-- 左侧列 -->
      <div class="form-column">
        <!-- 商品标题 - 占据整行 -->
        <div class="form-section">
          <el-form-item label="商品标题" prop="title">
            <div class="input-tips">
              <i class="el-icon-info"></i>
              标题是商品的第一印象，好的标题能提高成交率
            </div>
            <el-input
              v-model="localInfo.title"
              placeholder="请输入商品标题（2-50字）"
              maxlength="50"
              show-word-limit
              @input="handleInput"
            />
          </el-form-item>
        </div>

        <!-- 价格信息 - 两列并排 -->
        <div class="form-section">
          <div class="price-row">
            <el-form-item label="商品价格" prop="price" class="price-item">
              <div class="price-input-wrapper">
                <span class="price-prefix">¥</span>
                <el-input-number
                  v-model="localInfo.price"
                  :min="0"
                  :precision="2"
                  :step="0.01"
                  placeholder="请输入商品价格"
                  class="price-input"
                  controls-position="right"
                  :controls="false"
                  @change="handleInput"
                />
              </div>
              <!-- <div class="price-controls">
                <el-button
                  type="primary"
                  link
                  class="price-control-btn"
                  @click="adjustPrice('decrease')"
                >
                  <el-icon><Minus /></el-icon>
                </el-button>
                <el-button
                  type="primary"
                  link
                  class="price-control-btn"
                  @click="adjustPrice('increase')"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
              </div> -->
            </el-form-item>

            <el-form-item label="原价" prop="originalPrice" class="price-item">
              <div class="price-input-wrapper">
                <span class="price-prefix">¥</span>
                <el-input-number
                  v-model="localInfo.originalPrice"
                  :min="0"
                  :precision="2"
                  :step="0.01"
                  placeholder="请输入原价"
                  class="price-input"
                  controls-position="right"
                  :controls="false"
                  @change="handleInput"
                />
              </div>
              <!-- <div class="price-controls">
                <el-button
                  type="primary"
                  link
                  class="price-control-btn"
                  @click="adjustOriginalPrice('decrease')"
                >
                  <el-icon><Minus /></el-icon>
                </el-button>
                <el-button
                  type="primary"
                  link
                  class="price-control-btn"
                  @click="adjustOriginalPrice('increase')"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
              </div> -->
            </el-form-item>
          </div>
        </div>

        <!-- 商品分类 - 占据整行 -->
        <div class="form-section">
          <el-form-item label="商品分类" prop="category">
            <div class="input-tips">
              <i class="el-icon-info"></i>
              选择合适的分类，让买家更容易找到您的商品
            </div>
            <el-cascader
              v-model="localInfo.category"
              :options="categoryOptions"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择商品分类"
              clearable
              @change="handleInput"
            />
          </el-form-item>
        </div>

        <!-- 商品所在地 - 占据整行 -->
        <div class="form-section">
          <el-form-item label="商品所在地" prop="location">
            <div class="location-section">
              <div class="section-title">商品所在地</div>
              <div class="input-tips">
                <i class="el-icon-info"></i>
                准确的位置信息有助于买家评估物流时间
              </div>
              <el-cascader
                v-model="localInfo.location"
                :options="provinceList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'value',
                  label: 'label',
                  children: 'children',
                  checkStrictly: false,
                  emitPath: true,
                }"
                placeholder="请选择商品所在地"
                :show-all-levels="true"
                filterable
                clearable
                class="location-cascader"
                @change="handleInput"
              />
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="form-column">
        <!-- 商品成色 - 占据整行 -->
        <div class="form-section">
          <el-form-item label="商品成色" prop="condition">
            <div class="condition-section">
              <div class="section-title">商品成色</div>
              <div class="condition-tips">
                <i class="el-icon-info"></i>
                请如实描述商品成色，避免后续交易纠纷
              </div>
              <el-select
                v-model="localInfo.condition"
                placeholder="请选择商品成色"
                class="condition-select"
                @change="handleInput"
              >
                <el-option label="全新" value="全新" />
                <el-option label="9成新" value="9成新" />
                <el-option label="8成新" value="8成新" />
                <el-option label="7成新" value="7成新" />
                <el-option label="6成新" value="6成新" />
                <el-option label="5成新及以下" value="5成新及以下" />
              </el-select>
            </div>
          </el-form-item>
        </div>

        <!-- 发布状态 - 占据整行 -->
        <div class="form-section">
          <el-form-item label="发布状态" prop="publishStatus">
            <el-radio-group
              v-model="localInfo.publishStatus"
              class="full-width"
              @change="handleInput"
            >
              <el-radio :label="1">保存为草稿</el-radio>
              <el-radio :label="2">立即发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 自定义标签 - 占据整行 -->
        <div class="form-section">
          <el-form-item label="自定义标签" prop="customTags">
            <div class="tags-section">
              <div class="section-title">商品标签</div>
              <div class="input-tips">
                <i class="el-icon-info"></i>
                添加标签可以让买家更快找到您的商品
              </div>
              <el-select
                v-model="localInfo.customTags"
                multiple
                filterable
                allow-create
                default-first-option
                :max="3"
                placeholder="最多可添加3个标签"
                class="tag-select"
                @change="handleInput"
              >
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
              </el-select>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch, onMounted } from 'vue'
import { areaList as chinaAreaList } from '@vant/area-data'

const props = defineProps({
  basicInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:basic-info'])

const formRef = ref(null)

const localInfo = reactive({ ...props.basicInfo })

// 处理地区数据
const provinceList = ref([])

// 初始化省份数据并预加载所有城市数据
const initProvinceData = () => {
  // 初始化省份列表
  provinceList.value = Object.entries(chinaAreaList.province_list).map(([code, name]) => ({
    value: code,
    label: name,
    children: [], // 添加children属性以支持级联
  }))

  // 为每个省份预加载城市数据
  provinceList.value.forEach((province) => {
    const cities = Object.entries(chinaAreaList.city_list)
      .filter(([code]) => code.startsWith(province.value.slice(0, 2)))
      .map(([code, name]) => ({
        value: code,
        label: name,
        children: [], // 为城市预留区县数据位置
      }))

    // 为每个城市预加载区县数据
    cities.forEach((city) => {
      const districts = Object.entries(chinaAreaList.county_list)
        .filter(([code]) => code.startsWith(city.value.slice(0, 4)))
        .map(([code, name]) => ({
          value: code,
          label: name,
        }))
      city.children = districts
    })

    province.children = cities
  })
}

// 获取地区标签
const getLocationLabels = (codes) => {
  if (!codes || codes.length === 0) return []

  const labels = []
  const [provinceCode, cityCode, areaCode] = codes

  if (provinceCode) {
    labels.push(chinaAreaList.province_list[provinceCode])
  }

  if (cityCode) {
    labels.push(chinaAreaList.city_list[cityCode])
  }

  if (areaCode) {
    labels.push(chinaAreaList.county_list[areaCode])
  }

  return labels
}

// 监听props变化
watch(
  () => props.basicInfo,
  (newVal) => {
    Object.assign(localInfo, newVal)
  },
  { deep: true },
)

// 处理输入更新
const handleInput = () => {
  emit('update:basic-info', { ...localInfo })
}

// 获取分类标签
const getCategoryLabels = (categoryCodes) => {
  if (!categoryCodes || categoryCodes.length === 0) return []

  const result = []
  let currentOptions = categoryOptions

  for (const code of categoryCodes) {
    const option = currentOptions.find((opt) => opt.value === code)
    if (option) {
      result.push(option.label)
      currentOptions = option.children || []
    }
  }

  return result
}

// 分类选项
const categoryOptions = [
  {
    value: 'electronics',
    label: '电子产品',
    children: [
      { value: 'phone', label: '手机' },
      { value: 'computer', label: '电脑' },
      { value: 'accessories', label: '配件' },
    ],
  },
  {
    value: 'clothing',
    label: '服装',
    children: [
      { value: 'men', label: '男装' },
      { value: 'women', label: '女装' },
      { value: 'children', label: '童装' },
    ],
  },
  {
    value: 'books',
    label: '图书',
    children: [
      { value: 'textbooks', label: '教材' },
      { value: 'literature', label: '文学' },
      { value: 'other_books', label: '其他' },
    ],
  },
]

// 常用标签
const commonTags = ['全新未拆封', '带包装', '保修中', '无磕碰', '性价比高']

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2-50个字符之间', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  condition: [{ required: true, message: '请选择商品成色', trigger: 'change' }],
  location: [{ required: true, message: '请选择商品所在地', trigger: 'change' }],
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

// 组件挂载时初始化省份数据
onMounted(() => {
  // 初始化省份列表
  provinceList.value = Object.entries(chinaAreaList.province_list).map(([code, name]) => ({
    value: code,
    label: name,
    children: [], // 添加children属性以支持级联
  }))

  // 为每个省份预加载城市数据
  provinceList.value.forEach((province) => {
    const cities = Object.entries(chinaAreaList.city_list)
      .filter(([code]) => code.startsWith(province.value.slice(0, 2)))
      .map(([code, name]) => ({
        value: code,
        label: name,
        children: [], // 为城市预留区县数据位置
      }))

    // 为每个城市预加载区县数据
    cities.forEach((city) => {
      const districts = Object.entries(chinaAreaList.county_list)
        .filter(([code]) => code.startsWith(city.value.slice(0, 4)))
        .map(([code, name]) => ({
          value: code,
          label: name,
        }))
      city.children = districts
    })

    province.children = cities
  })
})

// 调整价格
const adjustPrice = (type) => {
  if (!localInfo.price) {
    localInfo.price = 0
  }
  const step = 0.01
  if (type === 'increase') {
    localInfo.price = Number((localInfo.price + step).toFixed(2))
  } else {
    localInfo.price = Math.max(0, Number((localInfo.price - step).toFixed(2)))
  }
  handleInput()
}

// 调整原价
const adjustOriginalPrice = (type) => {
  if (!localInfo.originalPrice) {
    localInfo.originalPrice = 0
  }
  const step = 0.01
  if (type === 'increase') {
    localInfo.originalPrice = Number((localInfo.originalPrice + step).toFixed(2))
  } else {
    localInfo.originalPrice = Math.max(0, Number((localInfo.originalPrice - step).toFixed(2)))
  }
  handleInput()
}

defineExpose({
  validateAll,
})
</script>

<style scoped>
.basic-info-form {
  background-color: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.two-column-form {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.form-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-section {
  /* background-color: #fafafa; */
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid #dddfe570;
}

.form-section:hover {
  background-color: rgba(255, 111, 0, 0.041);
  border-color: #ff6f00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.1);
}

.price-row {
  display: flex;
  gap: 24px;
  width: 100%;
}

.price-item {
  flex: 1;
  margin-bottom: 0;
}

.full-width {
  width: 100%;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
}

.price-input-wrapper:hover {
  border-color: #ff6f00;
}

.price-input-wrapper:focus-within {
  border-color: #ff6f00;
  /* box-shadow: #ff6f00; */
}

.price-prefix {
  padding: 0 12px;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
  border-right: 1px solid #dcdfe6;
  transition: all 0.3s ease;
}

.price-input-wrapper:hover .price-prefix,
.price-input-wrapper:focus-within .price-prefix {
  color: #ff6f00;
  border-right-color: #ff6f00;
}

.price-input {
  flex: 1;
}

:deep(.price-input .el-input__wrapper) {
  box-shadow: none !important;
  padding: 0 12px;
}

:deep(.price-input .el-input__inner) {
  text-align: left;
  height: 40px;
  line-height: 40px;
}

:deep(.price-input .el-input__wrapper.is-focus) {
  box-shadow: none !important;
}

:deep(.price-input .el-input__inner:focus) {
  outline: none;
  box-shadow: none;
}

:deep(.el-input-number.is-controls-right .el-input__wrapper) {
  padding-right: 5px !important;
}

.price-controls {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: center;
}

.price-control-btn {
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.price-control-btn:hover {
  background-color: #fff6e6;
  color: #ff6f00;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  padding-bottom: 12px;
  font-size: 15px;
  transition: color 0.3s ease;
}

.form-section:hover :deep(.el-form-item__label) {
  color: #ff6f00;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #fff;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover) {
  box-shadow: 0 0 0 1px #ff6f00 inset;
  background-color: #fff;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
  background-color: #fff;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 32px;
}

:deep(.el-radio) {
  margin-right: 0;
  transition: all 0.3s ease;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #ff6f00;
  background: #ff6f00;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #ff6f00;
}

:deep(.el-select),
:deep(.el-cascader) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-right: 5px !important;
}

:deep(.el-input-number .el-input-number__decrease),
:deep(.el-input-number .el-input-number__increase) {
  width: 32px;
  height: 38px;
  line-height: 38px;
  transition: all 0.3s ease;
}

:deep(.el-input-number .el-input-number__decrease:hover),
:deep(.el-input-number .el-input-number__increase:hover) {
  color: #ff6f00;
}

:deep(.el-tag) {
  margin: 2px 4px;
  background-color: #fff6e6;
  border-color: #ffd591;
  color: #ff6f00;
  border-radius: 6px;
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
  transition: all 0.3s ease;
}

:deep(.el-tag:hover) {
  background-color: #ff6f00;
  border-color: #ff6f00;
  color: #fff;
}

:deep(.el-tag .el-tag__close) {
  color: #ff6f00;
  right: -2px;
  transition: all 0.3s ease;
}

:deep(.el-tag .el-tag__close:hover) {
  background-color: #ff6f00;
  color: #fff;
}

:deep(.el-select__tags) {
  margin: 4px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  min-height: 32px;
}

:deep(.el-cascader-panel) {
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式布局优化 */
@media screen and (max-width: 1200px) {
  .basic-info-form {
    padding: 32px;
  }

  .two-column-form {
    gap: 32px;
  }
}

@media screen and (max-width: 768px) {
  .basic-info-form {
    padding: 24px;
  }

  .two-column-form {
    flex-direction: column;
    gap: 24px;
  }

  .price-row {
    flex-direction: column;
    gap: 24px;
  }

  .form-section {
    padding: 20px;
  }

  :deep(.el-cascader-panel) {
    max-width: 100%;
  }
}
</style>
