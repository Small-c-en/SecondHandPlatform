<template>
  <div class="filter-bar-sticky-wrapper">
    <div class="filter-bar">
      <!-- 品类筛选 -->
      <div class="filter-module category-filter">
        <label for="category-select">品类:</label>
        <select
          id="category-select"
          v-model="selectedFilters.category"
          @change="applyFilter('category', $event.target.value)"
        >
          <option :value="null">全部品类</option>
          <option value="electronics">电子产品</option>
          <option value="books">图书音像</option>
          <option value="clothing">服饰鞋包</option>
          <option value="furniture">家具家居</option>
          <option value="others">其他</option>
          <!-- TODO: Replace with tree structure later -->
        </select>
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
  top: 0;
  z-index: 900;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px 20px;
  gap: 24px;
  border-bottom: 1px solid #eee;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-module {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.filter-module label {
  color: #444;
  font-weight: 500;
  white-space: nowrap;
}

/* Category Select with custom styling */
#category-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  min-width: 130px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ff5722' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

#category-select:hover {
  border-color: #ff5722;
}

#category-select:focus {
  outline: none;
  border-color: #ff5722;
  box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.1);
}

/* Price Inputs */
.price-input {
  width: 90px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  transition: all 0.2s ease;
}

.price-input:hover {
  border-color: #ff5722;
}

.price-input:focus {
  outline: none;
  border-color: #ff5722;
  box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.1);
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input[type='number'] {
  -moz-appearance: textfield;
}

/* Condition & Sort Options Tags/Buttons */
.condition-tags,
.sort-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.condition-tags button,
.sort-options button {
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background-color: white;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.condition-tags button:hover,
.sort-options button:hover {
  border-color: #ff5722;
  color: #ff5722;
  background-color: rgba(255, 87, 34, 0.05);
}

.condition-tags button.active,
.sort-options button.active {
  background-color: #ff5722;
  color: white;
  border-color: #ff5722;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 12px 15px;
  }

  .filter-module {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .condition-tags,
  .sort-options {
    width: 100%;
    gap: 6px;
  }

  .condition-tags button,
  .sort-options button {
    flex: 1;
    min-width: calc(33.33% - 6px);
    text-align: center;
    padding: 8px 4px;
  }

  .price-range-filter {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .price-input {
    width: calc(50% - 20px);
  }

  #category-select {
    width: 100%;
  }
}
</style>
