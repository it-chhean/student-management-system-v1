<template>
  <div class="stat-card will-change-transform rounded-lg p-5 transition-colors duration-200" style="transform: translateZ(0)" >
    <div class="flex items-start justify-between mb-4">
      <!-- Icon -->
      <!-- <div class="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        :style="`background: ${iconBg}`">
        <svg class="w-5 h-5" :style="`color: ${iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-html="iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"/>
        </svg>
      </div> -->

      <!-- Trend badge -->
      <div v-if="trend !== undefined"
        class="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
        :class="trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
            :d="trend >= 0 ? 'M13 7l5 5m0 0l-5 5m5-5H6' : 'M13 17l5-5m0 0l-5-5m5 5H6'" />
        </svg>
        {{ Math.abs(trend) }}%
      </div>
    </div>

    <!-- Value -->
    <div class="space-y-1">
      <div v-if="loading" class="skeleton h-8 w-24 rounded-lg" />
      <div v-else class="font-display text-2xl font-bold" style="color: var(--text-primary)">
        {{ formattedValue }}
      </div>
      <div class="text-base font-medium" style="color: var(--text-secondary)">{{ label }}</div>
      <div v-if="subtext" class="text-sm" style="color: var(--text-muted)">{{ subtext }}</div>
    </div>

    <!-- Mini sparkline area (decorative) -->
    <div class="mt-4 h-1 rounded-full overflow-hidden" style="background: var(--surface-hover)">
      <div class="h-full rounded-full transition-all duration-1000"
        :style="`width: ${fillPercent}%; background: ${iconColor}; opacity: 0.6`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatNumber, formatPercent } from '~/utils/formatters'

const props = withDefaults(
  defineProps<{
    label: string
    value?: number
    format?: 'number' | 'currency' | 'percent'
    trend?: number
    subtext?: string
    icon: string
    iconColor: string
    iconBg: string
    loading?: boolean
    fillPercent?: number
  }>(),
  {
    value: 0
  }
)

const formattedValue = computed(() => {
  const value = props.value ?? 0
  if (props.format === 'currency') return formatCurrency(value)
  if (props.format === 'percent') return formatPercent(value)
  return formatNumber(value)
})

const iconPaths: Record<string, string> = {
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11l2 2 4-4',
  'book-open': 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  'dollar-sign': 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  'trending-up': 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
  award: 'M12 15l-3 6 3-1.5 3 1.5-3-6zM12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2z',
}

const iconPath = computed(() => iconPaths[props.icon] ?? iconPaths.users)
</script>

<style scoped>
.will-change-transform {
  will-change: transform;
}
</style>
