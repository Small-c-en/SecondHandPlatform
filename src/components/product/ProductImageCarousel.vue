<template>
  <div class="product-image-carousel" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
    <div
      class="main-image"
      @mouseenter="startZoom"
      @mouseleave="stopZoom"
      @mousemove="handleZoom"
      ref="imageContainer"
    >
      <img :src="images[currentIndex]" :alt="`商品图片${currentIndex + 1}`" ref="mainImage" />
      <div class="zoom-lens" v-if="isZooming" :style="zoomLensStyle"></div>
      <div class="zoom-result" v-if="isZooming" :style="zoomResultStyle"></div>
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
const imageContainer = ref(null)
const mainImage = ref(null)
const zoomLensStyle = ref({})
const zoomResultStyle = ref({})
const zoomLensSize = 160 // 放大镜尺寸，变大
const zoomResultBox = {
  width: 400,
  height: 400,
  gap: 24, // 右侧间距
}

const updateZoomResultPosition = () => {
  if (!imageContainer.value) return
  const rect = imageContainer.value.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.right + zoomResultBox.gap + window.scrollX,
  }
}

function getImageUrl(src) {
  if (!src) return ''
  if (/^https?:\/\//.test(src)) return src // 网络图片
  if (src.startsWith('/')) return src // public 目录
  try {
    return new URL(`@/assets/${src}`, import.meta.url).href // assets 目录
  } catch {
    return src
  }
}

const handleZoom = (event) => {
  if (!isZooming.value || !imageContainer.value || !mainImage.value) return

  const container = imageContainer.value.getBoundingClientRect()
  const imgEl = mainImage.value
  const imgWidth = imgEl.clientWidth
  const imgHeight = imgEl.clientHeight

  // 计算鼠标相对于图片容器的位置
  let mouseX = event.clientX - container.left
  let mouseY = event.clientY - container.top

  // 计算镜头的一半尺寸用于边界检测和居中
  const halfLensSize = zoomLensSize / 2

  // 边界检测和约束
  if (mouseX - halfLensSize < 0) mouseX = halfLensSize
  if (mouseY - halfLensSize < 0) mouseY = halfLensSize
  if (mouseX + halfLensSize > container.width) mouseX = container.width - halfLensSize
  if (mouseY + halfLensSize > container.height) mouseY = container.height - halfLensSize

  // 更新镜头位置
  zoomLensStyle.value = {
    left: `${mouseX - halfLensSize}px`,
    top: `${mouseY - halfLensSize}px`,
    width: `${zoomLensSize}px`,
    height: `${zoomLensSize}px`,
  }

  // 计算放大比例
  const scale = zoomResultBox.width / zoomLensSize
  // 计算背景尺寸（用主图实际渲染宽高）
  const bgWidth = imgWidth * scale
  const bgHeight = imgHeight * scale

  // 计算背景位置
  const lensX = mouseX - halfLensSize
  const lensY = mouseY - halfLensSize
  const percentX = lensX / (container.width - zoomLensSize)
  const percentY = lensY / (container.height - zoomLensSize)
  const bgPosX = -percentX * (bgWidth - zoomResultBox.width)
  const bgPosY = -percentY * (bgHeight - zoomResultBox.height)

  // 计算 zoom-result 的悬浮位置
  const pos = updateZoomResultPosition()

  // 设置放大结果样式
  zoomResultStyle.value = {
    backgroundImage: `url('${getImageUrl(props.images[currentIndex.value])}')`,
    backgroundSize: `${bgWidth}px ${bgHeight}px`,
    backgroundPosition: `${bgPosX}px ${bgPosY}px`,
    width: `${zoomResultBox.width}px`,
    height: `${zoomResultBox.height}px`,
    position: 'fixed',
    top: pos ? `${pos.top}px` : '0',
    left: pos ? `${pos.left}px` : '0',
    border: '2px solid #ff6f00',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#fff',
    pointerEvents: 'none',
    zIndex: 1000,
  }
}

const startZoom = (event) => {
  isZooming.value = true
  handleZoom(event)
}

// 停止放大
const stopZoom = () => {
  isZooming.value = false
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
  cursor: crosshair; /* 十字光标，表明可放大 */
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
  border: 1px solid #ff6f00;
  background-color: rgba(255, 111, 0, 0.1);
  cursor: crosshair;
  pointer-events: none; /* 让鼠标事件穿透到下层元素 */
}

/* 放大结果容器样式 */
.zoom-result {
  /* 样式由JS动态控制 */
}

@media (max-width: 1200px) {
  .zoom-result {
    display: none;
  }
}
</style>
