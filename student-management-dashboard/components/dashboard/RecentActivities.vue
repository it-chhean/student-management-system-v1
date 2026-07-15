<template>
  <div class="stat-card rounded-lg p-5">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="font-display font-bold text-base" style="color: var(--text-primary)">Recent Activity</h3>
        <p class="text-sm mt-0.5" style="color: var(--text-muted)">Latest system events</p>
      </div>
      <button class="btn-ghost text-xs px-3 py-1.5">View all</button>
    </div>

    <div class="space-y-0">
      <div v-for="(activity, i) in activities" :key="activity.id"
        class="flex gap-3 group">
        <!-- Timeline line -->
        <div class="flex flex-col items-center">
          <AppAvatar :src="activity.userAvatar" :name="activity.userName" size="sm" class="shrink-0" />
          <div v-if="i < activities.length - 1" class="w-px flex-1 mt-2 mb-2"
            style="background: var(--surface-border)" />
        </div>

        <!-- Content -->
        <div class="flex-1 pb-4">
          <p class="text-sm" style="color: var(--text-primary)">
            <span class="font-semibold">{{ activity.userName }}</span>
            {{ ' ' }}{{ activity.description }}
          </p>
          <p class="text-xs mt-1" style="color: var(--text-muted)">{{ formatRelative(activity.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockActivities } from '~/utils/mock-data'
import { formatRelative } from '~/utils/formatters'

const activities = mockActivities
</script>
