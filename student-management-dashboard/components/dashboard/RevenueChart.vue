<template>
  <div class="stat-card rounded-lg p-5">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="font-display font-bold text-base" style="color: var(--text-primary)">Revenue Overview</h3>
        <p class="text-sm mt-0.5" style="color: var(--text-muted)">Income vs. Expenses this year</p>
      </div>
      <div class="flex items-center gap-2">
        <button v-for="period in ['1M','3M','6M','1Y']" :key="period"
          class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
          :class="activePeriod === period
            ? 'bg-primary-600 text-white shadow-glow'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'"
          @click="activePeriod = period">
          {{ period }}
        </button>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-5 mb-4">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-primary-500" />
        <span class="text-xs" style="color: var(--text-muted)">Revenue</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-amber-500" />
        <span class="text-xs" style="color: var(--text-muted)">Expenses</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-56 relative">
      <Line v-if="chartLoaded" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full skeleton rounded-xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js'
import { mockRevenueData } from '~/utils/mock-data'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const activePeriod = ref('1Y')
const chartLoaded = ref(false)
const ui = useUiStore()

onMounted(() => { setTimeout(() => chartLoaded.value = true, 300) })

const chartData = computed(() => mockRevenueData)

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: ui.isDark ? '#141c2e' : '#fff',
      titleColor: ui.isDark ? '#f1f5f9' : '#0f172a',
      bodyColor: ui.isDark ? '#94a3b8' : '#475569',
      borderColor: ui.isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
          ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: ui.isDark ? '#475569' : '#94a3b8', font: { size: 11 } },
    },
    y: {
      grid: { color: ui.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
      border: { display: false },
      ticks: {
        color: ui.isDark ? '#475569' : '#94a3b8',
        font: { size: 11 },
        callback: (v: unknown) => `$${Number(v) / 1000}K`,
      },
    },
  },
}))
</script>
