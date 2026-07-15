<script setup lang="ts">
import type { Course, TableColumn } from '~/types'
import type { CourseFormData } from '~/services/course.service'
import AppTable from '~/components/common/AppTable.vue'
import { COURSE_WEEKDAYS } from '~/utils/constants'

definePageMeta({ layout: 'default' })
useHead({ title: 'Courses' })

const toast = useToast()

const courseStore = useCourseStore()
const { courses } = storeToRefs(courseStore)

const { fetchCourse, createCourse, updateCourse } = courseStore

const loading = ref(false)
const submitting = ref(false)
const formOpen = ref(false)
const editingCourse = ref<Course | null>(null)
const search = ref('')
const filterSemester = ref('')

const columns: TableColumn[] = [
  { key: 'name', label: 'Course', sortable: true },
  { key: 'instructorName', label: 'Instructor / Semester', sortable: true },
  { key: 'schedule', label: 'Schedule' },
  { key: 'status', label: 'Status' },
  { key: '', label: 'Actions', width: '120px' },
]

const semesterOptions = computed(() => {
  const seen = new Map<string, string>()

  for (const course of courses.value) {
    if (course.semesterId && course.semesterName) {
      seen.set(course.semesterId, course.semesterName)
    }
  }

  return Array.from(seen, ([id, name]) => ({ id, name }))
})

const filteredCourses = computed(() =>
  courses.value.filter(c => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || [
      c.name,
      c.description,
      c.subjectName,
      c.instructorName,
      c.semesterName,
    ].some(v => v?.toLowerCase().includes(q))
    const matchSemester = !filterSemester.value || c.semesterId === filterSemester.value
    return matchSearch && matchSemester
  }),
)

const openCreate = (): void => {
  editingCourse.value = null
  formOpen.value = true
}

const openEdit = (course: Course): void => {
  editingCourse.value = course
  formOpen.value = true
}

const handleSubmit = async (payload: CourseFormData): Promise<void> => {
  submitting.value = true
  try {
    if (editingCourse.value?.id) {
      await updateCourse(editingCourse.value.id, payload)
      toast.success('Course updated')
    } else {
      await createCourse(payload)
      toast.success('Course created')
    }
    formOpen.value = false
  } catch (error) {
    console.error(error)
    toast.error('Unable to save course')
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatDay = (day: string): string =>
  COURSE_WEEKDAYS.find(d => d.value === day)?.label ?? day

interface StatusInfo {
  label: string
  classes: string
  dot: string
}

const getStatusInfo = (course: Course): StatusInfo => {
  const now = new Date()
  const label = now < new Date(course.startAt) ? 'Upcoming' : now > new Date(course.endAt) ? 'Completed' : 'Active'

  const map: Record<string, Omit<StatusInfo, 'label'>> = {
    Active: { classes: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' },
    Upcoming: { classes: 'bg-blue-500/10 text-blue-400', dot: 'bg-blue-400' },
    Completed: { classes: 'bg-slate-500/10 text-slate-400', dot: 'bg-slate-400' },
  }
  return { label, ...map[label] }
}

onMounted(() => {
  if (courses.value.length === 0) {
    fetchCourse()
      .catch(() => toast.error('Unable to load courses'))
      .finally(() => loading.value = false)
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Courses</h1>
        <p>Manage course offerings, instructors, and weekly schedules.</p>
      </div>
      <button class="btn-primary rounded-lg text-sm" @click="openCreate">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Course
      </button>
    </div>
    <div>
      {{ JSON.stringify(courses.values) }}
    </div>

    <AppTable v-model:searchValue="search" :columns="columns" :rows="filteredCourses" :loading="loading"
      search-placeholder="Search courses..." empty-title="No courses found"
      empty-message="Get started by creating your first course." @row-click="(row) => openEdit(row as Course)">
      <template #toolbar>
        <select v-model="filterSemester" class="input-field py-2 text-sm w-44">
          <option value="">All Semesters</option>
          <option v-for="sem in semesterOptions" :key="sem.id" :value="sem.id">{{ sem.name }}</option>
        </select>
      </template>
      <template #default="{ row: rawRow }">
        <!-- Narrow the type once at slot level -->
        <template v-if="(rawRow as Course).id">
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-[var(--text-primary)] text-sm">{{ (rawRow as Course).name }}</div>
                <div v-if="(rawRow as Course).subjectName" class="text-[10px]" style="color: var(--text-muted)">
                  {{ (rawRow as Course).subjectName }}
                </div>
              </div>
            </div>
          </td>

          <td class="px-4 py-3.5">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs" style="color: var(--text-secondary)">{{ (rawRow as Course).instructorName || '—'
                }}</span>
              <span class="text-[10px]" style="color: var(--text-muted)">{{ (rawRow as Course).semesterName }}</span>
            </div>
          </td>

          <td class="px-4 py-3.5">
            <div class="text-[10px] space-y-0.5" style="color: var(--text-muted)">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" />
                </svg>
                <span>{{ formatDate((rawRow as Course).startAt) }} – {{ formatDate((rawRow as Course).endAt) }}</span>
              </div>
              <div v-if="(rawRow as Course).schedules?.length" class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke-width="2" stroke-linecap="round" />
                </svg>
                <span>{{ (rawRow as Course).schedules?.length }} session(s)</span>
              </div>
            </div>
          </td>

          <td class="px-4 py-3.5">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="getStatusInfo(rawRow as Course).classes">
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(rawRow as Course).dot" />
              {{ getStatusInfo(rawRow as Course).label }}
            </span>
          </td>

          <td class="px-4 py-3.5">
            <div class="flex items-center gap-1" @click.stop>
              <button class="btn-action w-7 h-7 rounded-lg text-xs" title="View"
                @click="navigateTo(`/students/${rawRow.id}`)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button class="btn-action w-7 h-7 rounded-lg text-xs" title="Edit" @click="openEdit(rawRow as Course)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </td>
        </template>
      </template>
    </AppTable>

    <CourseFormModal v-model="formOpen" :loading="submitting" :course="editingCourse" @submit="handleSubmit" />
  </div>
</template>
