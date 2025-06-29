<template>
  <div class="lazy-image-container" :style="{ paddingTop: aspectRatio }">
    <!-- Loading placeholder -->
    <div v-if="loading" class="image-placeholder" :class="{ 'fade-out': !loading && loaded }">
      <div class="loading-spinner"></div>
    </div>

    <!-- Error placeholder -->
    <div v-if="error" class="error-placeholder">
      <i class="fas fa-image"></i>
      <span>加载失败</span>
    </div>

    <!-- Actual image (hidden until loaded) -->
    <img
      :src="imageSrc"
      :alt="alt"
      @load="onImageLoaded"
      @error="onImageError"
      :class="{ 'image-loaded': loaded && !loading }"
      :style="{
        objectFit: objectFit,
      }"
      ref="imageRef"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '图片',
  },
  ratio: {
    // width/height ratio, e.g. 4/3, 1/1, 16/9, etc.
    type: [Number, String],
    default: '1/1',
  },
  objectFit: {
    type: String,
    default: 'cover',
  },
  threshold: {
    // Intersection observer threshold
    type: Number,
    default: 0.1,
  },
})

const imageSrc = ref('')
const loading = ref(true)
const loaded = ref(false)
const error = ref(false)
const imageRef = ref(null)
const observer = ref(null)

const aspectRatio = computed(() => {
  if (typeof props.ratio === 'number') {
    return `${(1 / props.ratio) * 100}%`
  } else {
    const [width, height] = props.ratio.split('/').map(Number)
    return `${(height / width) * 100}%`
  }
})

const loadImage = () => {
  loading.value = true
  error.value = false

  // Create a new image to pre-load
  const img = new Image()

  img.onload = () => {
    imageSrc.value = props.src
    loading.value = false
  }

  img.onerror = () => {
    error.value = true
    loading.value = false
  }

  img.src = props.src
}

const onImageLoaded = () => {
  loaded.value = true
  loading.value = false
}

const onImageError = () => {
  error.value = true
  loading.value = false
}

// Setup Intersection Observer
onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer.value = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadImage()
          // Disconnect observer after load
          observer.value.disconnect()
        }
      },
      {
        threshold: props.threshold,
      },
    )

    if (imageRef.value) {
      observer.value.observe(imageRef.value)
    }
  } else {
    // Fallback for browsers that don't support Intersection Observer
    loadImage()
  }
})

// Watch for src changes and reload image
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc !== imageSrc.value) {
      loadImage()
    }
  },
)
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 8px;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-loaded {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  transition: opacity 0.3s ease;
}

.fade-out {
  opacity: 0;
}

.error-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  color: #999;
}

.error-placeholder i {
  font-size: 36px;
  margin-bottom: 8px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(255, 87, 34, 0.1);
  border-top-color: #ff5722;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
