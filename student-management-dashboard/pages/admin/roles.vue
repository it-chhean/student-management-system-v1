<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Roles</h1>
        <p>Manage user roles and their associated permission sets.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm flex items-center gap-2" @click="openCreateModal">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Role
      </button>
    </div>

    <!-- Table -->
    <AppTable :columns="tableColumns" :rows="roles" :loading="loading">
      <template #default="{ row }">
        <td class="px-4 py-3.5 font-bold" style="color: var(--text-primary)">
          {{ (row as any).name }}
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-muted)">
          {{ (row as any).description }}
        </td>
        <td class="px-4 py-3.5">
          <div class="flex flex-wrap gap-1">
            <AppBadge v-for="p in getPermissionList(row as any)" :key="p" variant="muted" class="text-[9px] uppercase">
              {{ p }}
            </AppBadge>
            <span v-if="!getPermissionList(row as any).length" class="text-xs italic text-[var(--text-muted)]">No permissions</span>
          </div>
        </td>
        <td class="px-4 py-3.5 text-center">
          <AppBadge :variant="isRoleActive(row as any) ? 'success' : 'muted'" dot class="text-xs">
            {{ isRoleActive(row as any) ? 'Active' : 'Inactive' }}
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

    <!-- Role Modal -->
    <AppModal v-if="modalShow" :show="modalShow" @close="modalShow = false" 
              :title="isEditing ? 'Edit Role' : 'Create Role'" size="lg">
      <form @submit.prevent="saveRole" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Role Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g. ROLE_MANAGER" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="form.status" class="input-field">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <input v-model="form.description" type="text" class="input-field" placeholder="Brief role summary..." />
        </div>
        
        <div>
          <label class="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Permissions</span>
            <span class="text-[10px] font-normal" style="color: var(--text-muted)">Selected: {{ selectedPermissionIds.length }}</span>
          </label>
          <div class="border rounded-lg overflow-hidden" style="border-color: var(--surface-border)">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--surface-border)]">
              <div v-for="p in allPermissions" :key="p.id" 
                   class="bg-[var(--surface-card)] p-3 flex items-start gap-3 hover:bg-[var(--surface-hover)] transition-colors">
                <input type="checkbox" :id="`perm-${p.id}`" 
                       :value="p.id" 
                       v-model="selectedPermissionIds"
                       class="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <label :for="`perm-${p.id}`" class="flex-1 cursor-pointer">
                  <div class="text-sm font-semibold truncate">{{ p.name }}</div>
                  <div class="text-[10px]" style="color: var(--text-muted)">{{ p.module }}</div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button class="btn-ghost px-6" @click="modalShow = false">Cancel</button>
          <button class="btn-primary px-8" @click="saveRole" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Role' }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { roleService } from '~/services/role.service'
import { permissionService } from '~/services/permission.service'
import type { Role, Permission } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Roles' })

const roles = ref<Role[]>([])
const allPermissions = ref<Permission[]>([])
const loading = ref(false)
const saving = ref(false)
const modalShow = ref(false)
const isEditing = ref(false)

const selectedPermissionIds = ref<string[]>([])
const form = ref<Partial<Role>>({
  name: '',
  description: '',
  status: true,
})

const fetchData = async () => {
  loading.value = true
  try {
    const [rolesRes, permsRes] = await Promise.all([
      roleService.getAll(),
      permissionService.getAll()
    ])
    roles.value = rolesRes
    allPermissions.value = permsRes
  } catch (err) {
    console.error('Failed to fetch roles or permissions', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const isRoleActive = (r: Role) => r.status === true || r.status === 'ACTIVE'

const getPermissionList = (role: Role) => {
  if (!role.permissions) return []
  if (Array.isArray(role.permissions)) {
    return role.permissions.map(p => typeof p === 'string' ? p : p.name)
  }
  return []
}

const tableColumns = [
  { key: 'name', label: 'Role', width: '180px' },
  { key: 'description', label: 'Description' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'status', label: 'Status', width: '100px', align: 'center' as const },
  { key: 'actions', label: 'Actions', width: '100px' },
]

const openCreateModal = () => {
  isEditing.value = false
  form.value = { name: '', description: '', status: true }
  selectedPermissionIds.value = []
  modalShow.value = true
}

const openEditModal = (role: Role) => {
  isEditing.value = true
  form.value = { ...role }
  selectedPermissionIds.value = (role.permissions || [])
    .map(p => typeof p === 'string' ? p : p.id)
    .filter(id => !!id) as string[]
  modalShow.value = true
}

const saveRole = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      permissions: selectedPermissionIds.value
    }
    
    if (isEditing.value && form.value.id) {
      await roleService.update(form.value.id, payload)
    } else {
      await roleService.create(payload)
    }
    await fetchData()
    modalShow.value = false
  } catch (err) {
    console.error('Failed to save role', err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (role: Role) => {
  if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
    try {
      if (role.id) {
        await roleService.delete(role.id)
        await fetchData()
      }
    } catch (err) {
      console.error('Failed to delete role', err)
    }
  }
}
</script>
