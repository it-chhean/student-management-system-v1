<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div><h1>Grades</h1><p>View and manage student academic performance and scores.</p></div>
      <div class="flex gap-2">
        <button class="btn-secondary rounded-lg text-sm">Export Grades</button>
        <button class="btn-primary rounded-lg text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Submit Grades
        </button>
      </div>
    </div>

    <!-- Filters row -->
    <div class="flex flex-wrap gap-3 rounded-lg">
      <select v-model="selectedSemester" class="input-field py-2 text-sm w-40">
        <option value="fall-2024">Fall 2024</option>
        <option value="spring-2024">Spring 2024</option>
        <option value="fall-2023">Fall 2023</option>
      </select>
      <select v-model="selectedCourse" class="input-field py-2 text-sm w-48">
        <option value="">All Courses</option>
        <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <div class="relative flex-1 min-w-[180px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search student…" class="input-field pl-9 py-2 text-sm"/>
      </div>
    </div>

    <!-- GPA Distribution -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div v-for="g in gradeDistribution" :key="g.grade"
        class="stat-card rounded-lg p-4 text-center transition-all">
        <div class="font-display text-2xl font-bold mb-1" :class="g.color">{{ g.grade }}</div>
        <div class="font-bold text-lg" style="color: var(--text-primary)">{{ g.count }}</div>
        <div class="text-xs" style="color: var(--text-muted)">students</div>
        <div class="progress-bar mt-2">
          <div class="progress-fill" :style="`width: ${(g.count / 250) * 100}%; background: currentColor;`" :class="g.color" />
        </div>
      </div>
    </div>

    <!-- Grades Table -->
    <AppTable
      :columns="columns"
      :rows="paginatedGrades"
      :loading="false"
      :current-page="page"
      :page-size="pageSize"
      :total="filteredGrades.length"
      :total-pages="Math.ceil(filteredGrades.length / pageSize)"
      :show-search="false"
      @page-change="page = $event"
      @page-size-change="pageSize = $event"
    >
      <template #default="{ row }">
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-3">
            <AppAvatar :src="row.avatar" :name="row.studentName" size="sm" />
            <div>
              <div class="text-sm font-semibold" style="color: var(--text-primary)">{{ row.studentName }}</div>
              <div class="text-xs font-mono" style="color: var(--text-muted)">{{ row.studentId }}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-secondary)">{{ row.course }}</td>
        <td class="px-4 py-3.5">
          <span class="text-sm font-semibold" style="color: var(--text-primary)">{{ row.midterm }}/50</span>
        </td>
        <td class="px-4 py-3.5">
          <span class="text-sm font-semibold" style="color: var(--text-primary)">{{ row.final }}/50</span>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-2">
            <div class="progress-bar w-16">
              <div class="progress-fill" :class="scoreBarColor(row.total)" :style="`width: ${row.total}%`" />
            </div>
            <span class="text-sm font-semibold" style="color: var(--text-primary)">{{ row.total }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5">
          <span class="font-display text-base font-bold" :class="gradeLetterColor(row.letter)">{{ row.letter }}</span>
        </td>
        <td class="px-4 py-3.5">
          <AppBadge :variant="row.status === 'approved' ? 'success' : row.status === 'submitted' ? 'info' : 'warning'" dot>
            {{ row.status }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5">
          <button class="btn-ghost w-7 h-7 rounded-lg">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
        </td>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { mockStudents, mockCourses } from '~/utils/mock-data'

definePageMeta({ layout: 'default' })
useHead({ title: 'Grades' })

const selectedSemester = ref('fall-2024')
const selectedCourse = ref('')
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const courses = mockCourses

const gradeDistribution = [
  { grade: 'A', count: 245, color: 'text-emerald-400' },
  { grade: 'B', count: 412, color: 'text-primary-400' },
  { grade: 'C', count: 198, color: 'text-amber-400' },
  { grade: 'D', count: 67, color: 'text-orange-400' },
  { grade: 'F', count: 28, color: 'text-red-400' },
]

const letters = ['A+','A','A-','B+','B','B-','C+','C','C-','D','F']
const statuses = ['approved','submitted','submitted','pending','approved']

const allGrades = mockStudents.slice(0, 40).flatMap((s, si) =>
  mockCourses.slice(0, 2).map((c, ci) => {
    const midterm = 30 + Math.floor(Math.random() * 20)
    const final = 30 + Math.floor(Math.random() * 20)
    const total = midterm + final
    const pct = total / 100
    const letter = pct >= 0.97 ? 'A+' : pct >= 0.93 ? 'A' : pct >= 0.90 ? 'A-' : pct >= 0.87 ? 'B+' : pct >= 0.83 ? 'B' : pct >= 0.80 ? 'B-' : pct >= 0.77 ? 'C+' : pct >= 0.73 ? 'C' : pct >= 0.70 ? 'C-' : pct >= 0.60 ? 'D' : 'F'
    return {
      id: `${s.id}-${c.id}`, avatar: s.avatar,
      studentName: `${s.firstName} ${s.lastName}`,
      studentId: s.studentId, course: c.name,
      midterm, final, total,
      letter, status: statuses[(si + ci) % statuses.length],
    }
  })
)

const filteredGrades = computed(() =>
  allGrades.filter(g => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || g.studentName.toLowerCase().includes(q) || g.studentId.toLowerCase().includes(q)
    const matchCourse = !selectedCourse.value || mockCourses.find(c => c.id === selectedCourse.value)?.name === g.course
    return matchSearch && matchCourse
  })
)

const paginatedGrades = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredGrades.value.slice(start, start + pageSize.value)
})

const scoreBarColor = (score: number) => score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-primary-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
const gradeLetterColor = (g: string) => ['A+','A','A-'].includes(g) ? 'text-emerald-400' : ['B+','B','B-'].includes(g) ? 'text-primary-400' : ['C+','C','C-'].includes(g) ? 'text-amber-400' : 'text-red-400'

const columns = [
  { key: 'student', label: 'Student', sortable: true },
  { key: 'course', label: 'Course', sortable: true },
  { key: 'midterm', label: 'Midterm', sortable: true },
  { key: 'final', label: 'Final', sortable: true },
  { key: 'total', label: 'Total Score', sortable: true },
  { key: 'letter', label: 'Grade', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', width: '60px' },
]
</script>
