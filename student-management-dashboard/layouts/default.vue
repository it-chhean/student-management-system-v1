<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar Overlay (Mobile) -->
    <Transition name="modal-overlay">
      <div
        v-if="sidebarOpen && isMobile && isMounted"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        @click="ui.setSidebarOpen(false)"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="sidebar">
      <AppSidebar
        v-show="showSidebar"
        class="fixed lg:relative z-50 lg:z-auto"
      />
    </Transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navbar -->
      <AppNavbar />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[var(--surface-bg)] transition-colors duration-300">
        <div class="max-w-screen-2xl mx-auto animate-fade-in">
          <slot />
        </div>
      </main>
    </div>

    <!-- Toast Container -->
    <AppToastContainer />

    <!-- Confirm Modal -->
    <AppModal />
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const ui = useUiStore()
const auth = useAuthStore()
const { width } = useWindowSize()
const isMounted = ref(false)

const isMobile = computed(() => width.value < 1024)
const sidebarOpen = computed(() => ui.sidebarOpen)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const showSidebar = computed(() => {
  if (!isMounted.value) return true
  return sidebarOpen.value || !isMobile.value
})

// Auto-close sidebar on mobile route change
const route = useRoute()
watch(() => route.path, () => {
  if (isMobile.value) ui.setSidebarOpen(false)
})

// Initialize sidebar based on viewport
onMounted(() => {
  isMounted.value = true
  if (!auth.user) {
    auth.fetchProfile()
  }
  if (isMobile.value) ui.setSidebarOpen(false)

  // Mock login for development (removed for real authentication)
  // if (!auth.isAuthenticated) {
  //   auth.mockLogin()
  // }
})
</script>