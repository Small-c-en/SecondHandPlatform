<template>
  <el-dialog
    v-model="visible"
    :show-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    width="60%"
    class="image-preview-dialog"
    @open="handleDialogOpen"
    @close="handleDialogClose"
  >
    <div class="image-preview-container">
      <button class="nav-button prev" @click="prevImage" v-show="currentIndex > 0">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <img :src="currentImage" :alt="'预览图片'" class="preview-image" />
      <button class="nav-button next" @click="nextImage" v-show="currentIndex < images.length - 1">
        <el-icon><ArrowRight /></el-icon>
      </button>
    </div>
    <div class="preview-thumbnails" v-if="images.length > 1">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="preview-thumbnail"
        :class="{ active: currentIndex === index }"
        @click="setCurrentImage(index)"
      >
        <img :src="image" :alt="`缩略图${index + 1}`" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  initialIndex: {
    type: Number,
    default: 0,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const currentIndex = ref(props.initialIndex)

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const currentImage = computed(() => props.images[currentIndex.value])

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

const setCurrentImage = (index) => {
  currentIndex.value = index
}

const handleDialogOpen = () => {
  document.body.style.overflow = 'hidden'
}

const handleDialogClose = () => {
  document.body.style.overflow = ''
}
</script>

<style scoped>
.image-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: #000;
}

.image-preview-container {
  position: relative;
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.preview-thumbnails {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #1a1a1a;
  overflow-x: auto;
  justify-content: center;
}

.preview-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.preview-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-thumbnail:hover {
  border-color: #fff;
}

.preview-thumbnail.active {
  border-color: #409eff;
}

/* 自定义滚动条样式 */
.preview-thumbnails::-webkit-scrollbar {
  height: 6px;
}

.preview-thumbnails::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.preview-thumbnails::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 3px;
}

.preview-thumbnails::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
