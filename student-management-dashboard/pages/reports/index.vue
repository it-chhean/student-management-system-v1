<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div><h1>Reports & Analytics</h1><p>Institutional data, trends, and performance insights.</p></div>
      <div class="flex gap-2">
        <select class="input-field py-2 text-sm w-36">
          <option>Fall 2024</option>
          <option>Spring 2024</option>
        </select>
        <button class="btn-secondary rounded-lg text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Export PDF
        </button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <div v-for="kpi in kpis" :key="kpi.label"
        class="stat-card rounded-lg p-4 text-center">
        <div class="font-display text-xl font-bold mb-0.5" :style="`color: ${kpi.color}`">{{ kpi.value }}</div>
        <div class="text-xs" style="color: var(--text-muted)">{{ kpi.label }}</div>
      </div>
    </div>

    <!-- Charts grid -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Enrollment Trend -->
      <div class="stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-display font-bold" style="color: var(--text-primary)">Enrollment Trend</h3>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Monthly new enrollments</p>
          </div>
        </div>
        <div class="h-52">
          <Line v-if="chartLoaded" :data="enrollmentData" :options="lineOptions" />
          <div v-else class="h-full skeleton rounded-xl" />
        </div>
      </div>

      <!-- Revenue by Type -->
      <div class="stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-display font-bold" style="color: var(--text-primary)">Revenue by Type</h3>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Income breakdown</p>
          </div>
        </div>
        <div class="h-52">
          <Doughnut v-if="chartLoaded" :data="revenueByType" :options="doughnutOptions" />
          <div v-else class="h-full skeleton rounded-xl" />
        </div>
      </div>

      <!-- Department Performance -->
      <div class="stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-display font-bold" style="color: var(--text-primary)">Dept. Performance</h3>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Average GPA by department</p>
          </div>
        </div>
        <div class="h-52">
          <Bar v-if="chartLoaded" :data="deptPerformance" :options="barOptions" />
          <div v-else class="h-full skeleton rounded-xl" />
        </div>
      </div>

      <!-- Attendance by Course -->
      <div class="stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-display font-bold" style="color: var(--text-primary)">Attendance by Course</h3>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Average attendance rate</p>
          </div>
        </div>
        <div class="space-y-3 mt-2">
          <div v-for="course in topCourses" :key="course.name" class="flex items-center gap-3">
            <div class="text-xs w-32 truncate" style="color: var(--text-secondary)">{{ course.name }}</div>
            <div class="flex-1 progress-bar">
              <div class="progress-fill transition-all duration-700"
                :class="course.rate >= 85 ? 'bg-emerald-500' : course.rate >= 70 ? 'bg-primary-500' : 'bg-amber-500'"
                :style="`width: ${course.rate}%`" />
            </div>
            <span class="text-xs font-bold w-10 text-right"
              :class="course.rate >= 85 ? 'text-emerald-400' : course.rate >= 70 ? 'text-primary-400' : 'text-amber-400'">
              {{ course.rate }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="report in availableReports" :key="report.title"
        class="stat-card rounded-lg p-5 transition-all cursor-pointer group">
        <div class="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" :style="`background: ${report.bg}`">
          <svg class="w-5 h-5" :style="`color: ${report.color}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="report.icon"/>
          </svg>
        </div>
        <h3 class="font-display font-bold text-sm mb-1" style="color: var(--text-primary)">{{ report.title }}</h3>
        <p class="text-xs mb-4" style="color: var(--text-muted)">{{ report.description }}</p>
        <button class="btn-secondary text-xs py-1.5 w-full group-hover:border-primary-500/50 group-hover:text-primary-400 transition-colors">
          Generate Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line, Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Filler, Tooltip, Legend)

definePageMeta({ layout: 'default' })
useHead({ title: 'Reports & Analytics' })

const ui = useUiStore()
const chartLoaded = ref(false)
onMounted(() => setTimeout(() => chartLoaded.value = true, 400))

const kpis = [
  { label: 'Total Students', value: '1,750', color: '#FFFFFF' },
  { label: 'Graduation Rate', value: '94.2%', color: '#FFFFFF' },
  { label: 'Avg. GPA', value: '3.24', color: '#FFFFFF' },
  { label: 'Attendance', value: '87.4%', color: '#FFFFFF' },
  { label: 'Courses', value: '48', color: '#FFFFFF' },
  { label: 'Faculty', value: '106', color: '#FFFFFF' },
]

const tOpts = computed(() => ({
  backgroundColor: ui.isDark ? '#141c2e' : '#fff',
  titleColor: ui.isDark ? '#f1f5f9' : '#0f172a',
  bodyColor: ui.isDark ? '#94a3b8' : '#475569',
  borderColor: ui.isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
  borderWidth: 1, padding: 10, cornerRadius: 10,
}))

const baseScales = computed(() => ({
  x: { grid: { display: false }, border: { display: false }, ticks: { color: ui.isDark ? '#475569' : '#94a3b8', font: { size: 11 } } },
  y: { grid: { color: ui.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { color: ui.isDark ? '#475569' : '#94a3b8', font: { size: 11 } } },
}))

const lineOptions = computed(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tOpts.value }, scales: baseScales.value }))
const barOptions = computed(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tOpts.value }, scales: baseScales.value, borderRadius: 6 }))
const doughnutOptions = computed(() => ({ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: true, position: 'right' as const, labels: { color: ui.isDark ? '#94a3b8' : '#475569', font: { size: 11 }, padding: 12, boxWidth: 10 } }, tooltip: tOpts.value } }))

const enrollmentData = { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets: [{ label: 'New Students', data: [28,35,42,38,55,61,48,72,89,76,68,95], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4, borderWidth: 2 }] }
const revenueByType = { labels: ['Tuition','Registration','Exam','Library','Hostel'], datasets: [{ data: [68,12,8,5,7], backgroundColor: ['rgba(99,102,241,0.8)','rgba(16,185,129,0.8)','rgba(245,158,11,0.8)','rgba(59,130,246,0.8)','rgba(167,139,250,0.8)'], borderWidth: 0 }] }
const deptPerformance = { labels: ['CS','Math','Physics','Engineering','Business'], datasets: [{ label: 'Avg GPA', data: [3.42,3.28,3.15,3.35,3.18], backgroundColor: ['rgba(99,102,241,0.7)','rgba(16,185,129,0.7)','rgba(245,158,11,0.7)','rgba(239,68,68,0.7)','rgba(167,139,250,0.7)'], borderWidth: 0 }] }

const topCourses = [
  { name: 'Data Structures', rate: 94 }, { name: 'Calculus I', rate: 88 }, { name: 'Physics I', rate: 82 },
  { name: 'Business Mgmt', rate: 91 }, { name: 'Database Sys.', rate: 86 }, { name: 'Machine Learning', rate: 79 },
]

const availableReports = [
  { title: 'Student Progress Report', description: 'Individual academic performance and attendance summary.', color: '#818cf8', bg: 'rgba(99,102,241,0.1)', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Financial Summary', description: 'Revenue, expenses, and payment collection overview.', color: '#34d399', bg: 'rgba(16,185,129,0.1)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Attendance Report', description: 'Attendance patterns, trends, and at-risk students.', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
]
</script>
