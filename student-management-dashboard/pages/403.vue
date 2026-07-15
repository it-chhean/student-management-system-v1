<template>
  <div class="min-h-screen flex items-center justify-center p-6" style="background: var(--surface-bg)">
    <div class="text-center space-y-6 max-w-md">
      <!-- Graphic -->
      <div class="relative mx-auto w-40 h-40">
        <div class="absolute inset-0 rounded-full bg-red-500/10 animate-ping" style="animation-duration: 3s" />
        <div class="relative w-full h-full rounded-full bg-red-500/10 flex items-center justify-center">
          <svg class="w-20 h-20 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
      </div>

      <!-- Text -->
      <div class="space-y-2">
        <p class="text-7xl font-display font-black" style="color: var(--text-primary)">403</p>
        <h1 class="text-2xl font-bold" style="color: var(--text-primary)">Access Forbidden</h1>
        <p class="text-sm leading-relaxed" style="color: var(--text-muted)">
          You don't have permission to view this page.<br />
          Contact your administrator if you believe this is a mistake.
        </p>
      </div>

      <!-- Role info -->
      <div v-if="userRoles.length" class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
        style="background: var(--surface-card); border: 1px solid var(--surface-border); color: var(--text-muted)">
        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Your role: <span class="font-semibold" style="color: var(--text-primary)">{{ roleLabel }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-3 flex-wrap">
        <NuxtLink
          to="/dashboard"
          class="btn-primary rounded-lg text-sm px-5 py-2.5 inline-flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Dashboard
        </NuxtLink>
        <button
          class="btn-secondary rounded-lg text-sm px-5 py-2.5 inline-flex items-center gap-2"
          @click="router.back()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROLE_LABELS } from '~/utils/constants'

definePageMeta({ layout: 'default' })
useHead({ title: '403 — Forbidden' })

const auth = useAuthStore()
const router = useRouter()

const userRoles = computed(() => auth.user?.roles ?? [])

const roleLabel = computed(() =>
  userRoles.value
    .map((r) => ROLE_LABELS[r] ?? r)
    .join(', '),
)
</script>
