<template>
  <div class="stat-card rounded-lg p-5">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="font-display font-bold text-lg" style="color: var(--text-primary)">Today's Schedule</h3>
        <p class="text-sm mt-0.5" style="color: var(--text-muted)">Upcoming classes</p>
      </div>
      <NuxtLink to="/schedule" class="btn-ghost text-xs px-3 py-1.5">View all</NuxtLink>
    </div>

    <div class="space-y-6">
      <div v-for="cls in classes" :key="cls.id"
        class="flex items-center gap-10 p-3 rounded-xl transition-colors hover:bg-[var(--surface-hover)] cursor-pointer group">
        <!-- Time -->
        <div class="text-center shrink-0 w-14">
          <div class="text-sm font-bold" style="color: var(--text-primary)">{{ cls.time }}</div>
          <div class="text-xs" style="color: var(--text-muted)">{{ cls.duration }}</div>
        </div>

        <!-- Divider -->
        <div class="w-px h-10 rounded-full" style="background: var(--surface-border)" />

        <!-- Class info -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold truncate" style="color: var(--text-primary)">{{ cls.course }}</div>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-sm" style="color: var(--text-muted)">{{ cls.teacher }}</span>
            <span class="text-sm text-primary-400">· {{ cls.room }}</span>
          </div>
        </div>

        <!-- Enrolled -->
        <div class="shrink-0 text-right">
          <div class="text-base font-semibold" style="color: var(--text-primary)">{{ cls.enrolled }}</div>
          <div class="text-sm" style="color: var(--text-muted)">students</div>
        </div>

        <!-- Status dot -->
        <div class="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockUpcomingClasses } from '~/utils/mock-data'
const classes = mockUpcomingClasses
</script>
