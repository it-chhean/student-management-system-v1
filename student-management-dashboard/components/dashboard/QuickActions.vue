<template>
  <div class="stat-card rounded-lg p-5">
    <h3 class="font-display font-bold text-base mb-4" style="color: var(--text-primary)">Quick Actions</h3>
    <div class="grid grid-cols-2 gap-3">
      <button v-for="action in actions" :key="action.label"
        class="flex flex-col items-center gap-2.5 p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] group"
        :style="`background: ${action.bg}; border: 1px solid ${action.border}`"
        @click="action.onClick">
        <div class="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          :style="`background: ${action.iconBg}`">
          <svg class="w-5 h-5" :style="`color: ${action.color}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-html="action.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" />
          </svg>
        </div>
        <span class="text-xs font-semibold text-center" :style="`color: ${action.color}`">{{ action.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const actions = [
  {
    label: 'Add Student', color: '#818cf8', iconBg: 'rgba(99,102,241,0.15)',
    bg: 'rgba(99,102,241,0.05)', border: 'rgba(99,102,241,0.15)',
    iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    onClick: () => router.push('/students?add=true'),
  },
  {
    label: 'New Course', color: '#34d399', iconBg: 'rgba(16,185,129,0.15)',
    bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.15)',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    onClick: () => router.push('/courses?add=true'),
  },
  {
    label: 'Mark Attendance', color: '#fb923c', iconBg: 'rgba(251,146,60,0.15)',
    bg: 'rgba(251,146,60,0.05)', border: 'rgba(251,146,60,0.15)',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    onClick: () => router.push('/attendance'),
  },
  {
    label: 'View Reports', color: '#a78bfa', iconBg: 'rgba(167,139,250,0.15)',
    bg: 'rgba(167,139,250,0.05)', border: 'rgba(167,139,250,0.15)',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    onClick: () => router.push('/reports'),
  },
]
</script>
