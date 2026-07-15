<template>
  <div v-if="student" class="space-y-6 animate-fade-in">
    <!-- Back + Header -->
    <div class="flex items-center gap-4">
      <button class="btn-ghost w-9 h-9 rounded-lg" @click="router.back()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="font-display text-xl font-bold" style="color: var(--text-primary)">Student Profile</h1>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary rounded-lg text-sm" @click="formOpen = true">Edit Profile</button>
        <button class="btn-danger rounded-lg text-sm" @click="handleDelete">Delete</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="stat-card rounded-lg p-6 flex flex-col items-center text-center">
        <div class="relative mb-4">
          <div class="rounded-full">

          </div>

          <AppAvatar :name="getFullName(student.enLastName as string , student.enLastName as string)" size="xl" />
          <!-- <div class="rounded-full flex items-center justify-center bg-indigo-100 text-indigo-500 font-semibold p-2 text-xl h-12">
            {{ student.enLastName?.charAt(0) }}
            {{ student.enFirstName?.charAt(0) }}
          </div> -->
          <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2"
            style="border-color: var(--surface-card)" />
        </div>

        <h2 class="font-display text-lg font-bold" style="color: var(--text-primary)">
          {{ student.enLastName }} {{ student.enFirstName }}
        </h2>
        <p class="text-sm mt-0.5 text-primary-400 font-mono">{{ student.studentCode }}</p>

        <AppBadge :variant="'success'" dot class="mt-3">
          {{ getStatusLabel(student.status ? "Active" : "Inactive") }}
        </AppBadge>

        <div class="divider w-full my-4" />

        <!-- Stats row -->
        <div class="grid grid-cols-2 gap-3 w-full">
          <div class="rounded-xl p-3" style="background: var(--surface-hover)">
            <!-- <div class="font-display text-xl font-bold" :class="gpaColor">{{ student.gpa.toFixed(2) }}</div> -->
            <div class="text-xs mt-0.5" style="color: var(--text-muted)">GPA</div>
          </div>
          <div class="rounded-xl p-3" style="background: var(--surface-hover)">
            <!-- <div class="font-display text-xl font-bold"
              :class="student.attendanceRate >= 75 ? 'text-emerald-400' : 'text-red-400'">
              {{ student.attendanceRate.toFixed(0) }}%
            </div> -->
            <div class="text-xs mt-0.5" style="color: var(--text-muted)">Attendance</div>
          </div>
        </div>

        <div class="divider w-full my-4" />

        <!-- Info list -->
        <div class="space-y-3 w-full text-left">
          <div v-for="info in infoList" :key="info.label" class="flex justify-between">
            <span class="text-xs" style="color: var(--text-muted)">{{ info.label }}</span>
            <span class="text-xs font-semibold" style="color: var(--text-primary)">{{ info.value }}</span>
          </div>
        </div>
      </div>

      <!-- Details Tabs -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Tabs -->
        <div class="stat-card rounded-2xl overflow-hidden">
          <div class="flex gap-0" style="border-bottom: 1px solid var(--surface-border)">
            <button v-for="tab in tabs" :key="tab" class="px-5 py-3.5 text-sm font-semibold transition-all relative"
              :class="activeTab === tab
                ? 'text-primary-400'
                : 'hover:text-[var(--text-primary)]'"
              :style="activeTab === tab ? 'color: #818cf8' : 'color: var(--text-muted)'" @click="activeTab = tab">
              {{ tab }}
              <span v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t" />
            </button>
          </div>

          <div class="p-5">
            <!-- Overview -->
            <div v-if="activeTab === 'Overview'" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div v-for="field in overviewFields" :key="field.label" class="space-y-1">
                  <label class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted)">{{
                    field.label }}</label>
                  <p class="text-sm font-medium" style="color: var(--text-primary)">{{ field.value || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Grades -->
            <div v-else-if="activeTab === 'Grades'" class="space-y-3">
              <div v-for="grade in mockGrades" :key="grade.course"
                class="flex items-center justify-between p-3 rounded-xl" style="background: var(--surface-hover)">
                <div>
                  <div class="text-sm font-semibold" style="color: var(--text-primary)">{{ grade.course }}</div>
                  <div class="text-xs" style="color: var(--text-muted)">{{ grade.semester }}</div>
                </div>
                <div class="text-right">
                  <div class="font-display text-lg font-bold" :class="gradeColor(grade.letter)">{{ grade.letter }}</div>
                  <div class="text-xs" style="color: var(--text-muted)">{{ grade.score }}/100</div>
                </div>
              </div>
            </div>

            <!-- Attendance -->
            <div v-else-if="activeTab === 'Attendance'" class="space-y-3">
              <div class="grid grid-cols-4 gap-3 mb-4">
                <div v-for="stat in attendanceStats" :key="stat.label" class="text-center p-3 rounded-xl"
                  style="background: var(--surface-hover)">
                  <div class="font-display text-xl font-bold" :style="`color: ${stat.color}`">{{ stat.value }}</div>
                  <div class="text-xs mt-0.5" style="color: var(--text-muted)">{{ stat.label }}</div>
                </div>
              </div>
              <div v-for="rec in mockAttendance" :key="rec.date" class="flex items-center justify-between py-2"
                style="border-bottom: 1px solid var(--surface-border)">
                <span class="text-sm" style="color: var(--text-secondary)">{{ rec.date }}</span>
                <span class="text-sm" style="color: var(--text-muted)">{{ rec.course }}</span>
                <AppBadge :variant="attendanceVariant(rec.status)" dot>{{ rec.status }}</AppBadge>
              </div>
            </div>

            <!-- Contact -->
            <div v-else-if="activeTab === 'Contact'" class="space-y-4">
              <div v-for="field in contactFields" :key="field.label" class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted)">{{
                  field.label }}</label>
                <p class="text-sm font-medium" style="color: var(--text-primary)">{{ field.value || '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <StudentForm v-model="formOpen" :student="student" @submit="handleUpdate" />
  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="space-y-6">
    <div class="skeleton h-8 w-48 rounded-lg" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="skeleton h-96 rounded-2xl" />
      <div class="lg:col-span-2 skeleton h-96 rounded-2xl" />
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()
const modal = useModal()
const toast = useToast()

const student = ref<Partial<Student>>({})
const loading = ref(true)
const formOpen = ref(false)
const activeTab = ref('Overview')
const tabs = ['Overview', 'Grades', 'Attendance', 'Contact']

const handleFetchStudentbyId = async (studentId: string) => {
  try {
    const response = await studentService.getById(studentId);
    if (response.success) {
      student.value = response.data;
      console.log(response.data)
    }
  } catch (e: any) {
    console.log("Failed to load student: ", e.message);
  }
}

useHead({ title: computed(() => student.value ? `${student.value.enFirstName} ${student.value.enLastName}` : 'Student') })

onMounted(async () => {
  await new Promise(r => setTimeout(r, 500))
  loading.value = false
})

const statusVariant = computed(() => {
  const map: Record<string, string> = { active: 'success', inactive: 'muted', graduated: 'info', suspended: 'danger' }
  return (map[student.value?.status ? "active" : "inactive"]);
})

const gpaColor = computed(() => {
  const gpa = 4.0
  return gpa >= 3.5 ? 'text-emerald-400' : gpa >= 2.5 ? 'text-primary-400' : 'text-amber-400'
})

const infoList = computed(() => [
  { label: 'Department', value: student.value?.departmentName ?? '—' },
  { label: 'Gender', value: student.value?.gender ?? '—' },
  { label: 'Enrolled', value: student.value.enrollmentDate ? formatDate(student.value.enrollmentDate) : '—' },
])

const overviewFields = computed(() => [
  { label: 'Student ID', value: student.value?.id },
  { label: 'Date of Birth', value: student.value?.dateOfBirth ? formatDate(student.value.dateOfBirth) : '' },
  { label: 'Gender', value: student.value?.gender },
  { label: 'Department', value: student.value?.departmentName },
  { label: 'Status', value: getStatusLabel(student.value?.status ? "Active" : "Inactive") },
  { label: 'Enrollment Date', value: student.value?.enrollmentDate ? formatDate(student.value.enrollmentDate) : '' },
])

const contactFields = computed(() => [
  { label: 'Email', value: student.value?.email },
  { label: 'Phone', value: student.value?.phoneNumber },
  { label: 'Address', value: student.value?.address }
])

const mockGrades = [
  { course: 'Data Structures', semester: 'Fall 2024', letter: 'A', score: 94 },
  { course: 'Calculus II', semester: 'Fall 2024', letter: 'B+', score: 87 },
  { course: 'Physics I', semester: 'Fall 2024', letter: 'A-', score: 91 },
  { course: 'Database Systems', semester: 'Spring 2024', letter: 'A+', score: 98 },
]

const gradeColor = (g: string) => ['A+', 'A', 'A-'].includes(g) ? 'text-emerald-400' : ['B+', 'B', 'B-'].includes(g) ? 'text-primary-400' : 'text-amber-400'

const mockAttendance = [
  { date: 'Dec 10, 2024', course: 'Data Structures', status: 'present' },
  { date: 'Dec 9, 2024', course: 'Calculus II', status: 'present' },
  { date: 'Dec 8, 2024', course: 'Physics I', status: 'absent' },
  { date: 'Dec 7, 2024', course: 'Data Structures', status: 'late' },
]

const attendanceStats = [
  { label: 'Present', value: 42, color: '#34d399' },
  { label: 'Absent', value: 5, color: '#f87171' },
  { label: 'Late', value: 3, color: '#fbbf24' },
  { label: 'Excused', value: 2, color: '#60a5fa' },
]

const attendanceVariant = (s: string) => {
  const m: Record<string, string> = { present: 'success', absent: 'danger', late: 'warning', excused: 'info' }
  return (m[s] ?? 'muted') as 'success' | 'danger' | 'warning' | 'info' | 'muted'
}

const handleUpdate = () => {
  toast.success('Student updated successfully')
}

const handleDelete = async () => {
  if (!student.value) return
  await modal.danger('Delete Student', 'This action cannot be undone.', async () => {
    await studentStore.deleteStudent(student.value.id as string)
    toast.success('Student deleted')
    router.push('/students')
  })
}


onMounted(() => {
  handleFetchStudentbyId((route.params.id as string));
})
</script>
