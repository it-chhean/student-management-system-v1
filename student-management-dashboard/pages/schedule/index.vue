<template>
  <div class="space-y-6">
    <div
      class="flex flex-wrap items-center justify-between gap-4 page-header pb-4 border-b border-[var(--surface-border)]">
      <div>
        <h1 class="text-3xl font-display font-bold tracking-tight">Academic Schedule</h1>
        <p class="text-[var(--text-muted)] text-sm">Dynamic timetable management across all sessions.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex p-1 rounded-md bg-[var(--surface-muted)] border border-[var(--surface-border)] shadow-sm">
          <button v-for="v in ['week', 'month', 'list']" :key="v"
            class="px-4 py-1.5 text-xs font-bold transition-all duration-200 capitalize rounded-md"
            :class="viewMode === v ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'hover:bg-[var(--surface-hover)] text-[var(--text-muted)]'"
            @click="viewMode = v">
            {{ v }}
          </button>
        </div>
        <div class="flex gap-2">
          <button
            class="btn-secondary rounded-md text-sm px-4 py-2 flex items-center gap-2 border border-[var(--surface-border)] shadow-sm"
            @click="exportToExcel">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel
          </button>
          <button
            class="btn-primary rounded-md text-sm px-4 py-2 flex items-center gap-2 shadow-lg shadow-primary-500/30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Class
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div
      class="stat-card rounded-md p-4 flex flex-wrap items-center gap-4 border border-[var(--surface-border)] shadow-sm">
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--surface-muted)] border border-[var(--surface-border)]">
        <svg class="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Filters</span>
      </div>

      <select v-model="filters.departmentId"
        class="input-field text-sm py-2 px-3 rounded-md border border-[var(--surface-border)] min-w-[160px]">
        <option value="">All Departments</option>
        <option v-for="d in departmentStore.departments" :key="d.id" :value="d.id">{{ d.name }}</option>
      </select>

      <select v-model="filters.teacherId"
        class="input-field text-sm py-2 px-3 rounded-md border border-[var(--surface-border)] min-w-[160px]">
        <option value="">All Teachers</option>
        <option v-for="u in users" :key="u.id" :value="u.id">{{ u.fullName }}</option>
      </select>

      <div class="h-6 w-px bg-[var(--surface-border)] mx-2 hidden lg:block" />

      <div class="flex-1 flex justify-end gap-2">
        <button
          class="p-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] transition-colors"
          @click="previousWeek">
          <svg class="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          class="flex flex-col items-center justify-center px-4 py-1 rounded-md bg-primary-500/5 border border-primary-500/20">
          <span class="text-[10px] font-bold uppercase tracking-widest text-primary-400">Week {{ currentWeek }}</span>
          <span class="text-xs font-bold text-[var(--text-primary)]">{{ currentWeekRange }}</span>
        </div>
        <button
          class="p-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] transition-colors"
          @click="nextWeek">
          <svg class="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Weekly Timetable Grid -->
    <div v-if="viewMode === 'week'"
      class="relative stat-card rounded-md overflow-hidden border border-[var(--surface-border)] shadow-xl">
      <!-- Grid Header -->
      <div
        class="grid grid-cols-[100px_repeat(6,1fr)] border-b border-[var(--surface-border)] bg-[var(--surface-muted)]">
        <div class="p-4 flex flex-col justify-center items-center gap-1">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] font-black tracking-tighter" style="color: var(--text-muted)">SLOTS</span>
        </div>
        <div v-for="day in weekDays" :key="day.id"
          class="p-4 text-center border-l border-[var(--surface-border)] transition-colors duration-300"
          :class="day.isToday ? 'bg-primary-500/10' : ''">
          <div class="text-[10px] font-black tracking-widest uppercase mb-1"
            :class="day.isToday ? 'text-primary-400' : 'text-[var(--text-muted)]'">{{ day.full }}</div>
          <div class="font-display text-lg font-black"
            :class="day.isToday ? 'text-primary-400 animate-pulse' : 'text-[var(--text-primary)]'">{{ day.date }}</div>
        </div>
      </div>

      <!-- Grid Body -->
      <div class="divide-y divide-[var(--surface-border)]">
        <div v-for="session in SESSIONS" :key="session.label"
          class="grid grid-cols-[100px_repeat(6,1fr)] min-h-[140px] group">
          <!-- Time Column -->
          <div
            class="p-4 flex flex-col items-center justify-center bg-[var(--surface-muted)]/50 border-r border-[var(--surface-border)] group-hover:bg-primary-500/5 transition-colors">
            <span class="text-xs font-black text-primary-400 uppercase tracking-tighter">{{ session.label }}</span>
            <div class="mt-2 text-[14px] font-medium px-2 py-0.5 rounded-md bg-[var(--surface-border)]"
              style="color: var(--text-muted)">
              {{ session.start }} – {{ session.end }}
            </div>
          </div>

          <!-- Activity Slots -->
          <div v-for="day in weekDays" :key="day.id"
            class="p-2 border-l border-[var(--surface-border)] relative group-hover:bg-white/2 transition-colors overflow-hidden"
            :class="day.isToday ? 'bg-primary-500/5' : ''">
            <div v-for="cls in getScheduleFor(day.name, session.label)" :key="cls.id"
              class="schedule-item rounded-xl p-3 mb-2 shadow-lg border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              :style="`background: ${cls.bg}; border-color: ${cls.color}; color: ${cls.color}`">
              <div class="flex items-start justify-between gap-2 overflow-hidden">
                <span class="text-[11px] font-black leading-none truncate uppercase">{{ cls.subjectName }}</span>
              </div>
              <div class="mt-2 space-y-1">
                <div class="flex items-center gap-1.5 opacity-80">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span class="text-[10px] font-bold">{{ cls.room }}</span>
                </div>
                <div class="flex items-center gap-1.5 opacity-80">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-[10px] font-bold truncate">{{ cls.instructorName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="flattenedSchedule.length === 0 && !loading"
      class="flex flex-col items-center justify-center py-20 bg-[var(--surface-card)] rounded-md border border-dashed border-[var(--surface-border)]">
      <div class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold" style="color: var(--text-primary)">No Schedules Found</h3>
      <p class="text-sm mt-1" style="color: var(--text-muted)">Try adjusting your filters or create a new schedule
        entry.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addDays, startOfWeek, format, isSameDay } from 'date-fns'

