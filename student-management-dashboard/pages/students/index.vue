  <template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 page-header">
        <div>
          <h1>Students</h1>
          <p>Manage enrolled students, view profiles, and track performance.</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-secondary rounded-lg text-sm" @click="studentStore.exportStudents(1)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button class="btn-primary rounded-lg text-sm" @click="openForm()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="s in summaryStats" :key="s.label" class="stat-card rounded-lg p-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :style="`background: ${s.bg}`">
            <span class="text-base font-bold" :style="`color: ${s.color}`">{{ s.value }}</span>
          </div>
          <div>
            <div class="text-sm" style="color: var(--text-muted)">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <AppTable :columns="columns" :rows="students" :loading="studentStore.tableLoading"
        :selectable="true" :selected-id="studentStore.selectedIds" :all-selected="studentStore.isAllSelected"
        :some-selected="studentStore.selectedIds.length > 0 && !studentStore.isAllSelected"
        
        :selected-count="studentStore.selectedIds.length" :current-page="studentStore.pagination.currentPage"
        
        :page-size="studentStore.pagination.pageSize" :total="studentStore.pagination.totalElements"
        
        :total-pages="studentStore.pagination.totalPages" :sort-key="studentStore.query.sortBy" :sort-dir="studentStore.query.sortDirection"
        
        :search-value="studentStore.query.search" show-search search-placeholder="Search students…"
        
        empty-title="No students found" empty-message="Try adjusting your search or add a new student"
        
        @sort="studentStore.setSort" @page-change="studentStore.setPage" @page-size-change="studentStore.setPageSize"
        
        @toggle-select="studentStore.toggleSelect" @toggle-select-all="studentStore.toggleSelectAll"
        
        @clear-selection="studentStore.clearSelection" @update:search-value="studentStore.setSearch"
        
        @row-click="(r) => navigateTo(`/students/${r.id}`)">
        <template #toolbar>
          <!-- Status filter -->
          <select class="input-field py-2 text-sm w-36" :value="studentStore.query.status ?? ''"
            @change="studentStore.setFilter('status', ($event.target as HTMLSelectElement).value)">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <!-- Department filter -->
          <select class="input-field py-2 text-sm w-44" :value="studentStore.query.departmentId ?? ''"
            @change="studentStore.setFilter('departmentId', ($event.target as HTMLSelectElement).value)">
            <option value="">All Departments</option>
            <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>

          <select class="input-field py-2 text-sm w-44" :value="studentStore.query.classId ?? ''"
            @change="studentStore.setFilter('classId', ($event.target as HTMLSelectElement).value)">
            <option value="">All Class</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>

          <!-- Clear filters -->
          <button v-if="hasFilters" class="btn-ghost text-xs" @click="studentStore.clearFilters">
            Clear filters
          </button>
        </template>

        <template #actions>
          <button class="btn-secondary rounded-lg text-xs py-2 px-3" @click="triggerImport">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Students
          </button>
        </template>

        <template #bulk-actions>
          <button class="btn-danger text-xs py-1.5 px-3" @click="handleBulkDelete">
            Delete Selected
          </button>
        </template>

        <!-- Row cells -->
        <template #default="{ row }">
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-3">
              <!-- <AppAvatar :src="row.avatar" :name="`${row.enFirstName} ${row.enLastName}`" size="sm" /> -->
              <div>
                <div class="font-kh text-sm font-semibold" style="color: var(--text-primary)">
                  {{ row.khFirstName }} {{ row.khLastName }}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="text-sm font-semibold">
              {{ row.enFirstName }} {{ row.enLastName }}
            </div>
          </td>

          <td>
            {{ row.studentCode }}
          </td>

          <td>
            {{ row.gender }}
          </td>

          <td>
            {{ row.email }}
          </td>

          <td>
            {{ row.phoneNumber }}
          </td>

          <td>
            {{ row.departmentName }}
          </td>

          <td>
            {{ row.className }}
          </td>

          <td>
            <AppBadge :variant="statusVariant(row.status ? 'Active' : 'Inactive')" dot>
              {{ getStatusLabel(row.status ? "Active" : "Inactive") }}
            </AppBadge>
          </td>

          <td class="px-4 py-3.5">
            <div class="flex items-center gap-1" @click.stop>
              <button class="btn-action w-7 h-7 rounded-lg text-xs" title="View"
                @click="navigateTo(`/students/${(row as Student).id}`)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button class="btn-action w-7 h-7 rounded-lg text-xs" title="Edit" @click="openForm(row as Student)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button class="btn-action w-7 h-7 rounded-lg text-xs text-red-400 hover:bg-red-500/10" title="Delete"
                @click="handleDelete(row as Student)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </template>

        <template #empty-action>
          <button class="btn-primary text-sm" @click="openForm()">Add First Student</button>
        </template>
      </AppTable>

      <!-- Student Form Modal -->
      <StudentForm v-model="formOpen" :student="editingStudent" @submit="handleFormSubmit" />

      <!-- Student Import Modal -->
      <StudentImportModal v-model="importOpen" @success="studentStore.fetchStudents()" />
    </div>
  </template>

