<!-- AppBadge -->
<template>
  <span class="badge" :class="badgeClass">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-lg bg-current" />
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'muted'
  dot?: boolean
}>()

const badgeClass = computed(() => `badge-${props.variant ?? 'muted'}`)
</script>