const courseStore = useCourseStore()
const departmentStore = useDepartmentStore()

definePageMeta({ layout: 'default' })
useHead({ title: 'Schedule' })

const viewMode = ref('week')
const currentWeek = ref(15)
const filters = ref({
  departmentId: '',
  teacherId: '',
})

// Morning 07:30 - 10:30, Afternoon 14:30 - 17:30, Evening 19:30 - 21:00
const SESSIONS = [
  { label: 'Morning', start: '07:30', end: '10:30' },
  { label: 'Afternoon', start: '14:30', end: '17:30' },
  { label: 'Evening', start: '19:30', end: '21:00' },
]

const COLORS = [
  { color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
  { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
  { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)' },
]

const users = ref<any[]>([])
const loading = ref(false)

const startOfSelectedWeek = computed(() => {
  const base = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  return addDays(base, (currentWeek.value - 15) * 7)
})

const weekDays = computed(() => {
  return Array.from({ length: 6 }).map((_, i) => {
    const date = addDays(startOfSelectedWeek.value, i)
    return {
      id: i,
      name: format(date, 'EEEE').toUpperCase(),
      full: format(date, 'EEEE'),
      short: format(date, 'EEE'),
      date: format(date, 'd'),
      isToday: isSameDay(date, new Date())
    }
  })
})

const currentWeekRange = computed(() => {
  const start = weekDays.value[0].date + ' ' + format(startOfSelectedWeek.value, 'MMM')
  const end = weekDays.value[5].date + ' ' + format(addDays(startOfSelectedWeek.value, 5), 'MMM yyyy')
  return `${start} — ${end}`
})

const flattenedSchedule = computed(() => {
  return courseStore.courses.flatMap((course, idx) => {
    const color = COLORS[idx % COLORS.length]
    return (course.schedules || []).map(s => ({
      id: s.id || `${course.id}-${s.dayOfWeek}-${s.startTime}`,
      courseId: course.id,
      courseName: course.name,
      departmentId: "",
      instructorId: course.instructorId,
      instructorName: course.instructorName || 'TBD',
      subjectName: course.subjectName || course.name,
      day: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room ? `Room ${s.room}` : 'TBD',
      ...color
    }))
  }).filter(c => {
    const matchDep = !filters.value.departmentId || c.departmentId === filters.value.departmentId
    const matchTeacher = !filters.value.teacherId || c.instructorId === filters.value.teacherId
    return matchDep && matchTeacher
  })
})

const getScheduleFor = (day: string, sessionLabel: string) => {
  return flattenedSchedule.value.filter(item => {
    if (item.day !== day) return false

    // Simplistic mapping: 07:30 -> Morning, etc.
    const startHour = parseInt(item.startTime.split(':')[0])
    if (sessionLabel === 'Morning' && startHour < 12) return true
    if (sessionLabel === 'Afternoon' && startHour >= 12 && startHour < 18) return true
    if (sessionLabel === 'Evening' && startHour >= 18) return true

    return false
  })
}

const nextWeek = () => currentWeek.value++
const previousWeek = () => currentWeek.value--

const exportToExcel = () => {
  // Mock export
  const toast = useToast()
  toast.success('Schedule exported to Excel successfully')
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    courseStore.fetchCourse(),
    departmentStore.fetchDepartment()
  ])
  loading.value = false
})
</script>

<style scoped>
.schedule-item {
  backdrop-filter: blur(4px);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
