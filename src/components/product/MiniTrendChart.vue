<template>
  <div class="mini-trend-chart">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <path
        :d="pathD"
        fill="none"
        stroke="#007AFF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-for="(point, index) in points"
        :key="index"
        :cx="point.x"
        :cy="point.y"
        r="2"
        fill="#007AFF"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 40,
  },
})

const points = computed(() => {
  const max = Math.max(...props.data)
  const min = Math.min(...props.data)
  const range = max - min || 1

  return props.data.map((value, index) => ({
    x: (index * (props.width - 4)) / (props.data.length - 1) + 2,
    y: props.height - ((value - min) * (props.height - 4)) / range - 2,
  }))
})

const pathD = computed(() => {
  if (points.value.length < 2) return ''

  return points.value.reduce((path, point, index) => {
    return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
  }, '')
})
</script>

<style scoped>
.mini-trend-chart {
  display: inline-block;
}
</style>
