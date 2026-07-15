<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>User Management</h1>
        <p>Manage all users — admins, instructors, and staff accounts.</p>
      </div>
      <NuxtLink to="/auth/register" class="btn-primary rounded-lg text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add User
      </NuxtLink>
    </div>

    <!-- View Toggle + Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center rounded-lg overflow-hidden" style="border: 1px solid var(--surface-border)">
        <button v-for="v in ['list', 'grid']" :key="v" class="px-3 py-2 text-xs font-semibold transition-colors"
          :class="view === v ? 'bg-primary-600 text-white' : 'hover:bg-[var(--surface-hover)]'"
          :style="view !== v ? 'color: var(--text-muted)' : ''" @click="view = v as any">
          {{ v === 'grid' ? '⊞ Grid' : '☰ List' }}
        </button>
      </div>
      <div class="relative flex-1 min-w-[200px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" />
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input v-model="search" type="text" placeholder="Search users…" class="input-field pl-9 py-2 text-sm" />
      </div>
      <select v-model="filterRole" class="input-field py-2 text-sm w-36">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="teacher">Instructor</option>
        <option value="staff">Staff</option>
      </select>
      <select v-model="filterStatus" class="input-field py-2 text-sm w-36">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Grid view -->
    <div v-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="user in filteredUsers" :key="user.id"
        class="stat-card rounded-lg p-5 transition-all duration-300 cursor-pointer group">
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-4">
          <AppAvatar :src="user.avatar" :name="user.fullName" size="md"
            :online="user.status === true || user.status === 'active'" />
          <AppBadge :variant="getRoleVariant(user.role)" class="text-[10px] uppercase">
            {{ formatRole(user.role) }}
          </AppBadge>
        </div>

        <!-- Info -->
        <div class="space-y-1 mb-4">
          <h3 class="font-display font-bold text-base" style="color: var(--text-primary)">
            {{ user.fullName }}
          </h3>
          <p class="text-sm" style="color: var(--text-muted)">{{ user.email }}</p>
        </div>

        <!-- Meta -->
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 text-xs" style="color: var(--text-muted)">
            <AppBadge :variant="isUserActive(user) ? 'success' : 'muted'" dot class="text-xs">
              {{ isUserActive(user) ? 'Active' : 'Inactive' }}
            </AppBadge>
          </div>
          <div v-if="user.verified !== undefined" class="flex items-center gap-2 text-xs"
            style="color: var(--text-muted)">
            <AppBadge :variant="user.verified ? 'success' : 'muted'" dot class="text-xs">
              {{ user.verified ? 'Verified' : 'Unverified' }}
            </AppBadge>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style="border-top: 1px solid var(--surface-border)">
          <button class="btn-secondary text-xs py-1.5 flex-1" @click.stop>Edit</button>
          <button class="btn-ghost text-xs py-1.5 text-red-400 hover:bg-red-500/10 px-3" @click.stop>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="!filteredUsers.length" class="col-span-full py-16 text-center">
        <div class="text-4xl mb-3">👤</div>
        <p class="font-semibold" style="color: var(--text-primary)">No users found</p>
        <p class="text-sm mt-1" style="color: var(--text-muted)">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- List view -->
    <AppTable v-else :columns="tableColumns" :rows="filteredUsers" :loading="loading" search-placeholder="Search users…"
      :show-search="false">
      <template #default="{ row }">
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-3">
            <AppAvatar :src="(row as any).avatar" :name="(row as any).fullName" size="sm" />
            <div>
              <div class="text-sm font-semibold" style="color: var(--text-primary)">{{ (row as any).fullName }}</div>
              <div class="text-xs" style="color: var(--text-muted)">{{ (row as any).email }}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3.5 text-sm">
          <AppBadge :variant="getRoleVariant((row as any).role || (row as any).roles?.[0])"
            class="text-[10px] uppercase">
            {{ formatRole((row as any).role || (row as any).roles?.[0]) }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5">
          <AppBadge :variant="(row as any).verified ? 'success' : 'muted'" dot class="text-xs">
            {{ (row as any).verified ? 'Verified' : 'Unverified' }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5">
          <AppBadge :variant="isUserActive(row as any) ? 'success' : 'muted'" dot class="text-xs">
            {{ isUserActive(row as any) ? 'Active' : 'Inactive' }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex gap-1">
            <button class="btn-action w-7 h-7 rounded-lg" @click.stop>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button class="btn-action w-7 h-7 rounded-lg text-red-400 hover:bg-red-500/10" @click.stop>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { api } from '~/services/api'
import type { User } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'User Management' })

const users = ref<User[]>([])
const loading = ref(false)
const search = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const view = ref<'grid' | 'list'>('list')

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await api.get<any>('/users')
    users.value = response.content || response.data || []
  } catch (err) {
    console.error('Failed to fetch users', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const isUserActive = (u: any) => u.status === true || u.status === 'active'

const filteredUsers = computed(() =>
  users.value.filter(u => {
    const q = search.value.toLowerCase()
    const nameMatch = u.fullName?.toLowerCase().includes(q)
    const emailMatch = u.email?.toLowerCase().includes(q)
    const matchSearch = !q || nameMatch || emailMatch
    const userRole = (u.role || '').toLowerCase().replace('role_', '')
    const matchRole = !filterRole.value || userRole.includes(filterRole.value)
    const active = isUserActive(u)
    const matchStatus = !filterStatus.value ||
      (filterStatus.value === 'active' && active) ||
      (filterStatus.value === 'inactive' && !active)
    return matchSearch && matchRole && matchStatus
  })
)

const formatRole = (role: string) => {
  if (!role) return 'User'
  return role.replace('ROLE_', '').toLowerCase()
}

const getRoleVariant = (role: string) => {
  const r = formatRole(role)
  if (r === 'admin') return 'primary'
  if (r === 'teacher') return 'success'
  if (r === 'staff') return 'warning'
  return 'muted'
}

const tableColumns = [
  { key: 'fullName', label: 'User', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'verified', label: 'Verified' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', width: '100px' },
]
</script>
