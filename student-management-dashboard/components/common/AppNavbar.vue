<template>
  <header class="h-16 flex items-center gap-2 px-4 md:px-6 shrink-0 relative z-30"
    style="background: var(--surface-card); border-bottom: 1px solid var(--surface-border)">

    <!-- Mobile Menu Toggle -->
    <button
      class="btn-ghost w-12 h-11 rounded-lg lg:hidden"
      @click="ui.toggleSidebar()"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Breadcrumb -->
    <AppBreadcrumb class="hidden md:flex flex-1" />
    <div class="flex-1 md:hidden" />

    <!-- Right Section -->
    <div class="flex items-center gap-2">

      <!-- Search Button -->
      <button
        class="btn-ghost w-12 h-11 rounded-lg"
        title="Global Search (⌘K)"
        @click="ui.openGlobalSearch()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Theme Toggle -->
      <button
        class="btn-ghost w-12 h-11 rounded-lg"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme()"
      >
        <Transition name="scale-in" mode="out-in">
          <svg v-if="isDark" key="sun" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" stroke-width="2"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else key="moon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </Transition>
      </button>

      <!-- Notifications -->
      <div class="relative" ref="notifRef">
        <button
          class="btn-ghost w-12 h-11 rounded-lg relative"
          @click="notifOpen = !notifOpen"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="unreadCount > 0"
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <!-- Notification Dropdown -->
        <Transition name="dropdown">
          <div v-if="notifOpen"
            class="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-md overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)">
            <div class="flex items-center justify-between px-4 py-3"
              style="border-bottom: 1px solid var(--surface-border)">
              <span class="font-semibold text-sm" style="color: var(--text-primary)">Notifications</span>
              <span v-if="unreadCount" class="text-xs text-primary-400 cursor-pointer hover:underline"
                @click="markAllRead">Mark all read</span>
            </div>

            <div class="max-h-80 overflow-y-auto">
              <div v-for="n in notifications" :key="n.id"
                class="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                :class="!n.read ? 'bg-primary-500/5' : ''"
                style="border-bottom: 1px solid var(--surface-border)"
                @click="handleNotifClick(n)">
                <div class="mt-0.5 w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                  :class="notifIconClass(n.type)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="n.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    <path v-else-if="n.type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    <path v-else-if="n.type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate" style="color: var(--text-primary)">{{ n.title }}</div>
                  <div class="text-xs mt-0.5 leading-relaxed" style="color: var(--text-secondary)">{{ n.message }}</div>
                  <div class="text-xs mt-1" style="color: var(--text-muted)">{{ formatRelative(n.createdAt) }}</div>
                </div>
                <div v-if="!n.read" class="mt-1 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              </div>
            </div>

            <div class="px-4 py-2.5" style="border-top: 1px solid var(--surface-border)">
              <NuxtLink to="/notifications" class="text-xs text-primary-400 hover:underline"
                @click="notifOpen = false">
                View all notifications
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Profile Dropdown -->
      <div class="relative" ref="profileRef">
        <button
          class="flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors hover:bg-[var(--surface-hover)]"
          @click="profileOpen = !profileOpen"
        >
          <img
            v-if="user?.avatar"
            :src="user.avatar"
            :alt="user?.fullName"
            class="w-7 h-7 rounded-lg object-cover"
          />
          <div v-else
            class="w-10 h-10 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-xs font-bold">
            {{ initials }}
          </div>
          <div class="hidden sm:block text-left">
            <div class="text-sm font-medium leading-tight" style="color: var(--text-primary)">
              {{ user?.fullName ?? 'Guest' }}
            </div>
            <div class="text-xs leading-tight" style="color: var(--text-muted)">
              {{ roleLabel }}
            </div>
          </div>
          <svg class="w-3.5 h-3.5 ml-0.5" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Profile Menu -->
        <Transition name="dropdown">
          <div v-if="profileOpen"
            class="absolute right-0 top-full mt-2 w-52 rounded-lg shadow-md overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)">
            <div class="px-4 py-3" style="border-bottom: 1px solid var(--surface-border)">
              <div class="text-sm font-semibold" style="color: var(--text-primary)">{{ user?.fullName }}</div>
              <div class="text-xs mt-0.5 truncate" style="color: var(--text-muted)">{{ user?.email }}</div>
            </div>
            <div class="py-1">
              <NuxtLink v-for="item in profileItems" :key="item.label"
                :to="item.to"
                class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                style="color: var(--text-secondary)"
                :class="item.danger ? 'hover:text-red-400 hover:bg-red-500/5' : 'hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'"
                @click="profileOpen = false; item.action?.()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-html="item.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { mockNotifications } from '~/utils/mock-data'
import { formatRelative, getInitials } from '~/utils/formatters'
import { ROLE_LABELS } from '~/utils/constants'

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const user = computed(() => auth.user)
const initials = computed(() => user.value ? getInitials(user.value.fullName) : 'G')
const roleLabel = computed(() => ROLE_LABELS[user.value?.role ?? ''] ?? 'User')

// Notifications
const notifRef = ref<HTMLElement>()
const notifOpen = ref(false)
const notifications = ref(mockNotifications)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
onClickOutside(notifRef, () => { notifOpen.value = false })

const notifIconClass = (type: string) => ({
  'bg-emerald-500/10 text-emerald-400': type === 'success',
  'bg-amber-500/10 text-amber-400': type === 'warning',
  'bg-red-500/10 text-red-400': type === 'error',
  'bg-blue-500/10 text-blue-400': type === 'info',
})

const markAllRead = () => { notifications.value.forEach(n => n.read = true) }
const handleNotifClick = (n: typeof notifications.value[0]) => {
  n.read = true
  notifOpen.value = false
  if (n.link) router.push(n.link)
}

// Profile
const profileRef = ref<HTMLElement>()
const profileOpen = ref(false)
onClickOutside(profileRef, () => { profileOpen.value = false })

const profileItems = [
  { label: 'My Profile', to: '/settings', iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { label: 'Account Settings', to: '/settings', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { label: 'Sign Out', to: '/auth/login', iconPath: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', danger: true, action: () => auth.logout() },
]
</script>