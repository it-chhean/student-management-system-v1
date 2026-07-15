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
                {{ subject?.id ? 'Edit Subject' : 'Create Subject' }}
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
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Department *</label>
                  <AppSelect
                    v-model="form.departmentId"
                    :options="departmentOptions"
                    placeholder="Select department"
                    :error="errors.departmentId"
                  />
                  <p v-if="errors.departmentId" class="text-xs text-red-400">{{ errors.departmentId }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Subject Name *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g. Data Structures & Algorithms"
                    class="input-field"
                    :class="errors.name ? 'error' : ''"
                  />
                  <p v-if="errors.name" class="text-xs text-red-400">{{ errors.name }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Description *</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    placeholder="Subject description..."
                    class="input-field resize-none"
                    :class="errors.description ? 'error' : ''"
                  />
                  <p v-if="errors.description" class="text-xs text-red-400">{{ errors.description }}</p>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Thumbnail</label>
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 rounded-md overflow-hidden shrink-0" style="background: var(--surface-hover)">
                      <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Subject thumbnail" class="w-full h-full object-cover">
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="w-7 h-7" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        class="hidden"
                        @change="onPickImage"
                      >
                      <button type="button" class="btn-secondary text-xs py-2 px-3" @click="fileInput?.click()">
                        Choose Image
                      </button>
                      <p class="text-xs mt-1.5" style="color: var(--text-muted)">PNG, JPG, or WebP. Max 2MB.</p>
                    </div>
                  </div>
                  <p v-if="errors.image" class="text-xs text-red-400">{{ errors.image }}</p>
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
                {{ subject?.id ? 'Update Subject' : 'Create Subject' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Subject, Department } from '~/types'
import AppSelect, { type SelectOption } from '~/components/common/AppSelect.vue'
import { departmentService } from '~/services/department.service'
import { validateForm, isRequired, hasErrors } from '~/utils/validators'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  subject?: Partial<Subject> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: { departmentId: string; name: string; description: string; image: File | null }): void
}>()

const departemntStore = useDepartmentStore()
const { departments , loading , error } = storeToRefs(departemntStore)

const {fetchDepartment} = departemntStore

const fileInput = ref<HTMLInputElement | null>(null)
const errors = ref<Record<string, string>>({})
const imageFile = ref<File | null>(null)
const thumbnailPreview = ref('')
const form = reactive({
  departmentId: '',
  name: '',
  description: '',
})

const departmentOptions = computed<SelectOption[]>(() => 
  departments.value.map(d => ({
    value: d.id,
    label: d.name,
    image: d.thumbnail ? `http://localhost:8080/api/v1/uploads/department/${d.thumbnail}` : undefined
  }))
)


const hydrateForm = () => {
  form.departmentId = props.subject?.departmentId ?? ''
  form.name = props.subject?.name ?? ''
  form.description = props.subject?.description ?? ''
  imageFile.value = null
  thumbnailPreview.value = props.subject?.thumbnail
    ? `http://localhost:8080/api/v1/uploads/subject/${props.subject.thumbnail}`
    : ''
  errors.value = {}
}

watch(() => props.modelValue, (opened) => {
  if (opened) {
    hydrateForm()
    if (!departments.value.length) fetchDepartment()
  }
})

watch(() => props.subject, () => {
  if (props.modelValue) hydrateForm()
})

const onPickImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    errors.value.image = 'Image must be less than 2MB'
    return
  }

  errors.value.image = ''
  imageFile.value = file
  thumbnailPreview.value = URL.createObjectURL(file)
}

const handleSubmit = () => {
  errors.value = validateForm(form, {
    departmentId: [v => isRequired(v, 'Department')],
    name: [v => isRequired(v, 'Subject name')],
    description: [v => isRequired(v, 'Description')],
  })

  if (hasErrors(errors.value)) return

  emit('submit', {
    departmentId: form.departmentId,
    name: form.name.trim(),
    description: form.description.trim(),
    image: imageFile.value,
  })
}
</script>
