<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" style="max-width: 360px; width: 100%">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-md shadow-modal"
          style="background: var(--surface-card); border: 1px solid var(--surface-border)"
        >
          <!-- Icon -->
          <div class="mt-0.5 w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
            :class="iconBg(toast.type)">
            <svg class="w-4 h-4" :class="iconColor(toast.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="toast.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              <path v-else-if="toast.type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              <path v-else-if="toast.type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold" style="color: var(--text-primary)">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs mt-0.5 leading-relaxed" style="color: var(--text-secondary)">{{ toast.message }}</p>
            <button v-if="toast.action" class="text-xs font-semibold text-primary-400 mt-1.5 hover:underline" @click="toast.action!.onClick">
              {{ toast.action.label }}
            </button>
          </div>

          <!-- Close -->
          <button class="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-hover)] shrink-0"
            style="color: var(--text-muted)" @click="ui.removeToast(toast.id)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const ui = useUiStore()
const toasts = computed(() => ui.toasts)

const iconBg = (type: string) => ({
  'bg-emerald-500/15': type === 'success',
  'bg-red-500/15': type === 'error',
  'bg-amber-500/15': type === 'warning',
  'bg-blue-500/15': type === 'info',
})

const iconColor = (type: string) => ({
  'text-emerald-400': type === 'success',
  'text-red-400': type === 'error',
  'text-amber-400': type === 'warning',
  'text-blue-400': type === 'info',
})

</script>
