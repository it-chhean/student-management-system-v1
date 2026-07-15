<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Subjects</h1>
        <p>Create, edit, and manage academic subjects.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm" @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Subject
      </button>
    </div>

    <AppTable v-model:searchValue="search" :columns="columns" :rows="filteredSubjects" :loading="loading"
      search-placeholder="Search subjects..." empty-title="No subjects found"
      empty-message="Get started by creating your first subject." @row-click="(row) => openEdit(row as Subject)">
      <template #default="{ row }">
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 cursor-zoom-in"
              @click.stop="zoomImage = (row as Subject).thumbnail ? `http://localhost:8080/api/v1/uploads/subject/${(row as Subject).thumbnail}` : ''">
              <img v-if="(row as Subject).thumbnail"
                :src="`http://localhost:8080/api/v1/uploads/subject/${(row as Subject).thumbnail}`"
                class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </div>
            </div>
            <div>
              <div class="font-medium text-[var(--text-primary)]">{{ (row as Subject).name }}</div>
              <div class="text-[10px] text-[var(--text-muted)] font-mono">{{ (row as Subject).code }}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3.5">
          <span class="text-sm" style="color: var(--text-secondary)">{{ (row as Subject).departmentName || '—' }}</span>
        </td>
        <td class="px-4 py-3.5">
          <p class="text-xs line-clamp-1 max-w-xs" style="color: var(--text-muted)">{{ (row as Subject).description }}
          </p>
        </td>
        <td class="px-4 py-3.5">
            <div class="flex items-center gap-1" @click.stop>
              <button class="btn-action w-7 h-7 rounded-lg text-xs" title="View"
                @click="navigateTo(`/students/${row.id}`)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button class="btn-action w-7 h-7 rounded-lg text-xs" title="Edit" @click="openEdit(row)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <!-- <button class="btn-action w-7 h-7 rounded-lg text-xs text-red-400 hover:bg-red-500/10" title="Delete"
                @click="handleDelete(row)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button> -->
            </div>
          </td>

      </template>
      <template #empty-action>
        <button class="btn-primary text-sm mt-4" @click="openCreate">Create first subject</button>
      </template>
    </AppTable>

    <SubjectFormModal v-model="formOpen" :loading="submitting" :subject="editingSubject" @submit="handleSubmit" />

    <ImageZoomModal v-model="showZoom" :src="zoomImage" :alt="'Subject'" />
  </div>
</template>

<script setup lang="ts">
import type { Subject, TableColumn } from '~/types'
import AppTable from '~/components/common/AppTable.vue'
import SubjectFormModal from '~/components/subjects/SubjectFormModal.vue'
import ImageZoomModal from '~/components/common/ImageZoomModal.vue'
import { subjectService } from '~/services/subject.service'

definePageMeta({ layout: 'default' })
useHead({ title: 'Subjects' })

const toast = useToast()
const subjects = ref<Subject[]>([])
const loading = ref(false)
const submitting = ref(false)
const formOpen = ref(false)
const editingSubject = ref<Subject | null>(null)
const zoomImage = ref('')
const search = ref('')

const columns: TableColumn[] = [
  { key: 'name', label: 'Subject', sortable: true },
  { key: 'departmentName', label: 'Department', sortable: true },
  { key: 'description', label: 'Description' },
  { key: '', label: 'Actions', width: '120px' },
]

const filteredSubjects = computed(() =>
  subjects.value.filter(s => {
    const q = search.value.toLowerCase()
    return !q || [
      s.name,
      s.code,
      s.departmentName,
      s.description,
    ].some(v => v?.toLowerCase().includes(q))
  })
)
const showZoom = computed({
  get: () => !!zoomImage.value,
  set: (val) => { if (!val) zoomImage.value = '' }
})

const fetchSubjects = async () => {
  loading.value = true
  try {
    subjects.value = await subjectService.getAll()
  } catch (error) {
    console.error(error)
    toast.error('Failed to load subjects')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingSubject.value = null
  formOpen.value = true
}

const openEdit = (subject: Subject) => {
  editingSubject.value = subject
  formOpen.value = true
}

const handleSubmit = async (payload: { departmentId: string; name: string; description: string; image: File | null }) => {
  submitting.value = true
  try {
    if (editingSubject.value?.id) {
      const updated = await subjectService.update(editingSubject.value.id, payload)
      subjects.value = subjects.value.map(item => (item.id === updated.id ? updated : item))
      toast.success('Subject updated')
    } else {
      const created = await subjectService.create(payload)
      subjects.value = [created, ...subjects.value]
      toast.success('Subject created')
    }
    formOpen.value = false
  } catch (error) {
    console.error(error)
    toast.error('Unable to save subject')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchSubjects)
</script>