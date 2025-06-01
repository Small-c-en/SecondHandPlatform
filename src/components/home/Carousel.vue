<template>
  <div class="carousel-container">
    <div class="carousel" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
      <div class="carousel-items" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(slide, index) in slides" :key="index" class="carousel-item">
          <img :src="slide.image" :alt="slide.title" />
          <div class="carousel-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
            <button class="cta-button" @click="handleSlideAction(slide)">
              {{ slide.buttonText }}
            </button>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <button class="nav-button prev" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="nav-button next" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- 指示器 -->
      <div class="indicators">
        <button
          v-for="(_, index) in slides"
          :key="index"
          :class="['indicator', { active: currentIndex === index }]"
          @click="goToSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟轮播数据
const slides = [
  {
    image:
      'https://assets.puxiang.com/uploads/photo/image/331225/bc13d448acbf6d41ef7532d65347d516.jpg-photo_sp',
    title: '限时特惠',
    description: '精选二手数码产品，低至5折',
    buttonText: '立即抢购',
    action: '/products?category=digital&discount=true',
  },
  {
    image:
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.qG95FMXqqCOxOjiLJfxEuwHaD4?w=334&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    title: '品质保证',
    description: '官方验机，品质无忧',
    buttonText: '查看详情',
    action: '/guarantee',
  },
  {
    image:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.kZtQCYko4qnzbZslUNMoJQHaDw?w=344&h=177&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    title: '新品上架',
    description: '潮流好物，每日更新',
    buttonText: '去看看',
    action: '/new-arrivals',
  },
]

const currentIndex = ref(0)
const autoPlayInterval = ref(null)
const autoPlayDelay = 5000 // 5秒切换一次

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const handleSlideAction = (slide) => {
  router.push(slide.action)
}

const startAutoPlay = () => {
  if (!autoPlayInterval.value) {
    autoPlayInterval.value = setInterval(nextSlide, autoPlayDelay)
  }
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  margin-bottom: 40px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  margin-top: 20px;
}

.carousel-items {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex: 0 0 100%;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: -webkit-optimize-contrast; /* Webkit 内核（Chrome/Safari） */
  image-rendering: optimize-contrast; /* 通用 */
}

.carousel-content {
  position: absolute;
  bottom: 60px;
  left: 60px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.carousel-content h2 {
  font-size: 36px;
  margin: 0 0 12px;
}

.carousel-content p {
  font-size: 18px;
  margin: 0 0 24px;
  opacity: 0.9;
}

.cta-button {
  padding: 12px 32px;
  font-size: 18px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: #f4511e;
  transform: translateY(-2px);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 87, 34, 0.15);
  color: #ff5722;
  border: none;
  width: 40px;
  height: 80px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.nav-button:hover {
  background: rgba(255, 87, 34, 0.25);
}

.nav-button i {
  font-size: 20px;
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #ff5722;
  transform: scale(1.2);
}
</style>
