<template>
  <aside class="sidebar h-full flex flex-col transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-[72px]' : 'w-64'">
    <!-- Logo Header -->
    <div class="flex items-center justify-between px-4 h-16 shrink-0"
      style="border-bottom: 1px solid var(--sidebar-border)">
      <NuxtLink to="/dashboard" class="flex items-center gap-3 min-w-0">
        <div class="w-14">
          <img src="../../assets/css/images/rupp-logo.png" alt="logo">
        </div>
        <Transition name="fade">
          <div v-if="!collapsed" class="truncate">
            <div class="font-display text-base font-bold text-white leading-tight">Royal University of Phnom Penh</div>
            <div class="text-[10px] font-semibold text-primary-400 tracking-wider uppercase">admin</div>
          </div>
        </Transition>
      </NuxtLink>

      <!-- Collapse toggle (desktop only) -->
      <button
        class="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg transition-colors hover:bg-white/5 shrink-0"
        style="color: var(--sidebar-text)" @click="toggleCollapse">
        <svg class="w-4 h-4 transition-transform duration-300" :class="collapsed ? 'rotate-180' : ''" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      <template v-for="section in navSections" :key="section.section">
        <!-- Section Label -->
        <div v-if="!collapsed" class="nav-section-label">
          {{ section.section }}
        </div>
        <div v-else class="h-4" />

        <!-- Nav Items -->
        <div v-for="item in section.items" :key="item.label" class="space-y-0.5">
          <!-- Parent Item -->
          <div v-if="item.children" class="nav-item group cursor-pointer" :class="{ active: isDropdownActive(item) }"
            @click="toggleDropdown(item.label)">
            <span class="shrink-0 w-5 h-5 flex items-center justify-center">
              <NavIcon :name="item.icon" class="w-[18px] h-[18px]" />
            </span>
            <Transition name="fade">
              <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
            </Transition>
            <Transition name="fade">
              <svg v-if="!collapsed" class="w-3.5 h-3.5 transition-transform duration-200"
                :class="openDropdowns.includes(item.label) ? 'rotate-180' : ''" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Transition>
          </div>

          <!-- Single Item -->
          <NuxtLink v-else :to="item.to" class="nav-item group" :class="{ active: isActive(item.to) }"
            :title="collapsed ? item.label : undefined">
            <span class="shrink-0 w-5 h-5 flex items-center justify-center">
              <NavIcon :name="item.icon" class="w-[18px] h-[18px]" />
            </span>
            <Transition name="fade">
              <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
            </Transition>
            <Transition name="fade">
              <span v-if="!collapsed && item.badge" class="nav-badge">
                {{ item.badge }}
              </span>
            </Transition>
          </NuxtLink>

          <!-- Children -->
          <Transition name="expand">
            <div v-if="item.children && openDropdowns.includes(item.label) && !collapsed"
              class="ml-2.5 py-2.5 border-l border-indigo-500 space-y-2 overflow-hidden">
              <NuxtLink v-for="sub in item.children" :key="sub.to" :to="sub.to"
                class="nav-sub-item flex items-center h-8 px-4 rounded-lg text-sm transition-colors hover:bg-white/5"
                :class="isActive(sub.to) ? 'text-primary-400 bg-primary-500/10' : 'text-white/60'">
                {{ sub.label }}
              </NuxtLink>
            </div>
          </Transition>
        </div>
      </template>
    </nav>

    <!-- Bottom User Profile -->
    <div class="shrink-0 p-3" style="border-top: 1px solid var(--sidebar-border)">
      <div class="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
        @click="!collapsed && navigateTo('/settings')">
        <div class="relative shrink-0">
          <img v-if="user?.avatar" :src="user.avatar" :alt="user.fullName" class="w-8 h-8 rounded-lg object-cover" />
          <div v-else
            class="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">
            {{ initials }}
          </div>
          <!-- Online dot -->
          <span
            class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--sidebar-bg)]" />
        </div>

        <Transition name="fade">
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <div class="text-sm font-medium text-white truncate">{{ user?.fullName ?? 'Guest' }}</div>
            <div class="text-xs truncate" style="color: var(--sidebar-text)">{{ roleLabel }}</div>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">

const ui = useUiStore()
const auth = useAuthStore()
const route = useRoute()

const collapsed = computed(() => ui.sidebarCollapsed)
const user = computed(() => auth.user)
const initials = computed(() => getInitials(user.value?.fullName))
const roleLabel = computed(() => {
  const role = user.value?.role
  if (!role) return 'User'
  return ROLE_LABELS[role] ?? role.replace('ROLE_', '').toLowerCase()
})
const navSections = computed(() => {
  const { canAny } = usePermission()

  return NAV_ITEMS.map(section => {
    const filteredItems = section.items.filter(item => {
      if (item.roles && item.roles.length > 0) {
        return canAny(item.roles)
      }
      return true
    }).map(item => {
      // Also filter children if any
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            return true
          })
        }
      }
      return item
    })

    return {
      ...section,
      items: filteredItems
    }
  }).filter(section => section.items.length > 0)
})

const openDropdowns = ref<string[]>([])

// Auto-open dropdown if child is active
watch(() => route.path, (path) => {
  navSections.value.forEach(section => {
    section.items.forEach((item: any) => {
      if (item.children && item.children.some((sub: any) => path.startsWith(sub.to))) {
        if (!openDropdowns.value.includes(item.label)) {
          openDropdowns.value.push(item.label)
        }
      }
    })
  })
}, { immediate: true })

const isActive = (to: string) => {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

const isDropdownActive = (item: any) => {
  return item.children?.some((sub: any) => route.path.startsWith(sub.to))
}

const toggleDropdown = (label: string) => {
  const index = openDropdowns.value.indexOf(label)
  if (index === -1) openDropdowns.value.push(label)
  else openDropdowns.value.splice(index, 1)
}

const toggleCollapse = () => ui.toggleSidebarCollapse()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 200px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
