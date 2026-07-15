<template>
  <nav class="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
    <template v-for="(crumb, i) in breadcrumbs" :key="crumb.path">
      <svg v-if="i > 0" class="w-3.5 h-3.5 shrink-0" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <NuxtLink
        v-if="i < breadcrumbs.length - 1"
        :to="crumb.path"
        class="hover:text-primary-400 transition-colors truncate"
        style="color: var(--text-muted)">
        {{ crumb.label }}
      </NuxtLink>
      <span v-else class="font-semibold truncate" style="color: var(--text-primary)">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const routeLabelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  teachers: 'Teachers',
  courses: 'Courses',
  departments: 'Departments',
  attendance: 'Attendance',
  grades: 'Grades',
  payments: 'Payments',
  schedule: 'Schedule',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  auth: 'Auth',
  login: 'Login',
  register: 'Register',
}

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const crumbs = [{ label: 'Home', path: '/dashboard' }]
  let currentPath = ''
  for (const seg of segments) {
    currentPath += `/${seg}`
    crumbs.push({ label: routeLabelMap[seg] ?? seg, path: currentPath })
  }
  return crumbs
})
</script>
