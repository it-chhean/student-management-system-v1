<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Semesters</h1>
        <p>Create, edit, and manage academic semesters.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm" @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Semester
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="stat-card rounded-lg overflow-hidden">
      <div class="animate-pulse">
        <div class="px-6 py-4 flex gap-4" v-for="i in 4" :key="i"
          style="border-bottom: 1px solid var(--surface-border)">
          <div class="h-4 rounded w-1/4" style="background: var(--surface-hover)" />
          <div class="h-4 rounded w-1/5" style="background: var(--surface-hover)" />
          <div class="h-4 rounded w-1/5" style="background: var(--surface-hover)" />
          <div class="h-4 rounded w-1/4" style="background: var(--surface-hover)" />
        </div>
      </div>
    </div>

    <!-- Data table -->
    <div v-else-if="semesters.length" class="stat-card rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom: 1px solid var(--surface-border); background: var(--surface-hover)">
              <th class="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">#</th>
              <th class="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">Name</th>
              <th class="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">Start Date</th>
              <th class="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">End Date</th>
              <th class="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">Description</th>
              <th class="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">Status</th>
              <th class="text-right px-6 py-3 font-semibold text-xs uppercase tracking-wider"
                style="color: var(--text-muted)">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sem, index) in semesters" :key="sem.id"
              class="transition-colors duration-150 hover:bg-[var(--surface-hover)]"
              style="border-bottom: 1px solid var(--surface-border)">
              <td class="px-6 py-4 font-medium" style="color: var(--text-muted)">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style="background: linear-gradient(135deg, var(--primary), var(--primary-hover))">
                    <svg class="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="font-semibold" style="color: var(--text-primary)">{{ sem.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4" style="color: var(--text-secondary)">{{ formatDate(sem.startDate) }}</td>
              <td class="px-6 py-4" style="color: var(--text-secondary)">{{ formatDate(sem.endDate) }}</td>
              <td class="px-6 py-4 max-w-[240px]">
                <p class="truncate" style="color: var(--text-muted)">{{ sem.description }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClasses(sem)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(sem)" />
                  {{ getStatusLabel(sem) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button class="p-1.5 hover:bg-amber-100 rounded-full" @click="openEdit(sem)">
                  <Pencil class="w-4 h-4 text-amber-600" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="stat-card rounded-lg p-8 text-center">
      <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style="background: var(--surface-hover)">
        <svg class="w-8 h-8" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-sm font-medium mb-1" style="color: var(--text-primary)">No semesters found</p>
      <p class="text-xs mb-4" style="color: var(--text-muted)">Get started by creating your first semester.</p>
      <button class="btn-primary text-sm" @click="openCreate">Create first semester</button>
    </div>

    <SemesterFormModal v-model="formOpen" :loading="submitting" :semester="editingSemester" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { Semester } from '~/types'
import SemesterFormModal from '~/components/semesters/SemesterFormModal.vue'
import { semesterService } from '~/services/semester.service'
import { Pencil } from '@lucide/vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Semesters' })

const toast = useToast()
const semesters = ref<Semester[]>([])
const loading = ref(false)
const submitting = ref(false)
const formOpen = ref(false)
const editingSemester = ref<Semester | null>(null)

const fetchSemesters = async () => {
  loading.value = true
  try {
    semesters.value = await semesterService.getAll()
  } catch (error) {
    console.error(error)
    toast.error('Failed to load semesters')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingSemester.value = null
  formOpen.value = true
}

const openEdit = (semester: Semester) => {
  editingSemester.value = semester
  formOpen.value = true
}

const handleSubmit = async (payload: { name: string; startDate: string; endDate: string; description: string }) => {
  submitting.value = true
  try {
    if (editingSemester.value?.id) {
      const updated = await semesterService.update(editingSemester.value.id, payload)
      semesters.value = semesters.value.map(item => (item.id === updated.id ? updated : item))
      toast.success('Semester updated')
    } else {
      const created = await semesterService.create(payload)
      semesters.value = [created, ...semesters.value]
      toast.success('Semester created')
    }
    formOpen.value = false
  } catch (error) {
    console.error(error)
    toast.error('Unable to save semester')
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusLabel = (sem: Semester): string => {
  const now = new Date()
  const start = new Date(sem.startDate)
  const end = new Date(sem.endDate)
  if (now < start) return 'Upcoming'
  if (now > end) return 'Completed'
  return 'Active'
}

const getStatusClasses = (sem: Semester): string => {
  const status = getStatusLabel(sem)
  if (status === 'Active') return 'bg-emerald-500/10 text-emerald-400'
  if (status === 'Upcoming') return 'bg-blue-500/10 text-blue-400'
  return 'bg-slate-500/10 text-slate-400'
}

const getStatusDotClass = (sem: Semester): string => {
  const status = getStatusLabel(sem)
  if (status === 'Active') return 'bg-emerald-400'
  if (status === 'Upcoming') return 'bg-blue-400'
  return 'bg-slate-400'
}

onMounted(fetchSemesters)
</script>