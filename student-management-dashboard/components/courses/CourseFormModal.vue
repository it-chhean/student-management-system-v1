<script setup lang="ts">
import type { Course, Subject, Semester, Instructor } from '~/types'
import type { CourseFormData } from '~/services/course.service'
import AppSelect, { type SelectOption } from '~/components/common/AppSelect.vue'
import { subjectService } from '~/services/subject.service'
import { semesterService } from '~/services/semester.service'
import { instructorService } from '~/services/instructor.service'
import { COURSE_WEEKDAYS } from '~/utils/constants'
import { validateForm, isRequired, hasErrors, isMinLength, isMaxLength } from '~/utils/validators'

interface ScheduleSlot {
  dayOfWeek: string
  startTime: string
  endTime: string
  room: number | null
}

interface ScheduleError {
  [field: string]: string
}

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  course?: Partial<Course> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: CourseFormData): void
}>()

const { public: { apiBaseUrl } } = useRuntimeConfig()
const toast = useToast()

const subjects = ref<Subject[]>([])
const semesters = ref<Semester[]>([])
const instructors = ref<Instructor[]>([])
const errors = ref<Record<string, string>>({})
const scheduleErrors = ref<Record<number, ScheduleError>>({})

const subjectOptions = computed<SelectOption[]>(() =>
  subjects.value.map(s => ({
    value: s.id,
    label: s.name,
    description: s.code,
    image: s.thumbnail ? `${apiBaseUrl}/v1/uploads/subject/${s.thumbnail}` : undefined,
  })),
)

const semesterOptions = computed<SelectOption[]>(() =>
  semesters.value.map(s => ({
    value: s.id,
    label: s.name,
    description: `${s.startDate} - ${s.endDate}`,
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  })),
)

const instructorOptions = computed<SelectOption[]>(() =>
  instructors.value.map(i => ({
    value: i.id,
    label: i.fullName,
    image: i.avatar ?? undefined,
  })),
)

const emptySchedule = (): ScheduleSlot => ({
  dayOfWeek: '',
  startTime: '',
  endTime: '',
  room: null,
})

const form = reactive({
  subjectId: '',
  semesterId: '',
  instructorId: '',
  name: '',
  description: '',
  startAt: '',
  endAt: '',
  schedules: [emptySchedule()],
})

const toDateInput = (value?: string): string => {
  if (!value) return ''
  return value.length >= 10 ? value.slice(0, 10) : value
}

const fetchOptions = async (): Promise<void> => {
  const [subjList, semList, instList] = await Promise.all([
    subjects.value.length ? Promise.resolve(subjects.value) : subjectService.getAll(),
    semesters.value.length ? Promise.resolve(semesters.value) : semesterService.getAll(),
    instructors.value.length ? Promise.resolve(instructors.value) : instructorService.getAll(),
  ])
  subjects.value = subjList
  semesters.value = semList
  instructors.value = instList
}

const hydrateForm = (): void => {
  form.subjectId = props.course?.subjectId ?? ''
  form.semesterId = props.course?.semesterId ?? ''
  form.instructorId = props.course?.instructorId ?? ''
  form.name = props.course?.name ?? ''
  form.description = props.course?.description ?? ''
  form.startAt = toDateInput(props.course?.startAt)
  form.endAt = toDateInput(props.course?.endAt)
  form.schedules = props.course?.schedules?.length
    ? props.course.schedules.map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
      }))
    : [emptySchedule()]
  errors.value = {}
  scheduleErrors.value = {}
}

watch(() => props.modelValue, (opened) => {
  if (opened) {
    hydrateForm()
    fetchOptions().catch((error) => {
      console.error('Failed to load course form options', error)
      toast.error('Failed to load form options. Please try again.')
    })
  }
})

watch(() => props.course, () => {
  if (props.modelValue) hydrateForm()
})

const addScheduleRow = (): void => {
  form.schedules.push(emptySchedule())
}

const removeScheduleRow = (index: number): void => {
  form.schedules.splice(index, 1)
}

const buildScheduleSummary = (schedules: CourseFormData['schedules']): string =>
  schedules
    .map(s => `${s.dayOfWeek} ${s.startTime}-${s.endTime} (Room ${s.room})`)
    .join('; ')

