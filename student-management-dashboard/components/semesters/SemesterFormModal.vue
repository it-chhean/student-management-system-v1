<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[8000] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.65); backdrop-filter: blur(6px)"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition name="modal">
          <div
            v-if="modelValue"
            class="w-full max-w-xl max-h-[90vh] flex flex-col rounded-md shadow-modal overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)"
          >
            <div
              class="flex items-center justify-between px-6 py-4 shrink-0"
              style="border-bottom: 1px solid var(--surface-border)"
            >
              <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">
                {{ semester?.id ? 'Edit Semester' : 'Create Semester' }}
              </h2>
              <button class="btn-ghost w-8 h-8 rounded-lg" @click="$emit('update:modelValue', false)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5">
              <form class="space-y-5" @submit.prevent="handleSubmit">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Semester Name *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g. Semester I - 2025"
                    class="input-field"
                    :class="errors.name ? 'error' : ''"
                  />
                  <p v-if="errors.name" class="text-xs text-red-400">{{ errors.name }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Start Date *</label>
                    <input
                      v-model="form.startDate"
                      type="date"
                      class="input-field"
                      :class="errors.startDate ? 'error' : ''"
                    />
                    <p v-if="errors.startDate" class="text-xs text-red-400">{{ errors.startDate }}</p>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">End Date *</label>
                    <input
                      v-model="form.endDate"
                      type="date"
                      class="input-field"
                      :class="errors.endDate ? 'error' : ''"
                    />
                    <p v-if="errors.endDate" class="text-xs text-red-400">{{ errors.endDate }}</p>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Description *</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    placeholder="Semester description..."
                    class="input-field resize-none"
                    :class="errors.description ? 'error' : ''"
                  />
                  <p v-if="errors.description" class="text-xs text-red-400">{{ errors.description }}</p>
                </div>
              </form>
            </div>

            <div class="flex items-center justify-between gap-3 px-6 py-4 shrink-0" style="border-top: 1px solid var(--surface-border)">
              <button class="btn-ghost text-sm" @click="$emit('update:modelValue', false)">Cancel</button>
              <button class="btn-primary" :disabled="loading" @click="handleSubmit">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ semester?.id ? 'Update Semester' : 'Create Semester' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Semester } from '~/types'
import { validateForm, isRequired, hasErrors } from '~/utils/validators'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  semester?: Partial<Semester> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: { name: string; startDate: string; endDate: string; description: string }): void
}>()

const errors = ref<Record<string, string>>({})
const form = reactive({
  name: '',
  startDate: '',
  endDate: '',
  description: '',
})

const hydrateForm = () => {
  form.name = props.semester?.name ?? ''
  form.startDate = props.semester?.startDate ?? ''
  form.endDate = props.semester?.endDate ?? ''
  form.description = props.semester?.description ?? ''
  errors.value = {}
}

watch(() => props.modelValue, (opened) => {
  if (opened) hydrateForm()
})

watch(() => props.semester, () => {
  if (props.modelValue) hydrateForm()
})

const handleSubmit = () => {
  errors.value = validateForm(form, {
    name: [v => isRequired(v, 'Semester name')],
    startDate: [v => isRequired(v, 'Start date')],
    endDate: [v => isRequired(v, 'End date')],
    description: [v => isRequired(v, 'Description')],
  })

  // Validate end date is after start date
  if (form.startDate && form.endDate && form.endDate <= form.startDate) {
    errors.value.endDate = 'End date must be after start date'
  }

  if (hasErrors(errors.value)) return

  emit('submit', {
    name: form.name.trim(),
    startDate: form.startDate,
    endDate: form.endDate,
    description: form.description.trim(),
  })
}
</script>
