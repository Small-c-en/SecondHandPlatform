<template>
  <div class="basic-info-form">
    <div class="form-group">
      <label for="category">商品分类</label>
      <el-select
        v-model="localBasicInfo.category"
        placeholder="请选择分类"
        class="category-select"
        :class="{ 'is-error': errors.category }"
        @change="
          () => {
            validateField('category')
            emitUpdate()
          }
        "
      >
        <el-option-group v-for="group in categories" :key="group.label" :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-option-group>
      </el-select>
      <span class="error-message" v-if="errors.category">{{ errors.category }}</span>
    </div>

    <div class="form-group">
      <label for="title">商品标题</label>
      <el-input
        v-model="localBasicInfo.title"
        placeholder="请输入商品标题"
        :class="{ 'is-error': errors.title }"
        @input="
          () => {
            validateField('title')
            emitUpdate()
          }
        "
      />
      <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
    </div>

    <div class="form-group price-group">
      <div>
        <label for="price">二手价格</label>
        <el-input-number
          v-model="localBasicInfo.price"
          :min="0"
          :precision="2"
          :step="0.01"
          :class="{ 'is-error': errors.price }"
          @change="
            () => {
              validateField('price')
              emitUpdate()
            }
          "
        />
        <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
      </div>
      <div>
        <label for="originalPrice">原价 (选填)</label>
        <el-input-number
          v-model="localBasicInfo.originalPrice"
          :min="0"
          :precision="2"
          :step="0.01"
          @change="emitUpdate"
        />
      </div>
    </div>

    <div class="form-group">
      <label>新旧程度</label>
      <div class="condition-buttons">
        <el-radio-group
          v-model="localBasicInfo.condition"
          @change="
            () => {
              validateField('condition')
              emitUpdate()
            }
          "
        >
          <el-radio-button
            v-for="condition in conditions"
            :key="condition.value"
            :label="condition.value"
          >
            {{ condition.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <span class="error-message" v-if="errors.condition">{{ errors.condition }}</span>
    </div>

    <div class="form-group">
      <label for="location">所在地区</label>
      <el-cascader
        v-model="localBasicInfo.location"
        :options="areaOptions"
        :props="{
          expandTrigger: 'hover',
          value: 'code',
          label: 'name',
          children: 'children',
        }"
        placeholder="请选择地区"
        :class="{ 'is-error': errors.location }"
        @change="
          () => {
            validateField('location')
            emitUpdate()
          }
        "
      />
      <span class="error-message" v-if="errors.location">{{ errors.location }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import areaData from '@/data/area-data.js' // 需要创建这个文件

const props = defineProps({ basicInfo: Object })
const emit = defineEmits(['update:basicInfo'])

const localBasicInfo = reactive({
  category: '',
  title: '',
  price: null,
  originalPrice: null,
  condition: '',
  location: [],
  ...props.basicInfo,
})

const errors = reactive({
  category: '',
  title: '',
  price: '',
  condition: '',
  location: '',
})

const categories = [
  {
    label: '电子数码',
    options: [
      { value: 'mobile', label: '手机' },
      { value: 'computer', label: '电脑' },
      { value: 'camera', label: '相机' },
      { value: 'accessories', label: '配件' },
    ],
  },
  {
    label: '家用电器',
    options: [
      { value: 'tv', label: '电视' },
      { value: 'refrigerator', label: '冰箱' },
      { value: 'washer', label: '洗衣机' },
      { value: 'airconditioner', label: '空调' },
    ],
  },
  {
    label: '服饰箱包',
    options: [
      { value: 'clothing', label: '服装' },
      { value: 'shoes', label: '鞋靴' },
      { value: 'bags', label: '箱包' },
      { value: 'accessories', label: '配饰' },
    ],
  },
]

const conditions = [
  { label: '全新', value: 'new' },
  { label: '99新', value: '99new' },
  { label: '95新', value: '95new' },
  { label: '9成新', value: '90new' },
  { label: '8成新', value: '80new' },
  { label: '7成新及以下', value: '70new' },
]

const areaOptions = ref(areaData)

const validateField = (field) => {
  errors[field] = ''

  switch (field) {
    case 'category':
      if (!localBasicInfo.category) {
        errors.category = '请选择商品分类'
      }
      break
    case 'title':
      if (!localBasicInfo.title) {
        errors.title = '请输入商品标题'
      } else if (localBasicInfo.title.length < 5) {
        errors.title = '标题至少需要5个字符'
      }
      break
    case 'price':
      if (!localBasicInfo.price) {
        errors.price = '请输入商品价格'
      } else if (localBasicInfo.price <= 0) {
        errors.price = '价格必须大于0'
      }
      break
    case 'condition':
      if (!localBasicInfo.condition) {
        errors.condition = '请选择商品新旧程度'
      }
      break
    case 'location':
      if (!localBasicInfo.location || localBasicInfo.location.length === 0) {
        errors.location = '请选择所在地区'
      }
      break
  }
}

const validateAll = () => {
  validateField('category')
  validateField('title')
  validateField('price')
  validateField('condition')
  validateField('location')

  return !Object.values(errors).some((error) => error !== '')
}

watch(
  () => props.basicInfo,
  (newVal) => {
    Object.assign(localBasicInfo, newVal)
  },
  { deep: true },
)

const emitUpdate = () => {
  emit('update:basicInfo', { ...localBasicInfo })
}

defineExpose({
  validateAll,
})
</script>

<style scoped>
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.category-select {
  width: 100%;
}

.price-group {
  display: flex;
  gap: 20px;
}

.price-group > div {
  flex: 1;
}

.condition-buttons {
  margin-top: 8px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

:deep(.el-input.is-error .el-input__wrapper),
:deep(.el-select.is-error .el-input__wrapper),
:deep(.el-cascader.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

:deep(.el-radio-button__inner) {
  padding: 8px 15px;
}

:deep(.el-cascader) {
  width: 100%;
}
</style>