const validateSchedules = (): boolean => {
  const rowErrors: Record<number, ScheduleError> = {}
  form.schedules.forEach((slot, index) => {
    const row: ScheduleError = {}
    if (!slot.dayOfWeek) row.dayOfWeek = 'Day is required'
    if (!slot.startTime) row.startTime = 'Start time is required'
    if (!slot.endTime) row.endTime = 'End time is required'
    if (slot.startTime && slot.endTime && slot.endTime <= slot.startTime) {
      row.endTime = 'End time must be after start time'
    }
    if (slot.room === null || slot.room === undefined || Number.isNaN(slot.room)) {
      row.room = 'Room is required'
    } else if (slot.room < 1) {
      row.room = 'Room must be a positive number'
    }
    if (Object.keys(row).length) rowErrors[index] = row
  })
  scheduleErrors.value = rowErrors
  return Object.keys(rowErrors).length === 0
}

const handleSubmit = (): void => {
  errors.value = validateForm(form, {
    subjectId: [v => isRequired(v, 'Subject')],
    semesterId: [v => isRequired(v, 'Semester')],
    instructorId: [v => isRequired(v, 'Instructor')],
    name: [
      v => isRequired(v, 'Course name'),
      v => isMinLength(2)(String(v)),
      v => isMaxLength(50)(String(v)),
    ],
    description: [
      v => isRequired(v, 'Description'),
      v => isMinLength(5)(String(v)),
      v => isMaxLength(100)(String(v)),
    ],
    startAt: [v => isRequired(v, 'Start date')],
    endAt: [v => isRequired(v, 'End date')],
  })

  if (form.startAt && form.endAt && form.endAt <= form.startAt) {
    errors.value.endAt = 'End date must be after start date'
  }

  if (!form.schedules.length) {
    errors.value.schedules = 'At least one schedule slot is required'
  }

  const schedulesValid = validateSchedules()
  if (!schedulesValid && !errors.value.schedules) {
    errors.value.schedules = 'Please fix schedule slot errors'
  }

  if (hasErrors(errors.value) || !schedulesValid) return

  const schedules = form.schedules.map(s => ({
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
    room: Number(s.room),
  }))

  emit('submit', {
    subjectId: form.subjectId,
    semesterId: form.semesterId,
    instructorId: form.instructorId,
    name: form.name.trim(),
    description: form.description.trim(),
    schedule: buildScheduleSummary(schedules),
    schedules,
    startAt: form.startAt,
    endAt: form.endAt,
  })
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
            class="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-md shadow-modal overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)"
          >
            <div
              class="flex items-center justify-between px-6 py-4 shrink-0"
              style="border-bottom: 1px solid var(--surface-border)"
            >
              <h2 class="font-display font-bold text-lg" style="color: var(--text-primary)">
                {{ course?.id ? 'Edit Course' : 'Create Course' }}
              </h2>
              <button class="btn-ghost w-8 h-8 rounded-lg" @click="$emit('update:modelValue', false)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5">
              <form class="space-y-5" @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Subject *</label>
                    <AppSelect
                      v-model="form.subjectId"
                      :options="subjectOptions"
                      placeholder="Select subject"
                      :error="errors.subjectId"
                    />
                    <p v-if="errors.subjectId" class="text-xs text-red-400">{{ errors.subjectId }}</p>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Semester *</label>
                    <AppSelect
                      v-model="form.semesterId"
                      :options="semesterOptions"
                      placeholder="Select semester"
                      :error="errors.semesterId"
                    />
                    <p v-if="errors.semesterId" class="text-xs text-red-400">{{ errors.semesterId }}</p>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Instructor *</label>
                  <AppSelect
                    v-model="form.instructorId"
                    :options="instructorOptions"
                    placeholder="Select instructor"
                    :error="errors.instructorId"
                  />
                  <p v-if="errors.instructorId" class="text-xs text-red-400">{{ errors.instructorId }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold" style="color: var(--text-secondary)">Course Name *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    maxlength="50"
                    placeholder="e.g. Data Structures — Section A"
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
                    maxlength="100"
                    placeholder="Course description..."
                    class="input-field resize-none"
                    :class="errors.description ? 'error' : ''"
                  />
                  <p v-if="errors.description" class="text-xs text-red-400">{{ errors.description }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Start Date *</label>
                    <input
                      v-model="form.startAt"
                      type="date"
                      class="input-field"
                      :class="errors.startAt ? 'error' : ''"
                    />
                    <p v-if="errors.startAt" class="text-xs text-red-400">{{ errors.startAt }}</p>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">End Date *</label>
                    <input
                      v-model="form.endAt"
                      type="date"
                      class="input-field"
                      :class="errors.endAt ? 'error' : ''"
                    />
                    <p v-if="errors.endAt" class="text-xs text-red-400">{{ errors.endAt }}</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-semibold" style="color: var(--text-secondary)">Weekly Schedule *</label>
                    <button type="button" class="btn-secondary text-xs py-1.5 px-3" @click="addScheduleRow">
                      Add slot
                    </button>
                  </div>

                  <p v-if="errors.schedules" class="text-xs text-red-400">{{ errors.schedules }}</p>

                  <div
                    v-for="(slot, index) in form.schedules"
                    :key="index"
                    class="rounded-md p-4 space-y-3"
                    style="background: var(--surface-hover); border: 1px solid var(--surface-border)"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-semibold" style="color: var(--text-muted)">Slot {{ index + 1 }}</span>
                      <button
                        v-if="form.schedules.length > 1"
                        type="button"
                        class="text-xs text-red-400 hover:text-red-300"
                        @click="removeScheduleRow(index)"
                      >
                        Remove
                      </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div class="space-y-1.5 sm:col-span-2">
                        <label class="text-xs" style="color: var(--text-muted)">Day</label>
                        <select
                          v-model="slot.dayOfWeek"
                          class="input-field py-2 text-sm"
                          :class="scheduleErrors[index]?.dayOfWeek ? 'error' : ''"
                        >
                          <option value="" disabled>Select day</option>
                          <option v-for="day in COURSE_WEEKDAYS" :key="day.value" :value="day.value">
                            {{ day.label }}
                          </option>
                        </select>
                        <p v-if="scheduleErrors[index]?.dayOfWeek" class="text-xs text-red-400">
                          {{ scheduleErrors[index].dayOfWeek }}
                        </p>
                      </div>

                      <div class="space-y-1.5">
                        <label class="text-xs" style="color: var(--text-muted)">Start time</label>
                        <input
                          v-model="slot.startTime"
                          type="time"
                          class="input-field py-2 text-sm"
                          :class="scheduleErrors[index]?.startTime ? 'error' : ''"
                        />
                        <p v-if="scheduleErrors[index]?.startTime" class="text-xs text-red-400">
                          {{ scheduleErrors[index].startTime }}
                        </p>
                      </div>

                      <div class="space-y-1.5">
                        <label class="text-xs" style="color: var(--text-muted)">End time</label>
                        <input
                          v-model="slot.endTime"
                          type="time"
                          class="input-field py-2 text-sm"
                          :class="scheduleErrors[index]?.endTime ? 'error' : ''"
                        />
                        <p v-if="scheduleErrors[index]?.endTime" class="text-xs text-red-400">
                          {{ scheduleErrors[index].endTime }}
                        </p>
                      </div>

                      <div class="space-y-1.5">
                        <label class="text-xs" style="color: var(--text-muted)">Room</label>
                        <input
                          v-model.number="slot.room"
                          type="number"
                          min="1"
                          placeholder="e.g. 101"
                          class="input-field py-2 text-sm"
                          :class="scheduleErrors[index]?.room ? 'error' : ''"
                        />
                        <p v-if="scheduleErrors[index]?.room" class="text-xs text-red-400">
                          {{ scheduleErrors[index].room }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div
              class="flex items-center justify-between gap-3 px-6 py-4 shrink-0"
              style="border-top: 1px solid var(--surface-border)"
            >
              <button class="btn-ghost text-sm" @click="$emit('update:modelValue', false)">Cancel</button>
              <button class="btn-primary" :disabled="loading" @click="handleSubmit">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ course?.id ? 'Update Course' : 'Create Course' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
