
// ─── Role Constants ──────────────────────────────────────────────────────────

/** Role identifiers exactly as stored in the backend JWT payload. */
export const ROLE = {
  ADMIN: 'ROLE_ADMIN',
  STAFF: 'ROLE_STAFF',
} as const

export type AppRole = typeof ROLE[keyof typeof ROLE]

/** Human-readable display labels keyed by full role string. */
export const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: 'Administrator',
  ROLE_STAFF: 'Staff',
  // legacy short names (kept for backward compat)
  admin: 'Administrator',
  teacher: 'Teacher',
  student: 'Student',
  staff: 'Staff',
}

export interface NavItem {
  label: string
  icon: string
  to: string
  roles?: string[]
  badge?: string | number | null
  children?: { label: string; to: string; icon?: string }[]
}

export interface NavSection {
  section: string
  items: NavItem[]
}

export const NAV_ITEMS: NavSection[] = [
  {
    section: 'OVERVIEW',
    items: [
      { label: 'Dashboard', icon: 'grid', to: '/dashboard' },
    ],
  },
  {
    section: 'ACADEMIC',
    items: [
      {
        label: 'Students',
        icon: 'graduate',
        to: '/students',
        badge: null,
        roles: [ROLE.ADMIN, ROLE.STAFF],
      },
      {
        label: 'Users',
        icon: 'users',
        to: '/users',
        roles: [ROLE.ADMIN],
      },
      {
        label: 'Academic',
        icon: 'layers',
        to: '/academic',
        roles: [ROLE.ADMIN, ROLE.STAFF],
        children: [
          { label: 'Departments', to: '/departments' },
          { label: 'Semesters',   to: '/semesters' },
          { label: 'Subject',     to: '/subjects' },
          { label: 'Courses',     to: '/courses' },
          { label: 'Classes',     to: '/classes' },
        ],
      },
    ],
  },
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Attendance', icon: 'calendar-check', to: '/attendance', roles: [ROLE.ADMIN, ROLE.STAFF] },
      { label: 'Grades',     icon: 'award',          to: '/grades',     roles: [ROLE.ADMIN, ROLE.STAFF] },
      { label: 'Payments',   icon: 'credit-card',    to: '/payments',   roles: [ROLE.ADMIN, ROLE.STAFF] },
      { label: 'Schedule',   icon: 'clock',          to: '/schedule',   roles: [ROLE.ADMIN, ROLE.STAFF] },
    ],
  },
  {
    section: 'ANALYTICS',
    items: [
      { label: 'Reports', icon: 'bar-chart-2', to: '/reports', roles: [ROLE.ADMIN] },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      {
        label: 'Access Control',
        icon: 'shield',
        to: '/admin',
        roles: [ROLE.ADMIN],
        children: [
          { label: 'Roles', to: '/admin/roles' },
          { label: 'Permissions', to: '/admin/permissions' },
          { label: 'Audit Logs', icon: 'activity', to: '/admin/audit' },
        ],
      },
      { label: 'Settings', icon: 'settings', to: '/settings' },
    ],
  },
]

// Statuses
export const STUDENT_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

export const TEACHER_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

export const COURSE_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
]

export const PAYMENT_STATUSES = [
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' },
]

export const ATTENDANCE_STATUSES = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Excused', value: 'excused' },
]

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const PAYMENT_TYPES = [
  { label: 'Tuition', value: 'tuition' },
  { label: 'Registration', value: 'registration' },
  { label: 'Exam Fee', value: 'exam' },
  { label: 'Library', value: 'library' },
  { label: 'Hostel', value: 'hostel' },
  { label: 'Other', value: 'other' },
]

// Tablee Config 
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
export const DEFAULT_PAGE_SIZE = 10

// Academic
export const SEMESTERS = [
  { label: 'Semster I', value: 'Semester I' },
  { label: 'Semester II', value: 'Semester II' },
]

export const ACADEMIC_YEARS = [
  { label: '2024–2025', value: '2024-2025' },
  { label: '2023–2024', value: '2023-2024' },
  { label: '2022–2023', value: '2022-2023' },
]

export const GRADE_LETTERS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']

export const DAYS_OF_WEEK = [
  { label: 'Sunday', short: 'Sun', value: 0 },
  { label: 'Monday', short: 'Mon', value: 1 },
  { label: 'Tuesday', short: 'Tue', value: 2 },
  { label: 'Wednesday', short: 'Wed', value: 3 },
  { label: 'Thursday', short: 'Thu', value: 4 },
  { label: 'Friday', short: 'Fri', value: 5 },
  { label: 'Saturday', short: 'Sat', value: 6 },
]

export const COURSE_WEEKDAYS = [
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
  { label: 'Sunday', value: 'SUNDAY' },
]
