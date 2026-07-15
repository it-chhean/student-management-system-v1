<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs font-medium" style="color: var(--text-muted)">
      <NuxtLink to="/departments" class="hover:text-primary-400 transition-colors">Departments</NuxtLink>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span style="color: var(--text-primary)">{{ department?.name || 'Loading...' }}</span>
    </nav>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--surface-border)]">
      <div class="space-y-4 max-w-3xl">
        <div v-if="loading" class="space-y-3">
          <div class="h-8 w-64 bg-[var(--surface-card)] animate-pulse rounded-lg" />
          <div class="h-4 w-96 bg-[var(--surface-card)] animate-pulse rounded-lg" />
        </div>
        <template v-else-if="department">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center shrink-0 border border-primary-500/20">
              <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-display font-bold tracking-tight" style="color: var(--text-primary)">{{ department.name }}</h1>
              <p class="text-sm mt-1" style="color: var(--text-muted)">ID: {{ department.id }}</p>
            </div>
          </div>
          <p class="text-[var(--text-secondary)] leading-relaxed">{{ department.description || 'No description provided.' }}</p>
        </template>
      </div>

      <div class="flex gap-3">
        <button class="btn-secondary rounded-lg px-4 py-2 text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Classes Card -->
      <div 
        class="group p-6 rounded-2xl border transition-all duration-300 cursor-pointer bg-[var(--surface-card)] border-[var(--surface-border)] hover:border-indigo-500/50"
        @click="navigateTo(`/classes?departmentId=${route.params.id}`)"
      >
        <div class="flex items-start justify-between">
          <div class="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span class="text-2xl font-bold font-display" style="color: var(--text-primary)">{{ classCount }}</span>
        </div>
        <div class="mt-4">
          <h3 class="font-bold text-sm" style="color: var(--text-primary)">Classes</h3>
          <p class="text-xs mt-1" style="color: var(--text-muted)">Manage groupings and student batches</p>
        </div>
      </div>

      <!-- Subjects Card -->
      <div 
        class="group p-6 rounded-2xl border transition-all duration-300 cursor-pointer bg-[var(--surface-card)] border-[var(--surface-border)] hover:border-emerald-500/50"
        @click="navigateTo(`/subjects?departmentId=${route.params.id}`)"
      >
        <div class="flex items-start justify-between">
          <div class="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="text-2xl font-bold font-display" style="color: var(--text-primary)">{{ subjectCount }}</span>
        </div>
        <div class="mt-4">
          <h3 class="font-bold text-sm" style="color: var(--text-primary)">Subjects</h3>
          <p class="text-xs mt-1" style="color: var(--text-muted)">Curriculum modules and credit points</p>
        </div>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
      <div class="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--surface-border)] space-y-4">
        <h3 class="font-bold text-base flex items-center gap-2" style="color: var(--text-primary)">
          <svg class="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Entity Information
        </h3>
        <div class="grid grid-cols-2 gap-y-4 text-sm">
          <div class="text-[var(--text-muted)]">Created At</div>
          <div class="text-[var(--text-primary)] font-medium">{{ formatDate(department?.creatoinAt) }}</div>
          <div class="text-[var(--text-muted)]">Last Updated</div>
          <div class="text-[var(--text-primary)] font-medium">{{ formatDate(department?.updatedAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const departmentStore = useDepartmentStore()
const classStore = useClassStore()
const subjectStore = useSubjectStore()

const loading = computed(() => departmentStore.loading || classStore.loading || subjectStore.loading)
const department = computed(() => departmentStore.selectedDepartment)

const classCount = computed(() => {
  const id = route.params.id as string
  return classStore.classes.filter(c => c.departmentId === id).length
})

const subjectCount = computed(() => {
  const id = route.params.id as string
  return subjectStore.getSubjectCountByDepartment(id)
})

const formatDate = (date: any) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  const id = route.params.id as string
  await Promise.all([
    departmentStore.fetchById(id),
    classStore.fetchClasses(),
    subjectStore.fetchSubjects()
  ])
})
</script>