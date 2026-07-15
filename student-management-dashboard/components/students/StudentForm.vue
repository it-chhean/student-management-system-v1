<script setup lang="ts">
import type { Student, StudentAddress } from '~/types'
import { validateForm, isRequired, isEmail, hasErrors } from '~/utils/validators'

interface StudentFormPayload extends Omit<typeof form, 'phoneNumber'> {
  phone: string
}

const props = defineProps<{
  modelValue: boolean
  student?: Partial<Student>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: StudentFormPayload): void
}>()

const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const createEmptyAddress = (): StudentAddress => ({
  houseNumber: '',
  street: '',
  sangkat: '',
  khan: '',
  province: '',
  country: 'Cambodia',
})

const form = reactive({
  khFirstName: props.student?.khFirstName ?? '',
  khLastName: props.student?.khLastName ?? '',
  enFirstName: props.student?.enFirstName ?? '',
  enLastName: props.student?.enLastName ?? '',
  email: props.student?.email ?? '',
  phoneNumber: props.student?.phoneNumber ?? '',
  gender: (props.student?.gender === 'M' || props.student?.gender === 'F') ? props.student.gender : '',
  dateOfBirth: props.student?.dateOfBirth ? props.student.dateOfBirth.split('T')[0] : '',
  enrollmentDate: props.student?.enrollmentDate
    ? props.student.enrollmentDate.split('T')[0]
    : new Date().toISOString().split('T')[0],
  classId: props.student?.classId ?? '',
  address: typeof props.student?.address === 'object' ? { ...props.student.address } : createEmptyAddress(),
})

watch(() => props.modelValue, (val) => {
  if (val) {
    errors.value = {}
    const s = props.student
    form.khFirstName = s?.khFirstName ?? ''
    form.khLastName = s?.khLastName ?? ''
    form.enFirstName = s?.enFirstName ?? ''
    form.enLastName = s?.enLastName ?? ''
    form.email = s?.email ?? ''
    form.phoneNumber = s?.phoneNumber ?? ''
    form.gender = (s?.gender === 'M' || s?.gender === 'F') ? s.gender : ''
    form.dateOfBirth = s?.dateOfBirth ? s.dateOfBirth.split('T')[0] : ''
    form.enrollmentDate = s?.enrollmentDate
      ? s.enrollmentDate.split('T')[0]
      : new Date().toISOString().split('T')[0]
    form.classId = s?.classId ?? ''
    form.address = typeof s?.address === 'object' ? { ...s.address } : createEmptyAddress()
  }
})

