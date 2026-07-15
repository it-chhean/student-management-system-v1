<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div><h1>Attendance</h1><p>Track and manage student attendance across all courses.</p></div>
      <div class="flex gap-2">
        <button class="btn-secondary rounded-lg text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Export
        </button>
        <button class="btn-primary rounded-lg text-sm" @click="markOpen = true">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          Mark Attendance
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in summaryCards" :key="card.label"
        class="stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted)">{{ card.label }}</span>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="`background: ${card.bg}`">
            <span class="text-sm font-bold" :style="`color: ${card.color}`">{{ card.icon }}</span>
          </div>
        </div>
        <div class="font-display text-2xl font-bold" :style="`color: ${card.color}`">{{ card.value }}</div>
        <div class="progress-bar mt-2">
          <div class="progress-fill" :style="`width: ${card.percent}%; background: ${card.color}`" />
        </div>
        <div class="text-xs mt-1" style="color: var(--text-muted)">{{ card.percent }}% of total</div>
      </div>
    </div>

    <!-- Attendance Chart + Calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-display font-bold" style="color: var(--text-primary)">Weekly Attendance</h3>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Present vs Absent this week</p>
          </div>
        </div>
        <div class="h-52">
          <Bar v-if="chartLoaded" :data="attendanceChartData" :options="barOptions" />
          <div v-else class="h-full skeleton rounded-xl" />
        </div>
      </div>

      <!-- Attendance Heatmap (simple) -->
      <div class="stat-card rounded-lg p-5">
        <h3 class="font-display font-bold mb-4" style="color: var(--text-primary)">This Month</h3>
        <div class="grid grid-cols-7 gap-1">
          <div v-for="day in ['S','M','T','W','T','F','S']" :key="day" class="text-center text-xs font-semibold" style="color: var(--text-muted)">{{ day }}</div>
          <div v-for="(cell, i) in calendarCells" :key="i"
            class="aspect-square rounded flex items-center justify-center text-xs font-semibold transition-all hover:scale-110 cursor-pointer"
            :style="cell.style">
            {{ cell.day }}
          </div>
        </div>
        <div class="flex items-center gap-4 mt-4">
          <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-emerald-500/30" /><span class="text-xs" style="color: var(--text-muted)">High</span></div>
          <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-amber-500/30" /><span class="text-xs" style="color: var(--text-muted)">Medium</span></div>
          <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-red-500/20" /><span class="text-xs" style="color: var(--text-muted)">Low</span></div>
        </div>
      </div>
    </div>

    <!-- Attendance Table -->
    <AppTable
      :columns="columns"
      :rows="filteredRecords"
      :loading="loading"
      :current-page="page"
      :page-size="pageSize"
      :total="filteredRecords.length"
      :total-pages="Math.ceil(filteredRecords.length / pageSize)"
      show-search
      search-placeholder="Search by student or course…"
      @page-change="page = $event"
      @page-size-change="pageSize = $event"
    >
      <template #toolbar>
        <select v-model="filterStatus" class="input-field py-2 text-sm w-36">
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
        </select>
        <input v-model="filterDate" type="date" class="input-field py-2 text-sm w-40" />
      </template>
      <template #default="{ row }">
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-3">
            <AppAvatar :src="row.avatar" :name="row.studentName" size="sm" />
            <span class="text-sm font-semibold" style="color: var(--text-primary)">{{ row.studentName }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-secondary)">{{ row.course }}</td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-secondary)">{{ row.date }}</td>
        <td class="px-4 py-3.5">
          <AppBadge :variant="attendanceVariant(row.status)" dot>{{ row.status }}</AppBadge>
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-muted)">{{ row.note ?? '—' }}</td>
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
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { mockStudents, mockCourses, mockAttendanceData } from '~/utils/mock-data'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

definePageMeta({ layout: 'default' })
useHead({ title: 'Attendance' })

const ui = useUiStore()
const loading = ref(false)
const markOpen = ref(false)
const filterStatus = ref('')
const filterDate = ref('')
const page = ref(1)
const pageSize = ref(10)
const chartLoaded = ref(false)

onMounted(() => setTimeout(() => chartLoaded.value = true, 400))

const summaryCards = [
  { label: 'Present', value: '1,695', icon: '✓', color: '#34d399', bg: 'rgba(16,185,129,0.1)', percent: 87 },
  { label: 'Absent', value: '142', icon: '✕', color: '#f87171', bg: 'rgba(239,68,68,0.1)', percent: 7 },
  { label: 'Late', value: '89', icon: '⏱', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', percent: 5 },
  { label: 'Excused', value: '24', icon: '📋', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', percent: 1 },
]

// Build mock records from students + courses
const records = mockStudents.slice(0, 30).flatMap((s, si) =>
  mockCourses.slice(0, 2).map((c, ci) => ({
    id: `${s.id}-${c.id}`,
    avatar: s.avatar,
    studentName: `${s.firstName} ${s.lastName}`,
    course: c.name,
    date: ['Dec 10', 'Dec 9', 'Dec 8', 'Dec 7', 'Dec 6'][(si + ci) % 5] + ', 2024',
    status: (['present', 'present', 'present', 'absent', 'late', 'excused'][(si * 2 + ci) % 6]) as string,
    note: ci % 4 === 0 ? 'Medical leave' : undefined,
  }))
)

const filteredRecords = computed(() =>
  records.filter(r =>
    (!filterStatus.value || r.status === filterStatus.value)
  )
)

const attendanceVariant = (s: string) => {
  const m: Record<string, string> = { present: 'success', absent: 'danger', late: 'warning', excused: 'info' }
  return (m[s] ?? 'muted') as 'success' | 'danger' | 'warning' | 'info' | 'muted'
}

const columns = [
  { key: 'student', label: 'Student', sortable: true },
  { key: 'course', label: 'Course', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'note', label: 'Note' },
  { key: 'actions', label: '', width: '60px' },
]

const attendanceChartData = computed(() => mockAttendanceData)

const barOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: true, labels: { color: ui.isDark ? '#94a3b8' : '#475569', font: { size: 11 } } }, tooltip: { backgroundColor: ui.isDark ? '#141c2e' : '#fff', titleColor: ui.isDark ? '#f1f5f9' : '#0f172a', bodyColor: ui.isDark ? '#94a3b8' : '#475569', borderColor: ui.isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0', borderWidth: 1, padding: 10, cornerRadius: 10 } },
  scales: {
    x: { stacked: false, grid: { display: false }, border: { display: false }, ticks: { color: ui.isDark ? '#475569' : '#94a3b8', font: { size: 11 } } },
    y: { grid: { color: ui.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { color: ui.isDark ? '#475569' : '#94a3b8', font: { size: 11 } } },
  },
  borderRadius: 6,
}))

// Simple calendar cells
const calendarCells = computed(() => {
  const cells = []
  for (let i = 0; i < 2; i++) cells.push({ day: '', style: '' }) // offset
  for (let d = 1; d <= 31; d++) {
    const rate = 50 + Math.random() * 50
    const bg = rate > 85 ? 'rgba(16,185,129,0.3)' : rate > 70 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.2)'
    const color = rate > 85 ? '#34d399' : rate > 70 ? '#fbbf24' : '#f87171'
    cells.push({ day: d, style: `background: ${bg}; color: ${color}` })
  }
  return cells
})
</script>
