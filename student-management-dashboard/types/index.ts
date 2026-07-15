// core entity types 

export interface User {
  id: number
  fullName: string
  email: string
  role: string
  verified?: boolean
  status?: boolean | string
  avatar?: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  specialization?: string
  qualification?: string
  departmentId?: string
  department?: Department
  teacherId?: string
  createdAt: string
  updatedAt: string
}

export interface StudentAddress {
  id?: number
  houseNumber: string
  street: string
  sangkat: string
  khan: string
  province: string
  country: string
}

export interface Student {
  id: number
  departmentId: string
  departmentName: string
  studentId?: string
  studentCode?: string
  khFirstName: string
  khLastName: string
  enFirstName: string
  enLastName: string
  email: string
  phoneNumber?: string
  gender: 'M' | 'F' | 'male' | 'female' | 'other'
  dateOfBirth: string
  address: StudentAddress | string
  enrollmentDate: string
  status: boolean
  classId?: string
  className: string
  creationAt?: string
  updatedAt?: string
}

export interface StudentStats {
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  graduatedStudents: number
  suspendedStudents: number
  genderDistribution: {
    male: number
    female: number
    other: number
  }
}

export interface Teacher {
  id: number
  teacherId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  gender: 'male' | 'female' | 'other'
  specialization: string
  qualification: string
  departmentId: string
  department?: Department
  courseIds: string[]
  courses?: Course[]
  status: 'active' | 'inactive' | 'on-leave'
  hireDate: string
  salary?: number
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface CourseSchedule {
  id?: number
  dayOfWeek: string
  startTime: string
  endTime: string
  room: number
}

export interface Course {
  id: number
  subjectId: string
  subjectName?: string
  semesterId: string
  semesterName?: string
  instructorId: string
  instructorName?: string
  name: string
  description: string
  schedule?: string
  schedules?: CourseSchedule[]
  startAt: string
  endAt: string
}

export interface Instructor {
  id: number
  fullName: string
  avatar?: string
}

export interface Class {
  id: number
  name: string
  departmentId: string
  departmentName?: string
  academicYear: string
  generation: number
  createdAt?: string
  updatedAt?: string
}
export interface Department {
  id: number
  name: string
  description: string;
  thumbnail: string;
  creatoinAt: string;
  updatedAt: string
}

export interface Semester {
  id: number
  name: string
  startDate: string
  endDate: string
  description: string
}

export interface Subject {
  id: number
  departmentId: string
  departmentName: string
  thumbnail: string
  name: string
  description: string
  code: string
}

export interface AttendanceRecord {
  id: number
  studentId: string
  student?: Student
  courseId: string
  course?: Course
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  note?: string
  markedById: string
  createdAt: string
}

export interface Grade {
  id: number
  studentId: string
  student?: Student
  courseId: string
  course?: Course
  teacherId: string
  semester: string
  academicYear: string
  midtermScore?: number
  finalScore?: number
  assignmentScore?: number
  totalScore?: number
  letterGrade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F'
  gpaPoints?: number
  status: 'pending' | 'submitted' | 'approved'
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  studentId: string
  student?: Student
  amount: number
  currency: string
  type: 'tuition' | 'registration' | 'exam' | 'library' | 'hostel' | 'other'
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  semester: string
  academicYear: string
  invoiceNumber: string
  description?: string
  paymentMethod?: 'bank' | 'card' | 'cash' | 'online'
  createdAt: string
}

export interface Schedule {
  id: string
  courseId: string
  course?: Course
  teacherId: string
  teacher?: Teacher
  roomId?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  academicYear: string
  semester: string

  type: 'lecture' | 'lab' | 'seminar' | 'exam'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  link?: string
  createdAt: string
}

export interface Activity {
  id: string
  type: string
  description: string
  userId: string
  userName: string
  userAvatar?: string
  entityType?: string
  entityId?: string
  createdAt: string
}

// auth types 
export interface AuthUser {
  id: string
  fullName: string
  email: string
  bio?: string
  phoneNumber?: string
  avatar?: string
  verified: boolean;
  verificationToken: string;
  refreshToken: string;
  status: boolean;
  role: Role | string;
  attempt: number;
  lockTime: string
}

export interface Permission {
  id?: string
  name: string
  module: string
  status: boolean
  description: string
  createdAt?: string
}

export interface Role {
  id?: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | boolean
  description: string
  permissions?: Permission[] | string[]
  users?: User[] | string[]
}

export interface AuditLog {
  id: number
  action: 'INSERT' | 'UPDATE' | 'DELETE' | string
  changeAt: string
  recordId: string | number | null
  tableName: string
  oldData: any | null
  newData: any | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  role?: string[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// API Response types 
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  boolean: number;
  data: T
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: boolean
  status: number
  message?: string
  content: T[]
  number: number
  size: number
  totalPage: number
  totalElement: number
  hastPrevious: boolean
  hastNext: boolean
  timestamp: string
}

export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
  status?: number
}

// ui types
export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => string
}

export interface TableFilter {
  key: string
  label: string
  type: 'select' | 'text' | 'date' | 'range'
  options?: { label: string; value: string }[]
}

export interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ModalOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  type?: 'default' | 'danger' | 'warning' | 'success'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export interface NavItem {
  label: string
  icon: string
  to: string
  badge?: number | string
  children?: NavItem[]
}

// dashboard stats
export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  activeCourses: number
  totalRevenue: number
  attendanceRate: number
  averageGpa: number
  newStudentsThisMonth: number
  revenueGrowth: number
  studentsGrowth: number
  coursesGrowth: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}

// form types
export interface FormField {
  key: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'tel' | 'file'
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string | number }[]
  validation?: (value: unknown) => string | undefined
  disabled?: boolean
  hint?: string
}

export type FormErrors = Record<string, string>
