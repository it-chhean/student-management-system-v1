<template>
  <div class="min-h-screen " :class="isDark ? 'dark' : 'light'">
    <!-- Right Form Panel -->
    <div class="grid h-screen items-center justify-center py-36 sm:px-12 lg:px-16 xl:px-20"
      style="background: var(--surface-bg)">
      <div class="w-full max-w-md mx-auto lg:mx-0">
        <slot />
      </div>
      <!-- Toasts -->
      <AppToastContainer />
      <!-- Footer -->
      <div class="opacity-30 text-sm text-center">
        © {{ new Date().getFullYear() }} RUPP Management System. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppToastContainer from '~/components/common/AppToastContainer.vue'
const ui = useUiStore()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

onMounted(() => {
  // Theme handled by Nuxt Color Mode
})
</script>
