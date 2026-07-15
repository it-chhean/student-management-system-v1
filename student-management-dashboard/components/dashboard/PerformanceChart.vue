<template>
  <div class="stat-card rounded-lg p-5">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="font-display font-bold text-base" style="color: var(--text-primary)">Grade Distribution</h3>
        <p class="text-xs mt-0.5" style="color: var(--text-muted)">Student performance breakdown</p>
      </div>
      <span class="badge-primary badge text-xs">Fall 2024</span>
    </div>

    <div class="h-48 flex items-center justify-center">
      <Doughnut v-if="chartLoaded" :data="chartData" :options="chartOptions" />
      <div v-else class="w-48 h-48 skeleton rounded-full" />
    </div>

    <!-- Legend grid -->
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-5">
      <div v-for="(label, i) in chartData.labels" :key="label" class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="`background: ${chartData.datasets[0].backgroundColor[i]}`" />
        <span class="text-xs" style="color: var(--text-muted)">{{ label }}</span>
        <span class="ml-auto text-xs font-semibold" style="color: var(--text-primary)">
          {{ chartData.datasets[0].data[i] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { mockPerformanceData } from '~/utils/mock-data'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartLoaded = ref(false)
const ui = useUiStore()
onMounted(() => { setTimeout(() => chartLoaded.value = true, 400) })

const chartData = computed(() => mockPerformanceData)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: ui.isDark ? '#141c2e' : '#fff',
      titleColor: ui.isDark ? '#f1f5f9' : '#0f172a',
      bodyColor: ui.isDark ? '#94a3b8' : '#475569',
      borderColor: ui.isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
    },
  },
}))
</script>
