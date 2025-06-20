<template>
  <div class="product-image-carousel" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
    <div class="main-image">
      <img :src="images[currentIndex]" :alt="`商品图片${currentIndex + 1}`" />
      <div class="zoom-lens" v-if="isZooming" :style="zoomLensStyle" @mousemove="handleZoom"></div>
      <div class="zoomed-image" v-if="isZooming" :style="zoomedImageStyle"></div>
    </div>

    <div class="thumbnails-container">
      <button
        class="thumb-control prev"
        @click="handlePrevClick"
        :disabled="props.images.length <= 1"
      >
        <el-icon><ArrowLeft /></el-icon>
      </button>

      <div class="thumbnails-track-container">
        <div class="thumbnails-track" :style="trackStyle">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="thumbnail"
            :class="{ active: currentIndex === index }"
            @click="setCurrentImage(index)"
          >
            <img :src="image" :alt="`缩略图${index + 1}`" />
          </div>
        </div>
      </div>

      <button
        class="thumb-control next"
        @click="handleNextClick"
        :disabled="props.images.length <= 1"
      >
        <el-icon><ArrowRight /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  autoPlayInterval: {
    type: Number,
    default: 3000,
  },
})

const currentIndex = ref(0)
const isZooming = ref(false)
const thumbnailStartIndex = ref(0)
const THUMBNAIL_WIDTH = 100 // 包含margin的总宽度
const VISIBLE_THUMBNAILS = 5
let autoPlayTimer = null

const trackStyle = computed(() => ({
  transform: `translateX(-${thumbnailStartIndex.value * THUMBNAIL_WIDTH}px)`,
  transition: 'transform 0.3s ease',
}))

const handlePrevClick = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.images.length - 1
  }
  updateThumbnailPosition()
}

const handleNextClick = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  updateThumbnailPosition()
}

const setCurrentImage = (index) => {
  currentIndex.value = index
  updateThumbnailPosition()
}

const updateThumbnailPosition = () => {
  // 确保当前选中的缩略图在可视区域内
  if (currentIndex.value < thumbnailStartIndex.value) {
    thumbnailStartIndex.value = currentIndex.value
  } else if (currentIndex.value >= thumbnailStartIndex.value + VISIBLE_THUMBNAILS) {
    thumbnailStartIndex.value = currentIndex.value - VISIBLE_THUMBNAILS + 1
  }
}

// 自动播放相关
const startAutoPlay = () => {
  if (props.images.length > 1) {
    autoPlayTimer = setInterval(handleNextClick, props.autoPlayInterval)
  }
}

const pauseAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
}

const resumeAutoPlay = () => {
  pauseAutoPlay()
  startAutoPlay()
}

// 图片放大功能相关
const zoomLensStyle = ref({})
const zoomedImageStyle = ref({})

const handleZoom = (event) => {
  if (!isZooming.value) return

  const image = event.target
  const { left, top } = image.getBoundingClientRect()
  const x = event.clientX - left
  const y = event.clientY - top

  zoomLensStyle.value = {
    left: `${x}px`,
    top: `${y}px`,
  }

  zoomedImageStyle.value = {
    backgroundImage: `url(${props.images[currentIndex.value]})`,
    backgroundPosition: `-${x * 2}px -${y * 2}px`,
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  pauseAutoPlay()
})
</script>

<style lang="scss" scoped>
.product-image-carousel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  height: 400px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnails-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  position: relative;
}

.thumbnails-track-container {
  width: calc(500px + 40px); /* 5个缩略图的宽度(5 * 100px) + 间距 */
  overflow: hidden;
  margin: 0 40px;
}

.thumbnails-track {
  display: flex;
  gap: 10px;
  width: max-content;
}

.thumbnail {
  flex: 0 0 90px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #ff6f00;
}

.thumbnail.active {
  border-color: #ff6f00;
}

.thumb-control {
  position: absolute;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;
  /* color: #666; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.thumb-control.prev {
  left: 0;
  &:hover:not(:disabled) {
    transform: translateX(-2px);
  }
}

.thumb-control.next {
  right: 0;
  &:hover:not(:disabled) {
    transform: translateX(2px);
  }
}

.thumb-control:hover:not(:disabled) {
  background: white;
  border: 1px solid #ff6f007e;
  color: #ff6f00;
  transform: scale(1.1);
}

.thumb-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 放大镜效果 */
.zoom-lens {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.3);
  cursor: none;
  pointer-events: none;
}

.zoomed-image {
  position: absolute;
  top: 0;
  left: 100%;
  width: 400px;
  height: 400px;
  background-size: 200%;
  border: 1px solid #eee;
  display: none;
}

.main-image:hover .zoomed-image {
  display: block;
}
</style>
