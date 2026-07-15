<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <div class="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-5">
        <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
        </svg>
      </div>
      <h2 class="font-display text-3xl font-bold" style="color: var(--text-primary)">Forgot password?</h2>
      <p class="mt-2 text-sm" style="color: var(--text-secondary)">
        Enter your email and we'll send you a reset link.
      </p>
    </div>

    <!-- Success state -->
    <div v-if="emailSent"
      class="text-center space-y-4 py-6 animate-scale-in">
      <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
        <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <div>
        <h3 class="font-display font-bold text-lg" style="color: var(--text-primary)">Check your email</h3>
        <p class="text-sm mt-2" style="color: var(--text-secondary)">
          We've sent a password reset link to <strong class="text-primary-400">{{ email }}</strong>
        </p>
      </div>
      <p class="text-xs" style="color: var(--text-muted)">
        Didn't receive it?
        <button class="text-primary-400 hover:underline ml-1" @click="emailSent = false">Try again</button>
      </p>
    </div>

    <!-- Form state -->
    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1.5">
        <label class="text-xs font-semibold" style="color: var(--text-secondary)">Email address</label>
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <input v-model="email" type="email" placeholder="you@institution.edu" class="input-field pl-10" :class="error ? 'error' : ''" />
        </div>
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
      </div>

      <button type="submit" class="btn-primary w-full py-3" :disabled="loading">
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        {{ loading ? 'Sending…' : 'Send reset link' }}
      </button>
    </form>

    <div class="mt-6 text-center">
      <NuxtLink to="/auth/login" class="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:underline">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to sign in
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isRequired, isEmail } from '~/utils/validators'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Forgot Password' })

const email = ref('')
const error = ref('')
const loading = ref(false)
const emailSent = ref(false)

const handleSubmit = async () => {
  error.value = isRequired(email.value, 'Email') ?? isEmail(email.value) ?? ''
  if (error.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  emailSent.value = true
}
</script>
