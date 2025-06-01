<template>
  <div class="image-carousel">
    <div class="main-image">
      <img :src="images[currentIndex]" :alt="`商品图片 ${currentIndex + 1}`" />
    </div>

    <div class="thumbnails-container">
      <button class="nav-button prev" @click="scrollThumbnails('prev')" :disabled="isScrollStart">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="thumbnails-wrapper" ref="thumbnailsWrapper">
        <div
          class="thumbnails"
          ref="thumbnailsTrack"
          :style="{ transform: `translateX(${scrollPosition}px)` }"
        >
          <div
            v-for="(image, index) in images"
            :key="index"
            :class="['thumbnail', { active: index === currentIndex }]"
            @click="setCurrentImage(index)"
          >
            <img :src="image" :alt="`缩略图 ${index + 1}`" />
          </div>
        </div>
      </div>

      <button class="nav-button next" @click="scrollThumbnails('next')" :disabled="isScrollEnd">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const currentIndex = ref(0)
const thumbnailsWrapper = ref(null)
const thumbnailsTrack = ref(null)
const scrollPosition = ref(0)
const thumbnailWidth = 80 // 缩略图宽度 + 间距
const scrollStep = thumbnailWidth * 2 // 每次滚动2个缩略图的距离

const isScrollStart = computed(() => scrollPosition.value >= 0)
const isScrollEnd = computed(() => {
  if (!thumbnailsWrapper.value || !thumbnailsTrack.value) return true
  const wrapperWidth = thumbnailsWrapper.value.clientWidth
  const trackWidth = thumbnailsTrack.value.scrollWidth
  return Math.abs(scrollPosition.value) >= trackWidth - wrapperWidth
})

const setCurrentImage = (index) => {
  currentIndex.value = index
}

const scrollThumbnails = (direction) => {
  const wrapperWidth = thumbnailsWrapper.value.clientWidth
  const trackWidth = thumbnailsTrack.value.scrollWidth
  const maxScroll = -(trackWidth - wrapperWidth)

  if (direction === 'next') {
    scrollPosition.value = Math.max(maxScroll, scrollPosition.value - scrollStep)
  } else {
    scrollPosition.value = Math.min(0, scrollPosition.value + scrollStep)
  }
}

onMounted(() => {
  // 初始化时检查是否需要显示导航按钮
  const wrapperWidth = thumbnailsWrapper.value.clientWidth
  const trackWidth = thumbnailsTrack.value.scrollWidth
})
</script>

<style scoped>
.image-carousel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnails-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.thumbnails-wrapper {
  flex: 1;
  overflow: hidden;
}

.thumbnails {
  display: flex;
  gap: 10px;
  transition: transform 0.3s ease;
}

.thumbnail {
  flex: 0 0 70px;
  height: 70px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail.active {
  border-color: #ff6f00;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-button {
  width: 24px;
  height: 70px;
  border: none;
  background-color: rgba(0, 0, 0, 0.1);
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.2);
  color: #333;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button i {
  font-size: 14px;
}
</style>
