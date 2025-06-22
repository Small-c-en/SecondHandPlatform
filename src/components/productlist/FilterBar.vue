<template>
  <div class="filter-bar-sticky-wrapper">
    <div class="filter-bar">
      <!-- 品类筛选 -->
      <div class="filter-module category-filter">
        <label>品类:</label>
        <el-select
          v-model="selectedFilters.category"
          placeholder="选择品类"
          clearable
          @change="applyFilter('category', $event)"
          class="category-select"
        >
          <el-option label="全部品类" :value="null" />
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </div>

      <!-- 价格区间筛选 -->
      <div class="filter-module price-range-filter">
        <label>价格区间:</label>
        <input
          type="number"
          placeholder="最低价"
          v-model.number="selectedFilters.priceRange[0]"
          @change="applyFilter('priceRange')"
          class="price-input"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="最高价"
          v-model.number="selectedFilters.priceRange[1]"
          @change="applyFilter('priceRange')"
          class="price-input"
        />
      </div>

      <!-- 新旧程度筛选 -->
      <div class="filter-module condition-filter">
        <label>新旧程度:</label>
        <div class="condition-tags">
          <button
            v-for="condition in conditions"
            :key="condition.value"
            :class="{ active: selectedFilters.condition === condition.value }"
            @click="applyFilter('condition', condition.value)"
          >
            {{ condition.label }}
          </button>
        </div>
      </div>

      <!-- 排序方式筛选 -->
      <div class="filter-module sort-by-filter">
        <label>排序方式:</label>
        <div class="sort-options">
          <button
            v-for="sortOption in sortOptions"
            :key="sortOption.value"
            :class="{ active: selectedFilters.sortBy === sortOption.value }"
            @click="applyFilter('sortBy', sortOption.value)"
          >
            {{ sortOption.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

const emit = defineEmits(['filters-updated'])

const selectedFilters = reactive({
  category: null,
  priceRange: [null, null],
  condition: null,
  sortBy: 'comprehensive', // Default sort
})

const conditions = ref([
  { label: '全部', value: null },
  { label: '全新', value: 'new' },
  { label: '9成新', value: '90new' },
  { label: '8成新', value: '80new' },
  { label: '7成新及以下', value: '70new_under' },
])

const sortOptions = ref([
  { label: '综合推荐', value: 'comprehensive' },
  { label: '价格升序', value: 'price_asc' },
  { label: '价格降序', value: 'price_desc' },
  { label: '发布时间', value: 'time_desc' },
])

const categories = ref([
  { label: '电子产品', value: 'electronics' },
  { label: '图书音像', value: 'books' },
  { label: '服饰鞋包', value: 'clothing' },
  { label: '家具家居', value: 'furniture' },
  { label: '其他', value: 'others' },
])

const applyFilter = (filterType, value) => {
  if (filterType === 'condition' && selectedFilters.condition === value) {
    selectedFilters.condition = null // Allow unselecting condition
  } else if (filterType !== 'priceRange' && filterType !== 'category') {
    selectedFilters[filterType] = value
  }
  // For priceRange, values are bound directly with v-model
  // For category, value is directly from $event.target.value

  // Validate price range (min cannot be greater than max)
  if (
    selectedFilters.priceRange[0] !== null &&
    selectedFilters.priceRange[1] !== null &&
    selectedFilters.priceRange[0] > selectedFilters.priceRange[1]
  ) {
    // Swap them or alert, for now just a console log
    console.warn('Price range invalid: min > max. Consider adding validation UI.')
    // Potentially reset or swap: [selectedFilters.priceRange[1], selectedFilters.priceRange[0]]
  }

  console.log('Filters updated:', JSON.parse(JSON.stringify(selectedFilters)))
  emit('filters-updated', JSON.parse(JSON.stringify(selectedFilters)))
}
</script>

<style scoped>
.filter-bar-sticky-wrapper {
  position: sticky;
  top: 0; /* Adjust if you have a global fixed header above this */
  z-index: 900;
  background-color: #ffffff; /* White background for the bar */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  align-items: center;
  padding: 10px 15px;
  gap: 20px; /* Gap between filter modules */
  border-bottom: 1px solid #e0e0e0;
  max-width: 1200px; /* Consistent with page max-width */
  margin: 0 auto;
}

.filter-module {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.filter-module label {
  color: #555;
  font-weight: 500;
  white-space: nowrap;
}

/* Category Select */
.category-select {
  width: 140px;
}
/* 
:deep(.el-select .el-input__wrapper) {
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ccc;
  transition: all 0.3s;
} */

:deep(.el-select .el-input__wrapper:hover) {
  border-color: #ff6f00;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #ff6f00 inset !important;
}

:deep(.el-select-dropdown__item) {
  color: #606266;
}

:deep(.el-select-dropdown__item.hover) {
  background-color: #fff3e0;
}

:deep(.el-select-dropdown__item.selected) {
  color: #ff6f00;
  background-color: #fff3e0;
  font-weight: 700;
}

/* Price Inputs */
.price-input {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease-in-out;
  &:focus {
    border-color: #ff6f00;
  }
}
.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.price-input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}

/* Condition & Sort Options Tags/Buttons */
.condition-tags,
.sort-options {
  display: flex;
  gap: 8px;
}

.condition-tags button,
.sort-options button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 15px; /* Pill shape for conditions */
  background-color: white;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-options button {
  border-radius: 4px; /* More standard button shape for sort */
}

.condition-tags button:hover,
.sort-options button:hover {
  border-color: #ff6f00;
  background-color: #fff3e0;
  color: #ff6f00;
}

.condition-tags button.active,
.sort-options button.active {
  background-color: #ff6f00; /* Blue highlight for active */
  color: white;
  border-color: #ff6f00;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  .filter-module {
    flex-direction: column;
    align-items: flex-start;
  }
  .condition-tags,
  .sort-options {
    flex-wrap: wrap; /* Allow tags to wrap on mobile */
  }
  .price-range-filter {
    flex-direction: row; /* Keep price inputs somewhat inline */
    align-items: center;
  }
  .price-input {
    width: 60px;
  }
}
</style>
