<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Departments</h1>
        <p>Create, edit, and manage academic departments.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm" @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Department
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div v-for="i in 5" :key="i" class="stat-card rounded-lg p-3 animate-pulse">
        <div class="h-28 rounded-xl mb-3" style="background: var(--surface-hover)" />
        <div class="h-5 w-2/3 rounded mb-2" style="background: var(--surface-hover)" />
        <div class="h-4 w-full rounded" style="background: var(--surface-hover)" />
      </div>
    </div>

    <div v-else-if="departments.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

      <!-- card department -->
      <div v-for="dept in departments" :key="dept.id"
        class="stat-card border border-slate-300 dark:border-slate-800 rounded-lg p-3 transition-all duration-300 group">
        <div class="w-full h-28 overflow-hidden mb-3 relative group/img cursor-zoom-in"
          style="background: var(--surface-hover)"
          @click="zoomImage = dept.thumbnail ? `http://localhost:8080/api/v1/uploads/department/${dept.thumbnail}` : ''">
          <template v-if="dept.thumbnail">
            <img :src="`http://localhost:8080/api/v1/uploads/department/${dept.thumbnail}`" :alt="dept.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
            <div
              class="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" stroke-width="2"
                  stroke-linecap="round" />
              </svg>
            </div>
          </template>
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-8 h-8" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h3 class="font-display text-sm font-bold truncate" style="color: var(--text-primary)">{{ dept.name }}</h3>
        <p class="text-[11px] mt-1 mb-2 line-clamp-1" style="color: var(--text-muted)">{{ dept.description }}</p>

        <div class="flex gap-2 mt-4 pt-4" style="border-top: 1px solid var(--surface-border)">
          <!-- <button @click="navigateTo(`/departments/${dept.id}`)" class="border border-indigo-500 rounded-md text-xs w-full">View</button> -->
          <button class="p-1.5 hover:bg-indigo-100 rounded-full" @click="navigateTo(`/departments/${dept.id}`)">
            <Eye class="w-4 h-4 text-indigo-600" />
          </button>
          <button class="p-1.5 hover:bg-amber-100 rounded-full" @click="openEdit(dept)">
            <Pencil class="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="stat-card rounded-lg p-8 text-center">
      <p class="text-sm" style="color: var(--text-muted)">No departments found.</p>
      <button class="btn-primary mt-4 text-sm" @click="openCreate">Create first department</button>
    </div>

    <DepartmentFormModal v-model="formOpen" :loading="submitting" :department="editingDepartment"
      @submit="handleSubmit" />

    <ImageZoomModal v-model="showZoom" :src="zoomImage" :alt="'Department'" />
  </div>
</template>

<script setup lang="ts">
import type { Department } from '~/types'
import DepartmentFormModal from '~/components/departments/DepartmentFormModal.vue'
import ImageZoomModal from '~/components/common/ImageZoomModal.vue'
import { departmentService } from '~/services/department.service'
import { Eye, Pencil } from '@lucide/vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Departments' })

const toast = useToast()

const departmentStore = useDepartmentStore()

const {departments} = storeToRefs(departmentStore)

const loading = ref(false)
const submitting = ref(false)
const formOpen = ref(false)
const editingDepartment = ref<Department | null>(null)
const zoomImage = ref('')
const showZoom = computed({
  get: () => !!zoomImage.value,
  set: (val) => { if (!val) zoomImage.value = '' }
})

const openCreate = () => {
  editingDepartment.value = null
  formOpen.value = true
}

const openEdit = (department: Department) => {
  editingDepartment.value = department
  formOpen.value = true
}

const handleSubmit = async (payload: { name: string; description: string; thumbnail: File | null }) => {
  submitting.value = true
  try {
    if (editingDepartment.value?.id) {
      const updated = await departmentStore.updateDepartment(editingDepartment.value.id, payload)
      toast.success('Department updated')
    } else {
      const created = await departmentStore.createDepartment(payload)
      toast.success('Department created')
    }
    formOpen.value = false
  } catch (error) {
    console.error(error)
    toast.error('Unable to save department')
  } finally {
    submitting.value = false
  }
}

onMounted(departmentStore.fetchDepartment)
</script>
