<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div v-if="modelValue" class="fixed inset-0 z-[8000] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.65); backdrop-filter: blur(6px)"
        @click.self="$emit('update:modelValue', false)">
        <Transition name="modal">
          <div v-if="modelValue" class="w-full max-w-xl flex flex-col rounded-lg shadow-modal overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 shrink-0"
              style="border-bottom: 1px solid var(--surface-border)">
              <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">
                Import Students from Excel
              </h2>
              <button class="btn-ghost w-8 h-8 rounded-md" @click="$emit('update:modelValue', false)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <!-- Class Selection -->
              <div class="space-y-2">
                <label class="text-sm font-semibold" style="color: var(--text-secondary)">Select Class *</label>
                <select class="block input-field py-2 text-sm w-full"
                  @change="$event => classId = ($event.target as HTMLSelectElement)?.value || null">
                  <option value="">All Class</option>
                  <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>

              <!-- File Upload -->
              <div class="space-y-2">
                <label class="text-sm font-semibold" style="color: var(--text-secondary)">Excel File *</label>
                <div class="border-2 border-dashed rounded-md p-8 text-center transition-all cursor-pointer"
                  :class="file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[var(--surface-border)] hover:border-primary-500/50 hover:bg-primary-500/5'"
                  @click="triggerFileInput">
                  <input ref="fileInput" type="file" class="hidden" accept=".xlsx, .xls" @change="handleFileChange" />

                  <div v-if="!file" class="space-y-3">
                    <div class="mx-auto w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                      <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium" style="color: var(--text-primary)">Click to upload or drag and drop
                      </p>
                      <p class="text-xs mt-1" style="color: var(--text-muted)">Excel files only (.xlsx, .xls)</p>
                    </div>
                  </div>

                  <div v-else
                    class="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-emerald-500/30">
                    <div class="flex items-center gap-3 text-left">
                      <div
                        class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold truncate max-w-[250px]" style="color: var(--text-primary)">{{
                          file.name }}</p>
                        <p class="text-[10px]" style="color: var(--text-muted)">{{ (file.size / 1024).toFixed(1) }} KB
                        </p>
                      </div>
                    </div>
                    <button class="btn-ghost w-8 h-8 rounded-full text-red-400 hover:bg-red-500/10"
                      @click.stop="removeFile">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Potential Students Preview -->
              <div v-if="potentialStudents.length > 0" class="space-y-3">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold uppercase tracking-wider text-primary-400">Potential Students Preview ({{
                    potentialStudents.length }})</p>
                </div>
                <div class="rounded-xl border border-[var(--surface-border)] overflow-hidden">
                  <div class="max-h-48 overflow-y-auto">
                    <table class="w-full text-left text-[11px]">
                      <thead class="sticky top-0 bg-[var(--surface-card)]"
                        style="border-bottom: 1px solid var(--surface-border)">
                        <tr>
                          <th class="px-4 py-2 font-semibold">Name</th>
                          <th class="px-4 py-2 font-semibold">Email</th>
                          <th class="px-4 py-2 font-semibold text-center">Gender</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-[var(--surface-border)]">
                        <tr v-for="(s, i) in potentialStudents" :key="i" class="hover:bg-white/5">
                          <td class="px-4 py-2">{{ s.enFirstName }} {{ s.enLastName }}</td>
                          <td class="px-4 py-2 text-[var(--text-muted)]">{{ s.email }}</td>
                          <td class="px-4 py-2 text-center">{{ s.gender }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
              style="border-top: 1px solid var(--surface-border)">
              <button class="btn-ghost text-sm" @click="$emit('update:modelValue', false)">Cancel</button>
              <button class="btn-primary px-6" :disabled="!canImport || importing" @click="handleImport">
                <svg v-if="importing" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ importing ? 'Importing...' : 'Import Students' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const classStore = useClassStore()
const { classes } = storeToRefs(classStore)

const classId = ref<string | null>(null)
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const loadingClasses = ref(false)
const potentialStudents = ref<any[]>([])

const canImport = computed(() => classId.value && file.value)


watch(() => props.modelValue, (val) => {
  if (val) {
    classId.value = null
    file.value = null
    potentialStudents.value = []
  }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    file.value = input.files[0]
    // Mock potential students preview
    potentialStudents.value = [
      { enFirstName: 'John', enLastName: 'Doe', email: 'john.doe@example.com', gender: 'M' },
      { enFirstName: 'Jane', enLastName: 'Smith', email: 'jane.smith@example.com', gender: 'F' },
      { enFirstName: 'Alex', enLastName: 'Johnson', email: 'alex.j@example.com', gender: 'M' },
    ]
  }
}

const removeFile = () => {
  file.value = null
  potentialStudents.value = []
  if (fileInput.value) fileInput.value.value = ''
}

const handleImport = async () => {
  if (!canImport.value || !file.value || !classId.value) return

  importing.value = true
  const studentStore = useStudentStore()
  const toast = useToast()

  try {
    await studentStore.importStudents(classId.value, file.value)
    toast.success('Import Successful', `${potentialStudents.value.length} students have been imported.`)
    emit('success')
    emit('update:modelValue', false)
  } catch (err: any) {
    toast.error('Import Failed', err.message || 'Something went wrong during import.')
  } finally {
    importing.value = false
  }
}

</script>

<style scoped>
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-enter-active {
  animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  animation: modal-in 0.2s ease-in reverse;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