<script setup lang="ts">
import { type Student } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Students' })

// store
const studentStore = useStudentStore();
const classStore = useClassStore();
const departmentStore = useDepartmentStore();

const { students } = storeToRefs(studentStore)
const { classes } = storeToRefs(classStore)
const { departments } = storeToRefs(departmentStore)

const modal = useModal()
const toast = useToast()

const formOpen = ref(false);
const importOpen = ref(false);
const editingStudent = ref<Partial<Student>>({});

const hasFilters = computed(() => {
  const hasActiveFilters = Object.values(studentStore.query).some(value => value !== '' && value !== null && value !== undefined)
  return hasActiveFilters || studentStore.query.search !== ''
})

const columns = [
  { key: '', label: "ឈ្មោះ" },
  { key: '', label: "Username" },
  { key: '', label: "Code" },
  { key: '', label: "Gender" },
  { key: '', label: "Email" },
  { key: '', label: "Phone" },
  { key: '', label: "Department" },
  { key: "className", label: 'ClassName', sortable: true },
  { key: '', label: 'Status', sortable: true },
  { key: '', label: 'Actions', width: '120px' },
]

const summaryStats = computed(() => {
  const stats = studentStore.stats
  return [
    { label: 'Total Enrolled', value: stats?.activeStudents ?? 0, color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Graduated', value: stats?.graduatedStudents ?? 0, color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Inactive', value: stats?.inactiveStudents ?? 0, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
    { label: 'Suspended', value: stats?.suspendedStudents ?? 0, color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  ]
})

const statusVariant = (status: string) => {
  const map: Record<string, string> = {
    active: 'success', inactive: 'muted', graduated: 'info', suspended: 'danger',
  }
  return (map[status] ?? 'muted') as 'success' | 'muted' | 'info' | 'danger' | 'warning' | 'primary'
}

const gpaColor = (gpa: number) => gpa >= 3.5 ? 'bg-emerald-500' : gpa >= 2.5 ? 'bg-primary-500' : gpa >= 1.5 ? 'bg-amber-500' : 'bg-red-500'
const gpaTextColor = (gpa: number) => gpa >= 3.5 ? 'text-emerald-400' : gpa >= 2.5 ? 'text-primary-400' : gpa >= 1.5 ? 'text-amber-400' : 'text-red-400'

const openForm = (student?: Partial<Student>) => {
  editingStudent.value = student ? { ...student } : {}
  formOpen.value = true
}

const handleFormSubmit = async (data: Partial<Student>) => {
  try {
    if (editingStudent.value.id) {
      await studentStore.updateStudent(editingStudent.value.id, data)
      toast.success('Student updated', 'The student record has been updated successfully.')
    } else {
      await studentStore.createStudent(data)
      toast.success('Student added', 'New student has been added successfully.')
    }

    formOpen.value = false
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not save student'
    toast.error('Operation Failed', message)
  }
}

const handleDelete = async (student: Student) => {
  await modal.danger(
    'Delete Student',
    `Are you sure you want to delete ${student.enFirstName} ${student.enLastName}? This action cannot be undone.`,
    async () => {
      await studentStore.deleteStudent(student.id)
      toast.success('Student deleted', 'The student has been removed.')
    }
  )
}

const handleBulkDelete = async () => {
  const count = studentStore.selectedIds.length
  await modal.danger(
    'Delete Selected Students',
    `Are you sure you want to delete ${count} selected student${count > 1 ? 's' : ''}? This cannot be undone.`,
    async () => {
      await studentStore.bulkDelete([...studentStore.selectedIds])
      toast.success(`${count} student${count > 1 ? 's' : ''} deleted`)
    }
  )
}

const triggerImport = () => {
  importOpen.value = true
}

onMounted(async () => {
  if(students.value.length === 0) {
    await studentStore.fetchStudents()
  }
  if(classes.value.length === 0) {
    await classStore.fetchClasses()
  }
})
</script>
