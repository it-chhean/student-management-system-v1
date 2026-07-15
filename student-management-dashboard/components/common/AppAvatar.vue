<template>
  <div class="relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden"
    :style="{ width: sizePx, height: sizePx }">
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" />
    <div v-else class="w-full h-full flex items-center justify-center font-bold text-primary-400"
      style="background: rgba(99,102,241,0.15)" :style="{ fontSize: fontSizePx }">
      {{ initials }}
    </div>
    <span v-if="online !== undefined"
      class="absolute bottom-0.5 right-0.5 rounded-full border-2"
      :class="online ? 'bg-emerald-500' : 'bg-slate-400'"
      style="border-color: var(--surface-card)"
      :style="{ width: dotSize, height: dotSize }" />
  </div>
</template>

<script setup lang="ts">
import { getInitials } from '~/utils/formatters'

const props = defineProps<{
  src?: string
  name?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
}>()

const sizeMap = { xs: '24px', sm: '32px', md: '40px', lg: '48px', xl: '64px' }
const fontSizeMap = { xs: '9px', sm: '11px', md: '14px', lg: '16px', xl: '22px' }
const dotSizeMap = { xs: '6px', sm: '8px', md: '9px', lg: '10px', xl: '12px' }

const sizePx = computed(() => sizeMap[props.size ?? 'md'])
const fontSizePx = computed(() => fontSizeMap[props.size ?? 'md'])
const dotSize = computed(() => dotSizeMap[props.size ?? 'md'])
const initials = computed(() => props.name ? getInitials(props.name) : '?')
</script>
