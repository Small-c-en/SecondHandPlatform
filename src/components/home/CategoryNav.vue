<template>
  <div class="category-nav">
    <div class="category-list">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @mouseenter="activeCategory = category"
        @mouseleave="activeCategory = null"
      >
        <router-link :to="category.link" class="category-link">
          <i :class="category.icon"></i>
          <span>{{ category.name }}</span>
          <i class="fas fa-chevron-right arrow"></i>
        </router-link>

        <div v-if="activeCategory === category" class="sub-categories">
          <div v-for="subCat in category.subCategories" :key="subCat.id" class="sub-category">
            <h3>{{ subCat.name }}</h3>
            <div class="sub-category-items">
              <router-link
                v-for="item in subCat.items"
                :key="item.id"
                :to="item.link"
                class="sub-category-item"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeCategory = ref(null)

const categories = [
  {
    id: 1,
    name: '数码电子',
    icon: 'fas fa-mobile-alt',
    link: '/category/digital',
    subCategories: [
      {
        id: 1,
        name: '手机',
        items: [
          { id: 1, name: 'iPhone', link: '/category/digital/iphone' },
          { id: 2, name: '华为', link: '/category/digital/huawei' },
          { id: 3, name: '小米', link: '/category/digital/xiaomi' },
        ],
      },
      {
        id: 2,
        name: '电脑',
        items: [
          { id: 1, name: '笔记本', link: '/category/digital/laptop' },
          { id: 2, name: '台式机', link: '/category/digital/desktop' },
          { id: 3, name: '平板', link: '/category/digital/tablet' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '服装鞋包',
    icon: 'fas fa-tshirt',
    link: '/category/fashion',
    subCategories: [
      {
        id: 1,
        name: '男装',
        items: [
          { id: 1, name: 'T恤', link: '/category/fashion/men-tshirt' },
          { id: 2, name: '外套', link: '/category/fashion/men-coat' },
          { id: 3, name: '裤装', link: '/category/fashion/men-pants' },
        ],
      },
      {
        id: 2,
        name: '女装',
        items: [
          { id: 1, name: '连衣裙', link: '/category/fashion/women-dress' },
          { id: 2, name: '上衣', link: '/category/fashion/women-top' },
          { id: 3, name: '裤装', link: '/category/fashion/women-pants' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '家居家具',
    icon: 'fas fa-couch',
    link: '/category/furniture',
    subCategories: [
      {
        id: 1,
        name: '客厅',
        items: [
          { id: 1, name: '沙发', link: '/category/furniture/sofa' },
          { id: 2, name: '茶几', link: '/category/furniture/table' },
          { id: 3, name: '电视柜', link: '/category/furniture/tv-stand' },
        ],
      },
      {
        id: 2,
        name: '卧室',
        items: [
          { id: 1, name: '床', link: '/category/furniture/bed' },
          { id: 2, name: '衣柜', link: '/category/furniture/wardrobe' },
          { id: 3, name: '床头柜', link: '/category/furniture/bedside-table' },
        ],
      },
    ],
  },
  // 更多分类...
]
</script>

<style scoped>
.category-nav {
  background: white;
  border-radius: 12px;
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
  overflow: auto;
}

.category-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-item {
  position: relative;
}

.category-link {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
}

.category-link:hover {
  color: #ff5722;
  background: #fff5f2;
}

.category-link i:not(.arrow) {
  width: 24px;
  margin-right: 12px;
  font-size: 18px;
}

.arrow {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.5;
}

.sub-categories {
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 600px;
  background: white;
  border-radius: 0 12px 12px 0;
  padding: 24px;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  z-index: 100;
}

.sub-category h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.sub-category-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.sub-category-item {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.sub-category-item:hover {
  color: #ff5722;
}
</style>
