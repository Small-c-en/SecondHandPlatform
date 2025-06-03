<template>
  <div class="basic-info-form">
    <el-form
      ref="formRef"
      :model="localInfo"
      :rules="rules"
      label-position="top"
      class="publish-form"
    >
      <!-- 商品标题 -->
      <el-form-item label="商品标题" prop="title">
        <el-input
          v-model="localInfo.title"
          placeholder="请输入商品标题（2-50字）"
          maxlength="50"
          show-word-limit
          @input="handleInput"
        />
      </el-form-item>

      <!-- 商品分类 -->
      <el-form-item label="商品分类" prop="category">
        <el-cascader
          v-model="localInfo.category"
          :options="categoryOptions"
          :props="{ expandTrigger: 'hover' }"
          placeholder="请选择商品分类"
          @change="handleInput"
        />
      </el-form-item>

      <!-- 价格信息 -->
      <div class="price-group">
        <el-form-item label="售价" prop="price" class="price-item">
          <el-input-number
            v-model="localInfo.price"
            :min="0"
            :precision="2"
            :step="10"
            controls-position="right"
            placeholder="请输入售价"
            class="price-input"
            @change="handleInput"
          />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice" class="price-item">
          <el-input-number
            v-model="localInfo.originalPrice"
            :min="0"
            :precision="2"
            :step="10"
            controls-position="right"
            placeholder="请输入原价"
            class="price-input"
            @change="handleInput"
          />
        </el-form-item>
      </div>

      <!-- 商品成色 -->
      <el-form-item label="商品成色" prop="condition">
        <el-radio-group v-model="localInfo.condition" @change="handleInput">
          <el-radio label="95">95成新</el-radio>
          <el-radio label="9">9成新</el-radio>
          <el-radio label="8">8成新</el-radio>
          <el-radio label="7">7成新及以下</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 发布状态 -->
      <el-form-item label="发布状态" prop="publishStatus">
        <el-radio-group v-model="localInfo.publishStatus" @change="handleInput">
          <el-radio :label="2">立即发布</el-radio>
          <el-radio :label="1">保存草稿</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 自定义标签 -->
      <el-form-item label="自定义标签（最多2个）" prop="customTags">
        <el-select
          v-model="localInfo.customTags"
          multiple
          filterable
          allow-create
          :max="2"
          placeholder="最多可添加2个标签"
          @change="handleInput"
        >
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>

      <!-- 商品所在地 -->
      <el-form-item label="商品所在地" prop="location">
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
          @change="handleInput"
        />
      </el-form-item>
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

// 本地状态
const localInfo = reactive({
  title: '',
  category: [],
  price: null,
  originalPrice: null,
  condition: '',
  publishStatus: 2,
  customTags: [],
  location: [],
})

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

// 监听地区选择变化
const handleAreaChange = (value) => {
  handleInput()
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
    if (newVal && Object.keys(newVal).length > 0) {
      Object.assign(localInfo, newVal)
    }
  },
  { deep: true, immediate: true },
)

// 处理输入更新
const handleInput = () => {
  emit('update:basic-info', {
    title: localInfo.title,
    category: localInfo.category,
    categoryLabels: getCategoryLabels(localInfo.category),
    price: localInfo.price,
    originalPrice: localInfo.originalPrice,
    condition: localInfo.condition,
    publishStatus: localInfo.publishStatus,
    customTags: localInfo.customTags,
    location: localInfo.location,
    locationLabels: getLocationLabels(localInfo.location),
  })
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
  publishStatus: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
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
  initProvinceData()
})

defineExpose({
  validateAll,
})
</script>

<style scoped>
.basic-info-form {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.publish-form {
  max-width: 800px;
  margin: 0 auto;
}

.price-group {
  display: flex;
  gap: 20px;
}

.price-item {
  flex: 0 0 auto;
  width: 200px;
}

.price-input {
  width: 100%;
}

.custom-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.tag-input {
  width: 100px;
  margin-right: 8px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-bottom: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-cascader) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-form-item__content) {
  flex-wrap: wrap;
}
</style>
