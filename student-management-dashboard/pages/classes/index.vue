<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Class Management</h1>
        <p>Organize and manage academic classes, departments, and generations.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm" @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        New Class
      </button>
    </div>

    <AppTable
      v-model:searchValue="search"
      :columns="columns"
      :rows="filteredClasses"
      :loading="loading"
      search-placeholder="Search classes..."
      empty-title="No classes found"
      empty-message="Get started by creating your first class."
      @row-click="(row) => openEdit(row as Class)"
    >
      <template #default="{ row }">
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="font-medium text-[var(--text-primary)]">{{ (row as Class).name }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5">
          <span class="text-sm" style="color: var(--text-secondary)">{{ (row as Class).departmentName || '—' }}</span>
        </td>
        <td class="px-4 py-3.5">
           <span class="badge-blue">{{ (row as Class).academicYear }}</span>
        </td>
        <td class="px-4 py-3.5">
          <span class="text-sm font-semibold" style="color: var(--text-primary)">Gen {{ (row as Class).generation }}</span>
        </td>
        <td class="px-4 py-3.5 text-right">
          <div class="flex justify-end">
            <button class="btn-ghost w-8 h-8 rounded-lg" @click.stop="openEdit(row as Class)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </button>
          </div>
        </td>
      </template>
      <template #empty-action>
         <button class="btn-primary text-sm mt-4" @click="openCreate">Create first class</button>
      </template>
    </AppTable>

    <ClassFormModal
      v-model="formOpen"
      :loading="submitting"
      :class-obj="editingClass"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { Class, TableColumn } from '~/types'
import type { ClassFormData } from '~/services/class.service'
import AppTable from '~/components/common/AppTable.vue'
import ClassFormModal from '~/components/classes/ClassFormModal.vue'
import { classService } from '~/services/class.service'
import { useClassStore } from '~/stores/class.store'

const classStore = useClassStore();

definePageMeta({ layout: 'default' })
useHead({ title: 'Class Management' })

const toast = useToast()
const {classes} = storeToRefs(classStore)
const loading = ref(false)
const submitting = ref(false)
const formOpen = ref(false)
const editingClass = ref<Class | null>(null)
const search = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Class Name', sortable: true },
  { key: 'departmentName', label: 'Department', sortable: true },
  { key: 'academicYear', label: 'Academic Year', sortable: true },
  { key: 'generation', label: 'Generation', sortable: true },
  { key: 'actions', label: '', align: 'right', width: '80px' }
]

const filteredClasses = computed(() =>
  classes.value.filter(c => {
    const q = search.value.toLowerCase()
    return !q || [
      c.name,
      c.departmentName,
      c.academicYear,
      c.generation.toString()
    ].some(v => v?.toLowerCase().includes(q))
  })
)
const openCreate = () => {
  editingClass.value = null
  formOpen.value = true
}

const openEdit = (cls: Class) => {
  editingClass.value = cls
  formOpen.value = true
}

const handleSubmit = async (payload: ClassFormData) => {
  submitting.value = true
  try {
    if (editingClass.value?.id) {
      const response = await classService.update(editingClass.value.id, payload);
      classes.value = classes.value.map(item => (item.id === response.data.id ? response.data : item))
      toast.success('Class updated')
    } else {
      const response = await classService.create(payload)
      classes.value = [response.data, ...classes.value]
      toast.success('Class created')
    }
    formOpen.value = false
  } catch (error) {
    console.error(error)
    toast.error('Unable to save class')
  } finally {
    submitting.value = false
  }
}

onMounted(classStore.fetchClasses)
</script>

<style scoped>
.badge-blue {
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(59, 130, 246, 0.1);
  color: rgb(96, 165, 250);
}
</style>
