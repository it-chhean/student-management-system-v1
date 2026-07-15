<template>
  <div class="animate-fade-in">
    <div class="mb-8 text-center">
      <h2 class="font-display text-3xl font-bold" style="color: var(--text-primary)">Welcome back</h2>
      <p class="mt-2 text-sm" style="color: var(--text-secondary)">
        Sign in to your EduAdmin Pro account
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <!-- Email -->
      <div class="space-y-1.5">
        <label class="text-xs font-semibold" style="color: var(--text-secondary)">Email address</label>
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
          </svg>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@eduadmin.edu"
            autocomplete="email"
            class="input-field pl-10"
            :class="errors.email ? 'error' : ''"
          />
        </div>
        <p v-if="errors.email" class="text-xs text-red-400">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold" style="color: var(--text-secondary)">Password</label>
          <NuxtLink to="/auth/forgot-password" class="text-xs text-primary-400 hover:underline">
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            autocomplete="current-password"
            class="input-field pl-10 pr-10"
            :class="errors.password ? 'error' : ''"
          />
          <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2"
            style="color: var(--text-muted)"
            @click="showPassword = !showPassword">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>
        <p v-if="errors.password" class="text-xs text-red-400">{{ errors.password }}</p>
      </div>

      <!-- Remember me -->
      <div class="flex items-center gap-2">
        <input id="remember" type="checkbox" class="checkbox-custom"/>
        <label for="remember" class="text-sm cursor-pointer" style="color: var(--text-secondary)">
          Keep me signed in
        </label>
      </div>

      <!-- Error message -->
      <Transition name="slide-up">
        <div v-if="authError"
          class="flex items-center gap-2 p-3 rounded-xl text-sm text-red-400"
          style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2)">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          {{ authError }}
        </div>
      </Transition>

      <!-- Submit -->
      <button type="submit" class="btn-primary w-full py-3 mt-2" :disabled="authLoading">
        <svg v-if="authLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        {{ authLoading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm" style="color: var(--text-muted)">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-primary-400 font-semibold hover:underline ml-1">
        Create account
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Sign In' })

const authStore = useAuthStore()
const toast = useToast()

const showPassword = ref(false)
const form = reactive({ email: '', password: '' })
const errors = ref<Record<string, string>>({})
const {user} = storeToRefs(authStore);

const authLoading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)


const handleLogin = async () =>  {
  authStore.clearError();

  try {
    const response = await authStore.signin(form);
    if (response) {
      toast.success("Logged in successfully.")
    
      if (authStore.isAdmin || authStore.isStaff) {
        await navigateTo("/dashboard")
      } else if (authStore.userName.toLowerCase().includes("teacher")) {
        await navigateTo("/teachers")
      } else {
        await navigateTo("/")
      }
    } else {
      toast.error("Email or Password incorrect.")
    }
  }catch(e: any) {
    console.log(e.message);
  }
}

// Clear errors on input
watch(() => form.email, () => { delete errors.value.email; authStore.clearError() })
watch(() => form.password, () => { delete errors.value.password; authStore.clearError() })
</script>