const handleSubmit = async (): Promise<void> => {
  errors.value = validateForm(form, {
    khFirstName: [v => isRequired(v, 'Khmer First Name')],
    khLastName: [v => isRequired(v, 'Khmer Last Name')],
    enFirstName: [v => isRequired(v, 'English First Name')],
    enLastName: [v => isRequired(v, 'English Last Name')],
    email: [v => isRequired(v, 'Email'), v => isEmail(v as string)],
    phoneNumber: [v => isRequired(v, 'Phone Number')],
    gender: [v => isRequired(v, 'Gender')],
    dateOfBirth: [v => isRequired(v, 'Date of Birth')],
    classId: [v => isRequired(v, 'Class ID')],
    enrollmentDate: [v => isRequired(v, 'Enrollment Date')],
  })

  if (hasErrors(errors.value)) return

  submitting.value = true
  try {
    const { phoneNumber, ...rest } = form
    const payload = { ...rest, phone: phoneNumber } satisfies StudentFormPayload
    emit('submit', payload)
    emit('update:modelValue', false)
  } finally {
    submitting.value = false
  }
}
</script>

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
            class="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-md shadow-modal overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 shrink-0"
              style="border-bottom: 1px solid var(--surface-border)"
            >
              <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">
                {{ student?.id ? 'Edit Student' : 'Add New Student' }}
              </h2>
              <button class="btn-ghost w-8 h-8 rounded-lg" @click="$emit('update:modelValue', false)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Name (Khmer) -->
                <div class="space-y-4">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-primary-400">Khmer Name</p>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">First Name (KH) *</label>
                      <input v-model="form.khFirstName" type="text" placeholder="មករា" class="input-field"
                        :class="errors.khFirstName ? 'error' : ''" />
                      <p v-if="errors.khFirstName" class="text-xs text-red-400">{{ errors.khFirstName }}</p>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Last Name (KH) *</label>
                      <input v-model="form.khLastName" type="text" placeholder="សុខ" class="input-field"
                        :class="errors.khLastName ? 'error' : ''" />
                      <p v-if="errors.khLastName" class="text-xs text-red-400">{{ errors.khLastName }}</p>
                    </div>
                  </div>
                </div>

                <!-- Name (English) -->
                <div class="space-y-4">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-primary-400">English Name</p>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">First Name (EN) *</label>
                      <input v-model="form.enFirstName" type="text" placeholder="Makara" class="input-field"
                        :class="errors.enFirstName ? 'error' : ''" />
                      <p v-if="errors.enFirstName" class="text-xs text-red-400">{{ errors.enFirstName }}</p>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Last Name (EN) *</label>
                      <input v-model="form.enLastName" type="text" placeholder="Sok" class="input-field"
                        :class="errors.enLastName ? 'error' : ''" />
                      <p v-if="errors.enLastName" class="text-xs text-red-400">{{ errors.enLastName }}</p>
                    </div>
                  </div>
                </div>

                <!-- Basic Info -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Gender *</label>
                    <select v-model="form.gender" class="input-field" :class="errors.gender ? 'error' : ''">
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                    <p v-if="errors.gender" class="text-xs text-red-400">{{ errors.gender }}</p>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Date of Birth *</label>
                    <input v-model="form.dateOfBirth" type="date" class="input-field" :class="errors.dateOfBirth ? 'error' : ''" />
                    <p v-if="errors.dateOfBirth" class="text-xs text-red-400">{{ errors.dateOfBirth }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Email *</label>
                    <input v-model="form.email" type="email" placeholder="student@example.com" class="input-field"
                      :class="errors.email ? 'error' : ''" />
                    <p v-if="errors.email" class="text-xs text-red-400">{{ errors.email }}</p>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Phone Number *</label>
                    <input v-model="form.phoneNumber" type="tel" placeholder="012345678" class="input-field"
                      :class="errors.phoneNumber ? 'error' : ''" />
                    <p v-if="errors.phoneNumber" class="text-xs text-red-400">{{ errors.phoneNumber }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Class ID *</label>
                    <input v-model="form.classId" type="text" placeholder="Enter Class ID" class="input-field"
                      :class="errors.classId ? 'error' : ''" />
                    <p v-if="errors.classId" class="text-xs text-red-400">{{ errors.classId }}</p>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Enrollment Date *</label>
                    <input v-model="form.enrollmentDate" type="date" class="input-field" :class="errors.enrollmentDate ? 'error' : ''" />
                    <p v-if="errors.enrollmentDate" class="text-xs text-red-400">{{ errors.enrollmentDate }}</p>
                  </div>
                </div>

                <!-- Address -->
                <div class="space-y-4">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-primary-400">Address Details</p>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">House Number</label>
                      <input v-model="form.address.houseNumber" type="text" placeholder="123" class="input-field" />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Street</label>
                      <input v-model="form.address.street" type="text" placeholder="St 271" class="input-field" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Sangkat</label>
                      <input v-model="form.address.sangkat" type="text" placeholder="Sangkat" class="input-field" />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Khan</label>
                      <input v-model="form.address.khan" type="text" placeholder="Khan" class="input-field" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Province</label>
                      <input v-model="form.address.province" type="text" placeholder="Phnom Penh" class="input-field" />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold" style="color: var(--text-secondary)">Country</label>
                      <input v-model="form.address.country" type="text" placeholder="Cambodia" class="input-field" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between gap-3 px-6 py-4 shrink-0"
              style="border-top: 1px solid var(--surface-border)"
            >
              <button class="btn-ghost text-sm" @click="$emit('update:modelValue', false)">Cancel</button>
              <button class="btn-primary" :disabled="submitting" @click="handleSubmit">
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ student?.id ? 'Save Changes' : 'Add Student' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
