<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Permissions</h1>
        <p>Define and manage granular access controls for system modules.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm flex items-center gap-2" @click="openCreateModal">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Permission
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" />
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input v-model="search" type="text" placeholder="Search permissions…" class="input-field pl-9 py-2 text-sm" />
      </div>
      <select v-model="filterModule" class="input-field py-2 text-sm w-48">
        <option value="">All Modules</option>
        <option v-for="mod in uniqueModules" :key="mod" :value="mod">{{ mod }}</option>
      </select>
    </div>

    <!-- Table -->
    <AppTable :columns="tableColumns" :rows="filteredPermissions" :loading="loading">
      <template #default="{ row }">
        <td class="px-4 py-3.5 font-bold" style="color: var(--text-primary)">
          {{ (row as any).name }}
        </td>
        <td class="px-4 py-3.5">
          <AppBadge variant="primary" class="text-[10px] uppercase font-bold">
            {{ (row as any).module }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-muted)">
          {{ (row as any).description }}
        </td>
        <td class="px-4 py-3.5 text-center">
          <AppBadge :variant="(row as any).status ? 'success' : 'muted'" dot class="text-xs">
            {{ (row as any).status ? 'Active' : 'Inactive' }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex gap-2">
            <button class="btn-action w-8 h-8 rounded-lg" @click="openEditModal(row as any)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button class="btn-action w-8 h-8 rounded-lg text-red-400 hover:bg-red-500/10" @click="confirmDelete(row as any)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </template>
    </AppTable>

    <!-- Permission Modal -->
    <AppModal v-if="modalShow" :show="modalShow" @close="modalShow = false" 
              :title="isEditing ? 'Edit Permission' : 'Create Permission'" size="md">
      <form @submit.prevent="savePermission" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Permission Name</label>
          <input v-model="form.name" type="text" class="input-field" placeholder="e.g. USER_READ" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Module</label>
          <input v-model="form.module" type="text" class="input-field" placeholder="e.g. USER_MANAGEMENT" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea v-model="form.description" class="input-field min-h-[100px]" placeholder="Briefly describe what this permission allows..."></textarea>
        </div>
        <div class="flex items-center gap-2">
          <input v-model="form.status" type="checkbox" id="perm-status" class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <label for="perm-status" class="text-sm font-medium">Active</label>
        </div>
      </form>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button class="btn-ghost px-6" @click="modalShow = false">Cancel</button>
          <button class="btn-primary px-8" @click="savePermission" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { permissionService } from '~/services/permission.service'
import type { Permission } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Permissions' })

const permissions = ref<Permission[]>([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterModule = ref('')
const modalShow = ref(false)
const isEditing = ref(false)

const form = ref<Partial<Permission>>({
  name: '',
  module: '',
  description: '',
  status: true
})

const fetchPermissions = async () => {
  loading.value = true
  try {
    permissions.value = await permissionService.getAll()
  } catch (err) {
    console.error('Failed to fetch permissions', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPermissions)

const uniqueModules = computed(() => {
  const mods = permissions.value.map(p => p.module)
  return [...new Set(mods)].sort()
})

const filteredPermissions = computed(() => 
  permissions.value.filter(p => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    
    const matchModule = !filterModule.value || p.module === filterModule.value
    return matchSearch && matchModule
  })
)

const tableColumns = [
  { key: 'name', label: 'Permission' },
  { key: 'module', label: 'Module', width: '180px' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', width: '100px', align: 'center' as const },
  { key: 'actions', label: 'Actions', width: '100px' },
]

const openCreateModal = () => {
  isEditing.value = false
  form.value = { name: '', module: '', description: '', status: true }
  modalShow.value = true
}

const openEditModal = (p: Permission) => {
  isEditing.value = true
  form.value = { ...p }
  modalShow.value = true
}

const savePermission = async () => {
  saving.value = true
  try {
    if (isEditing.value && form.value.id) {
      await permissionService.update(form.value.id, form.value)
    } else {
      await permissionService.create(form.value)
    }
    await fetchPermissions()
    modalShow.value = false
  } catch (err) {
    console.error('Failed to save permission', err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (p: Permission) => {
  if (confirm(`Are you sure you want to delete permission "${p.name}"?`)) {
    try {
      if (p.id) {
        await permissionService.delete(p.id)
        await fetchPermissions()
      }
    } catch (err) {
      console.error('Failed to delete permission', err)
    }
  }
}
</script>
