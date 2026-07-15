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
            class="w-full max-w-lg flex flex-col rounded-md shadow-modal overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)"
          >
            <div class="flex items-center justify-between px-6 py-4 shrink-0" style="border-bottom: 1px solid var(--surface-border)">
              <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">
                {{ classObj?.id ? 'Edit Class' : 'Create Class' }}
              </h2>
              <button class="btn-ghost w-8 h-8 rounded-md" @click="$emit('update:modelValue', false)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5">
              <form class="space-y-4" @submit.prevent="handleSubmit">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Class Name *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g. Computer Science A"
                    class="input-field"
                    :class="errors.name ? 'error' : ''"
                  />
                  <p v-if="errors.name" class="text-xs text-red-400">{{ errors.name }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Department *</label>
                  <AppSelect
                    v-model="form.departmentId"
                    :options="departmentOptions"
                    placeholder="Select department"
                    :error="errors.departmentId"
                  />
                  <p v-if="errors.departmentId" class="text-xs text-red-400">{{ errors.departmentId }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Academic Year *</label>
                    <input
                      v-model="form.academicYear"
                      type="text"
                      placeholder="e.g. 2024-2025"
                      class="input-field"
                      :class="errors.academicYear ? 'error' : ''"
                    />
                    <p v-if="errors.academicYear" class="text-xs text-red-400">{{ errors.academicYear }}</p>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Generation *</label>
                    <input
                      v-model.number="form.generation"
                      type="number"
                      placeholder="e.g. 10"
                      class="input-field"
                      :class="errors.generation ? 'error' : ''"
                    />
                    <p v-if="errors.generation" class="text-xs text-red-400">{{ errors.generation }}</p>
                  </div>
                </div>
              </form>
            </div>

            <div class="flex items-center justify-between gap-3 px-6 py-4 shrink-0" style="border-top: 1px solid var(--surface-border)">
              <button class="btn border border-slate-300 text-sm" @click="$emit('update:modelValue', false)">Cancel</button>
              <button class="btn-primary" :disabled="loading" @click="handleSubmit">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ classObj?.id ? 'Update Class' : 'Create Class' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Class, Department } from '~/types'
import type { ClassFormData } from '~/services/class.service'
import AppSelect, { type SelectOption } from '~/components/common/AppSelect.vue'
import { validateForm, isRequired, hasErrors } from '~/utils/validators'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  classObj?: Class | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: ClassFormData): void
}>()

const departmentStore = useDepartmentStore()
const {departments} = storeToRefs(departmentStore)

const errors = ref<Record<string, string>>({})

const form = reactive({
  name: '',
  departmentId: '',
  academicYear: '',
  generation: null as number | null,
})

const departmentOptions = computed<SelectOption[]>(() => 
  departments.value.map(d => ({
    value: d.id,
    label: d.name,
    image: d.thumbnail ? `http://localhost:8080/api/v1/uploads/department/${d.thumbnail}` : undefined
  }))
)

const hydrateForm = () => {
  form.name = props.classObj?.name ?? ''
  form.departmentId = props.classObj?.departmentId ?? ''
  form.academicYear = props.classObj?.academicYear ?? ''
  form.generation = props.classObj?.generation ?? null
  errors.value = {}
}

watch(() => props.modelValue, (opened) => {
  if (opened) {
    hydrateForm()
  }
})

const handleSubmit = () => {
  errors.value = validateForm(form, {
    name: [v => isRequired(v, 'Class name')],
    departmentId: [v => isRequired(v, 'Department')],
    academicYear: [v => isRequired(v, 'Academic year')],
    generation: [v => isRequired(v, 'Generation')],
  })

  if (hasErrors(errors.value)) return

  emit('submit', {
    name: form.name.trim(),
    departmentId: form.departmentId,
    academicYear : form.academicYear.trim(),
    generation: Number(form.generation),
  })
}
</script>
