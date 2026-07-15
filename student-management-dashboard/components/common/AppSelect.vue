<template>
  <div class="relative w-full" :class="{ 'z-[100]': isOpen }" ref="container">
    <div
      class="input-field flex items-center justify-between cursor-pointer py-2.5 px-4"
      :class="[error ? 'error' : '', disabled ? 'opacity-50 pointer-events-none' : '']"
      @click="toggle"
    >
      <div class="flex items-center gap-3 min-w-0">
        <!-- Loading Spinner -->
        <svg v-if="loading" class="w-4 h-4 animate-spin text-primary-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>

        <!-- Selected Thumbnail/Icon -->
        <div v-if="selectedOption?.image && !loading" class="w-6 h-6 rounded overflow-hidden shrink-0 bg-slate-100">
          <img :src="selectedOption.image" alt="" class="w-full h-full object-cover">
        </div>
        <div v-else-if="selectedOption?.icon && !loading" class="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-primary-500/10 text-primary-400">
          <span v-html="selectedOption.icon" class="w-4 h-4"></span>
        </div>
        
        <span v-if="selectedOption && !loading" class="truncate font-medium">{{ selectedOption.label }}</span>
        <span v-else-if="!loading" class="text-[var(--text-muted)]">{{ placeholder }}</span>
        <span v-else class="text-[var(--text-muted)]">Loading...</span>
      </div>
      
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
        style="color: var(--text-muted)"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute z-[9000] w-full mt-2 rounded-md shadow-lg overflow-hidden border"
        style="background: var(--surface-card); border-color: var(--surface-border)"
      >
        <div class="max-h-60 overflow-y-auto py-1">
          <div
            v-for="option in options"
            :key="option.value"
            class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/5 transition-colors"
            :class="modelValue === option.value ? 'bg-primary-500/10 text-primary-400' : 'text-[var(--text-primary)]'"
            @click="select(option)"
          >
            <!-- Option Thumbnail/Icon -->
            <div v-if="option.image" class="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-slate-100">
              <img :src="option.image" alt="" class="w-full h-full object-cover">
            </div>
            <div v-else-if="option.icon" class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-primary-500/10 text-primary-400">
              <span v-html="option.icon" class="w-4 h-4"></span>
            </div>
            
            <div class="min-w-0">
              <div class="font-medium text-sm truncate">{{ option.label }}</div>
              <div v-if="option.description" class="text-[10px] text-[var(--text-muted)] truncate">{{ option.description }}</div>
            </div>
          </div>
          
          <div v-if="!options.length" class="px-4 py-3 text-sm text-center italic text-[var(--text-muted)]">
            No options available
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

export interface SelectOption {
  value: string | number
  label: string
  description?: string
  image?: string
  icon?: string
}

const props = defineProps<{
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  error?: string
  disabled?: boolean
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const container = ref<HTMLElement | null>(null)

const selectedOption = computed(() => 
  props.options.find(opt => opt.value === props.modelValue)
)

const toggle = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const select = (option: SelectOption) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

onClickOutside(container, () => {
  isOpen.value = false
})
</script>

<style scoped>
.dropdown-enter-active {
  animation: dropIn 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dropdown-leave-active {
  animation: dropOut 0.15s ease-in;
}

@keyframes dropIn {
  from { opacity: 0; transform: scale(0.95) translateY(-5px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes dropOut {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.95) translateY(-5px); }
}
</style>
