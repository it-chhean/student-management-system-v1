<template>
  <div class="space-y-6">
    <div class="page-header">
      <h1>Settings</h1>
      <p>Manage your account, preferences, and system configuration.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings Nav -->
      <div class="stat-card rounded-lg p-3 h-fit">
        <nav class="space-y-0.5">
          <button v-for="item in settingsTabs" :key="item.key"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="activeTab === item.key
              ? 'bg-primary-500/10 text-primary-400'
              : 'hover:bg-[var(--surface-hover)]'"
            :style="activeTab !== item.key ? 'color: var(--text-secondary)' : ''"
            @click="activeTab = item.key">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
            </svg>
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3 space-y-4">

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="stat-card rounded-lg p-6 space-y-6">
          <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">Profile Information</h2>

          <!-- Avatar -->
          <div class="flex items-center gap-5">
            <div class="relative">
              <img v-if="user?.avatar" :src="user.avatar" class="w-20 h-20 rounded-lg object-cover" :alt="user.fullName"/>
              <div v-else class="w-20 h-20 rounded-full bg-primary-600/20 flex items-center justify-center">
                <span class="font-display text-2xl font-boldlg text-primary-400">{{ initials }}</span>
              </div>
              <button class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center shadow-glow">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
            <div>
              <div class="font-display font-bold text-lg" style="color: var(--text-primary)">{{ user?.fullName }}</div>
              <div class="text-sm" style="color: var(--text-muted)">{{ user?.email }}</div>
              <button class="btn-secondary text-xs mt-2 py-1.5 px-3">Change Photo</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Full Name</label>
              <input v-model="profileForm.name" type="text" class="input-field" :placeholder="user?.fullName"/>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Email Address</label>
              <input v-model="profileForm.email" type="email" class="input-field" :placeholder="user?.email"/>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Phone Number</label>
              <input v-model="profileForm.phone" type="tel" class="input-field" :placeholder="user?.phoneNumber ? user?.phoneNumber : '+1 (555) 000-0000'"/>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Role</label>
              <input :value="user?.role" type="text" class="input-field" disabled/>
            </div>
            <div class="md:col-span-2 space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Bio</label>
              <textarea v-model="profileForm.bio" :placeholder="user?.bio ? user?.bio : 'Tell us about yourself…'" rows="3" class="input-field resize-none" />
            </div>
          </div>

          <div class="flex justify-end">
            <button class="btn-primary rounded-lg" @click="handleSaveProfile">Save Changes</button>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="stat-card rounded-lg p-6 space-y-6">
          <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">Security</h2>
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Current Password</label>
              <input v-model="securityForm.current" type="password" placeholder="••••••••" class="input-field" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">New Password</label>
              <input v-model="securityForm.newPass" type="password" placeholder="••••••••" class="input-field" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm " style="color: var(--text-secondary)">Confirm New Password</label>
              <input v-model="securityForm.confirm" type="password" placeholder="••••••••" class="input-field" />
            </div>
          </div>
          <div class="flex justify-end">
            <button class="btn-primary" @click="toast.success('Password updated successfully')">Update Password</button>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="stat-card rounded-lg p-6 space-y-5">
          <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">Notification Preferences</h2>
          <div v-for="n in notifSettings" :key="n.key" class="flex items-center justify-between py-3"
            style="border-bottom: 1px solid var(--surface-border)">
            <div>
              <div class="text-base font-semibold" style="color: var(--text-primary)">{{ n.label }}</div>
              <div class="text-sm mt-0.5" style="color: var(--text-muted)">{{ n.description }}</div>
            </div>
            <button
              class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
              :class="n.enabled ? 'bg-primary-600' : 'bg-[var(--surface-hover)]'"
              @click="n.enabled = !n.enabled">
              <span class="absolute top-0.5 right-5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                :class="n.enabled ? 'translate-x-5' : 'translate-x-0'" />
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getInitials } from '~/utils/formatters'

definePageMeta({ layout: 'default' })
useHead({ title: 'Settings' })

const ui = useUiStore()
const auth = useAuthStore()
const toast = useToast()

const user = computed(() => auth.user)
const initials = computed(() => user.value ? getInitials(user.value.fullName) : 'A')
const colorMode = useColorMode()
const currentTheme = computed(() => colorMode.value)
const activeTab = ref('profile')

const profileForm = reactive({ name: user.value?.fullName ?? '', email: user.value?.email ?? '', phone: '', bio: '' })
const securityForm = reactive({ current: '', newPass: '', confirm: '' })

const settingsTabs = [
  { key: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { key: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
]

const notifSettings = reactive([
  { key: 'new_enrollment', label: 'New Enrollment', description: 'When a new student enrolls.', enabled: true },
  { key: 'payment', label: 'Payment Received', description: 'When a payment is processed.', enabled: true },
  { key: 'grade_submit', label: 'Grade Submission', description: 'When grades are submitted.', enabled: false },
  { key: 'attendance', label: 'Low Attendance Alert', description: 'When a student drops below 70%.', enabled: true },
  { key: 'system', label: 'System Updates', description: 'Maintenance and platform news.', enabled: false },
])

const handleSaveProfile = () => {
  toast.success('Profile updated', 'Your profile information has been saved.')
}
</script>
